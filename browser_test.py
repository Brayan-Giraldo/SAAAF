"""Pruebas de interfaz SAAAF.

Uso normal: python tests/browser_test.py --mode http
Modo usado en el entorno de elaboracion: --mode dom
DOM usa Chromium real con HTML/CSS/JS originales de la entrega y un doble
Storage en memoria. No acredita navegacion HTTP, disco del navegador,
Tomcat, MySQL ni un telefono fisico. No se modifica la aplicacion con el doble.
"""
from pathlib import Path
from datetime import datetime, timezone
from playwright.sync_api import sync_playwright
import argparse, json, os, shutil, functools, threading, http.server, time, traceback

ROOT=Path(__file__).resolve().parents[2]
WEB=ROOT/'02_Aplicacion_Web'
OUT=ROOT/'04_Pruebas'
OUT.mkdir(exist_ok=True)
(OUT/'capturas').mkdir(exist_ok=True)
parser=argparse.ArgumentParser()
parser.add_argument('--mode',choices=['http','dom'],default='http')
args=parser.parse_args()
RESULTS=[]

class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*args): pass

def html_inline(seed=None,original=False):
    if original:
        html=(ROOT/'05_Fuentes_Originales/saaaf-html-code.html').read_text()
    else:
        html=(WEB/'index.html').read_text()
        html=html.replace('<link href="css/estilos.css" rel="stylesheet"/>','<style>'+(WEB/'css/estilos.css').read_text()+'</style>')
        for name in ['core','ui']:
            html=html.replace('<script defer="" src="js/'+name+'.js"></script>','<script>'+(WEB/'js'/f'{name}.js').read_text()+'</script>')
    shim="""<script>window.__storageData=SEED;Object.defineProperty(window,'localStorage',{value:{getItem:k=>Object.hasOwn(window.__storageData,k)?window.__storageData[k]:null,setItem:(k,v)=>{window.__storageData[k]=String(v)},removeItem:k=>delete window.__storageData[k],clear:()=>{window.__storageData={}}},configurable:true});</script>""".replace('SEED',json.dumps(seed or {}).replace('<','\\u003c'))
    return html.replace('<head>','<head>'+shim)

class Harness:
    def __init__(self,browser,url):
        self.context=browser.new_context(viewport={'width':1365,'height':900},accept_downloads=True)
        self.url=url; self.page=None; self.errors=[]
    def load(self,seed=None):
        if self.page: self.page.close()
        self.page=self.context.new_page();self.page.set_default_timeout(5000)
        self.page.on('pageerror',lambda err:self.errors.append(str(err)))
        if args.mode=='dom': self.page.set_content(html_inline(seed),wait_until='load')
        else:
            self.page.goto(self.url)
            if seed is not None:
                self.page.evaluate('(data)=>{localStorage.clear();Object.entries(data).forEach(([k,v])=>localStorage.setItem(k,v))}',seed)
                self.page.reload()
        return self.page
    def reload(self):
        if args.mode=='dom': self.load(self.page.evaluate('window.__storageData'))
        else: self.page.reload()
    def login(self):
        self.page.fill('#login-user','demo');self.page.fill('#login-pass','DemoSaaaf2026!');self.page.click('#login-btn')
    def nav(self,name):
        if self.page.viewport_size['width']<=760 and not self.page.locator('.sidebar').is_visible(): self.page.click('#menu-toggle')
        self.page.click(f'[data-page="{name}"]')
    def state(self):return self.page.evaluate('store.state')
    def shot(self,name):
        self.page.wait_for_timeout(180)
        path=OUT/'capturas'/name;self.page.screenshot(path=str(path),full_page=True)
        return 'capturas/'+name
    def create_asset(self,code,name='Portatil de prueba',value='2500000',area='Tecnolog\u00eda'):
        self.page.locator('.topbar button[onclick="openModal(\'modal-activo\')"]').click()
        for fid,val in [('a-nombre',name),('a-codigo',code),('a-fecha','2026-01-10'),('a-valor',value)]:self.page.fill('#'+fid,val)
        self.page.select_option('#a-tipo',label='Equipo TI');self.page.select_option('#a-area',label=area)
        self.page.locator('#modal-activo button[onclick="saveActivo()"]').click()
    def close_dialog(self,id):self.page.locator('#'+id+' .modal-close').click()
    def asset(self,code):return next(a for a in self.state()['activos'] if a['codigo']==code)
    def assignment(self,id,cedula='10000001'):
        self.nav('asignaciones');self.page.click('button[onclick="openModal(\'modal-asign\')"]')
        self.page.fill('#as-colaborador','Colaborador Demo');self.page.fill('#as-cedula',cedula)
        self.page.select_option('#as-area',label='Ventas');self.page.select_option('#as-activo',value=id)
        self.page.fill('#as-fecha','2026-02-01');self.page.click('button[onclick="saveAsign()"]')
    def maintenance(self,id,tecnico='Tecnico Demo'):
        self.nav('mantenimiento');self.page.click('button[onclick="openModal(\'modal-mant\')"]')
        self.page.select_option('#m-activo',value=id);self.page.fill('#m-tecnico',tecnico)
        self.page.fill('#m-fecha','2026-03-01');self.page.fill('#m-desc','Revision preventiva de componentes')
        self.page.click('button[onclick="saveMant()"]')
    def record(self,id,title,steps,expected,fn,evidence=''):
        start=time.perf_counter()
        try:
            actual=fn() or expected
            row=dict(id=id,nombre=title,pasos=steps,esperado=expected,obtenido=actual,estado='APROBADA',evidencia=evidence)
        except Exception as exc:
            try:self.shot('FALLO_'+id+'.png')
            except Exception:pass
            row=dict(id=id,nombre=title,pasos=steps,esperado=expected,obtenido=str(exc),estado='FALLIDA',evidencia='capturas/FALLO_'+id+'.png')
            print(traceback.format_exc())
        row['duracion_ms']=round((time.perf_counter()-start)*1000,2);RESULTS.append(row);print(row['id'],row['estado'],row['nombre'],flush=True)

server=None
if args.mode=='http':
    server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
    threading.Thread(target=server.serve_forever,daemon=True).start()
url=f'http://127.0.0.1:{server.server_port}/02_Aplicacion_Web/index.html' if server else None
with sync_playwright() as p:
    executable=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium')
    opts=dict(headless=True)
    if executable:opts['executable_path']=executable
    if os.name!='nt':opts['args']=['--no-sandbox']
    browser=p.chromium.launch(**opts)
    h=Harness(browser,url);h.load();h.shot('01_acceso.png')
    def invalid_login():
        h.page.fill('#login-pass','incorrecta');h.page.click('#login-btn')
        assert h.page.locator('#login-screen').is_visible()
        assert 'incorrectos' in h.page.inner_text('#login-error')
        h.page.keyboard.press('Escape');assert h.page.locator('#login-screen').is_visible()
        assert not h.page.locator('.app').is_visible()
    h.record('UI-01','Acceso incorrecto y Escape','Ingresar clave incorrecta y pulsar Escape','La pantalla de acceso permanece y el contenido no se muestra',invalid_login)
    def valid_login():
        h.login();assert h.page.locator('.app').is_visible();assert h.page.inner_text('#kpi-total')=='0'
    h.record('UI-02','Acceso demostrativo correcto','Ingresar demo y clave de demostracion','Se abre Dashboard sin activos',valid_login,'capturas/01_acceso.png')
    def required():
        h.page.locator('.topbar button[onclick="openModal(\'modal-activo\')"]').click();h.page.click('button[onclick="saveActivo()"]')
        assert not h.state()['activos'];assert 'Nombre' in h.page.inner_text('#toast-msg');h.shot('02_validacion.png');h.close_dialog('modal-activo')
    h.record('UI-03','Validacion de campos obligatorios','Guardar el formulario de activo vacio','No crea registros y muestra la validacion',required,'capturas/02_validacion.png')
    def create():
        for code,name,value,area in [('ACT-001','Portatil Dell - Demo','2500000','Tecnolog\u00eda'),('ACT-002','Proyector Epson - Demo','1500000','Ventas'),('ACT-003','Impresora HP - Demo','0','Administraci\u00f3n')]:h.create_asset(code,name,value,area)
        assert len(h.state()['activos'])==3;h.nav('activos');h.shot('03_inventario.png')
    h.record('UI-04','Registro de tres activos','Diligenciar tres formularios con datos ficticios','Tres activos y tres movimientos de alta',create,'capturas/03_inventario.png')
    def duplicate():
        h.create_asset('act-001');assert 'ya existe' in h.page.inner_text('#toast-msg');assert len(h.state()['activos'])==3;h.close_dialog('modal-activo')
    h.record('UI-05','Codigo duplicado','Intentar registrar act-001 por segunda vez','Rechaza el duplicado sin crear un cuarto activo',duplicate)
    def negative():
        h.create_asset('ACT-004',value='-1');assert 'Valor' in h.page.inner_text('#toast-msg');assert len(h.state()['activos'])==3;h.close_dialog('modal-activo')
    h.record('UI-06','Valor negativo','Registrar activo con valor -1','Rechazo y ningun registro nuevo',negative)
    def edit():
        aid=h.asset('ACT-001')['id'];h.nav('activos');h.page.click(f'button[data-action="edit"][data-id="{aid}"]');h.page.fill('#a-nombre','Portatil Dell actualizado - Demo');h.page.click('button[onclick="saveActivo()"]')
        assert len(h.state()['activos'])==3;assert h.asset('ACT-001')['nombre']=='Portatil Dell actualizado - Demo'
    h.record('UI-07','Edicion de activo','Abrir Editar y cambiar nombre','Actualiza sin duplicar el activo',edit)
    def search():
        h.page.fill('#search-input','ACT-002');assert h.page.locator('#tbl-activos tr').count()==1;assert 'Epson' in h.page.inner_text('#tbl-activos');h.page.fill('#search-input','')
    h.record('UI-08','Busqueda por codigo','Escribir ACT-002 en la busqueda','Solo muestra el proyector',search)
    def bad_assignment():
        h.assignment(h.asset('ACT-001')['id'],cedula='abc123');assert not h.state()['asigns'];assert 'dula' in h.page.inner_text('#toast-msg');h.close_dialog('modal-asign')
    h.record('UI-09','Validacion de cedula','Intentar asignar con cedula alfanumerica','Rechaza la asignacion',bad_assignment)
    def assign():
        h.assignment(h.asset('ACT-001')['id']);assert h.asset('ACT-001')['estado']=='Asignado';assert len(h.state()['asigns'])==1;h.shot('04_asignacion.png')
    h.record('UI-10','Asignacion','Asignar ACT-001 al Colaborador Demo','Estado Asignado y responsable actualizado',assign,'capturas/04_asignacion.png')
    def return_asset():
        h.page.click('button[data-action="return"]');h.page.click('#modal-confirm button[onclick="closeModal(\'modal-confirm\')"]');assert h.asset('ACT-001')['estado']=='Asignado'
        h.page.click('button[data-action="return"]');h.page.click('#confirm-ok');assert h.asset('ACT-001')['estado']=='Activo';assert h.state()['asigns'][0]['estado']=='Devuelto'
    h.record('UI-11','Cancelacion y confirmacion de devolucion','Cancelar una devolucion; luego confirmar','Cancelar conserva la asignacion; confirmar libera y conserva historial',return_asset)
    def required_tech():
        h.maintenance(h.asset('ACT-002')['id'],tecnico='');assert not h.state()['mants'];h.close_dialog('modal-mant')
    h.record('UI-12','Tecnico de mantenimiento obligatorio','Guardar mantenimiento sin tecnico','No crea mantenimiento',required_tech)
    def mant():
        h.maintenance(h.asset('ACT-002')['id']);assert h.asset('ACT-002')['estado']=='Mantenimiento';h.shot('05_mantenimiento.png')
    h.record('UI-13','Registro de mantenimiento','Crear mantenimiento preventivo para ACT-002','Activo en mantenimiento y registro Pendiente',mant,'capturas/05_mantenimiento.png')
    def complete():
        h.page.click('button[data-action="complete"]');h.page.click('#confirm-ok');assert h.asset('ACT-002')['estado']=='Activo';assert h.state()['mants'][0]['estado']=='Completado'
    h.record('UI-14','Cierre de mantenimiento','Pulsar Completar y confirmar','Activo disponible, mantenimiento Completado',complete)
    def cancel_mant():
        h.maintenance(h.asset('ACT-002')['id']);h.page.locator('button[data-action="cancel-maint"]').first.click();h.page.click('#confirm-ok');assert h.asset('ACT-002')['estado']=='Activo';assert h.state()['mants'][0]['estado']=='Cancelado'
    h.record('UI-15','Cancelacion de mantenimiento','Abrir otro mantenimiento y cancelarlo','Activo disponible, registro Cancelado conservado',cancel_mant)
    def baja():
        h.nav('activos');aid=h.asset('ACT-003')['id'];h.page.click(f'button[data-action="retire"][data-id="{aid}"]');h.page.click('#confirm-ok')
        assert h.asset('ACT-003')['estado']=='Baja';assert len(h.state()['activos'])==3
    h.record('UI-16','Baja logica','Dar de baja ACT-003 y confirmar','Conserva tres activos y registra Baja',baja)
    def reload_state():
        before=h.state();h.reload();h.login();assert h.state()==before
    h.record('UI-17','Recuperacion de estado al reinicializar','Reinicializar la pagina con el almacenamiento previo','Recupera exactamente el estado previo; en DOM el Storage es simulado',reload_state)
    def config():
        h.nav('config');h.page.fill('#cfg-nombre','Brayan Giraldo Garcia - Demo');h.page.click('button[onclick="saveConfig()"]');h.reload();h.login();h.nav('config');assert h.page.input_value('#cfg-nombre')=='Brayan Giraldo Garcia - Demo';h.shot('06_configuracion.png')
    h.record('UI-18','Preferencias guardadas','Guardar nombre y reinicializar','Recupera el nombre configurado; persistencia simulada en modo DOM',config,'capturas/06_configuracion.png')
    def history():
        h.nav('activos');aid=h.asset('ACT-001')['id'];h.page.click(f'button[data-action="view"][data-id="{aid}"]');txt=h.page.inner_text('#detalle-body');assert 'Alta' in txt and 'Devuelto por' in txt;h.close_dialog('modal-detalle');h.nav('movimientos');h.shot('07_movimientos.png')
    h.record('UI-19','Trazabilidad tras renombrar','Consultar detalle del activo editado y el historial','Se conservan alta asignacion y devolucion por ID',history,'capturas/07_movimientos.png')
    def filtered():
        h.nav('reportes');h.page.select_option('#rf-area',label='Ventas');h.page.select_option('#rf-estado',label='Activo');h.page.fill('#rf-fecha-ini','2026-01-01');h.page.fill('#rf-fecha-fin','2026-12-31');h.page.locator('button[onclick="renderReportes()"]').click();assert h.page.inner_text('#r-total')=='2';h.shot('08_reportes.png')
    h.record('UI-20','Filtros combinados de reporte','Area Ventas, estado Activo y rango del ano 2026','Dos registros coinciden con los filtros',filtered,'capturas/08_reportes.png')
    def dates():
        h.page.fill('#rf-fecha-ini','2026-12-31');h.page.fill('#rf-fecha-fin','2026-01-01');h.page.click('button[onclick="renderReportes()"]');assert 'inicial' in h.page.inner_text('#toast-msg');assert h.page.inner_text('#r-total')=='0';h.page.click('button[onclick="clearRepFilters()"]')
    h.record('UI-21','Rango invertido','Fecha inicial mayor a fecha final','Mensaje de validacion y reporte vacio',dates)
    def csv_download():
        with h.page.expect_download() as d:h.page.click('button[onclick="exportCSV()"]')
        target=OUT/'SAAAF_reporte_prueba.csv';d.value.save_as(str(target));raw=target.read_bytes();assert raw.startswith(b'\xef\xbb\xbf');assert b'"0"' in raw;assert b'ACT-003' in raw
    h.record('UI-22','Descarga CSV','Exportar todos los activos y leer el archivo descargado','CSV real descargado con UTF-8, codigos y valor cero',csv_download,'SAAAF_reporte_prueba.csv')
    def backup_export():
        h.nav('config')
        with h.page.expect_download() as d:h.page.click('button[onclick="exportBackup()"]')
        target=OUT/'respaldo_prueba.json';d.value.save_as(str(target));data=json.loads(target.read_text());assert data==h.state()
    h.record('UI-23','Descarga de respaldo','Exportar JSON y comparar contenido','JSON descargado coincide con el estado completo',backup_export,'respaldo_prueba.json')
    def reject_backup():
        before=h.state();h.page.set_input_files('#backup-file',{'name':'invalido.json','mimeType':'application/json','buffer':b'{"version":1}'})
        h.page.wait_for_timeout(100);assert 'rechazado' in h.page.inner_text('#toast-msg');assert h.state()==before
    h.record('UI-24','Rechazo de respaldo incompatible','Importar JSON con version 1','No modifica datos y muestra rechazo',reject_backup)
    def restore():
        h.page.click('button[onclick="resetData()"]');h.page.click('#confirm-ok');assert not h.state()['activos']
        h.page.set_input_files('#backup-file',str(OUT/'respaldo_prueba.json'));h.page.click('#confirm-ok');assert len(h.state()['activos'])==3
    h.record('UI-25','Restauracion de respaldo','Reiniciar datos e importar el respaldo valido','Recupera tres activos y sus relaciones',restore)
    def malicious():
        h.nav('activos');h.create_asset('ACT-XSS','<img src=x onerror="window.__xssExecuted=1">');assert h.page.evaluate('window.__xssExecuted || 0')==0;assert h.page.locator('#tbl-activos img').count()==0;assert '<img' in h.page.inner_text('#tbl-activos')
    h.record('UI-26','Renderizado seguro de texto','Registrar texto con etiqueta img y manejador de evento','Lo muestra como texto sin ejecutar el evento',malicious)
    def mobile():
        h.page.set_viewport_size({'width':390,'height':844});h.nav('dashboard');assert h.page.evaluate('document.documentElement.scrollWidth <= innerWidth')
        h.shot('09_movil_dashboard.png');h.page.click('#menu-toggle');assert h.page.locator('.sidebar').is_visible();h.page.click('[data-page="activos"]')
        h.page.locator('.topbar button[onclick="openModal(\'modal-activo\')"]').click();box=h.page.locator('#modal-activo .modal').bounding_box();assert box['x']>=0 and box['x']+box['width']<=390.1;h.shot('10_movil_formulario.png');h.close_dialog('modal-activo')
    h.record('UI-27','Vista movil 390 x 844','Abrir menu Dashboard y formulario en viewport movil','No hay desbordamiento global y el formulario cabe; no es telefono fisico',mobile,'capturas/09_movil_dashboard.png')
    def mobile_small():
        h.page.set_viewport_size({'width':360,'height':800});h.nav('activos');assert h.page.evaluate('document.documentElement.scrollWidth <= innerWidth');h.page.set_viewport_size({'width':1365,'height':900})
    h.record('UI-28','Vista movil 360 x 800','Reducir viewport y navegar a Activos','Sin desbordamiento global; tabla con desplazamiento propio',mobile_small)
    def corrupted():
        if args.mode=='dom':h.load({'saaaf_evidencia_v2':'{invalido'})
        else:
            h.page.evaluate("localStorage.setItem('saaaf_evidencia_v2','{invalido')");h.reload()
        assert 'No se pudieron' in h.page.inner_text('#storage-warning');h.login();h.create_asset('ACT-999');assert not h.state()['activos'];assert h.page.evaluate("localStorage.getItem('saaaf_evidencia_v2')")=='{invalido';h.close_dialog('modal-activo')
        h.nav('config');h.page.set_input_files('#backup-file',str(OUT/'respaldo_prueba.json'));h.page.click('#confirm-ok');assert len(h.state()['activos'])==3
    h.record('UI-29','Almacenamiento corrupto y recuperacion','Arrancar con JSON corrupto, intentar guardar y luego restaurar','No sobreescribe el contenido corrupto; restaura con confirmacion',corrupted)
    def logout():
        h.page.click('#logout-btn');assert not h.page.locator('.app').is_visible();assert h.page.locator('#login-screen').is_visible()
    h.record('UI-30','Cerrar demostracion','Pulsar Salir','Oculta la aplicacion y solicita ingreso nuevamente',logout)
    # Estado final limpio para la captura del dashboard.
    h.login();h.nav('dashboard');h.shot('11_dashboard_final.png')
    h.page.set_viewport_size({'width':390,'height':844});h.nav('dashboard');h.shot('09_movil_dashboard.png')
    h.nav('activos');h.page.locator(".topbar button[onclick=\"openModal('modal-activo')\"]").click();h.shot('10_movil_formulario.png');h.close_dialog('modal-activo')
    meta={'fecha_utc':datetime.now(timezone.utc).isoformat(),'modo':args.mode,'navegador':browser.version,'viewport_escritorio':'1365x900','viewports_moviles':['390x844','360x800'],'almacenamiento':'doble Storage en memoria' if args.mode=='dom' else 'localStorage nativo','alcance':'Interfaz y dominio ejecutados en Chromium; sin servidor Java ni MySQL','errores_javascript':h.errors,'casos':RESULTS}
    (OUT/'resultados_interfaz.json').write_text(json.dumps(meta,ensure_ascii=False,indent=2))
    browser.close()
if server:server.shutdown()
print('RESULTADO',sum(r['estado']=='APROBADA' for r in RESULTS),'/',len(RESULTS))
raise SystemExit(0 if all(r['estado']=='APROBADA' for r in RESULTS) else 1)
