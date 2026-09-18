"""Reproduce defectos de la fuente HTML sin modificarla. Chromium DOM + Storage simulado."""
from pathlib import Path
from datetime import datetime,timezone
from playwright.sync_api import sync_playwright
import json,shutil,os
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'04_Pruebas'
source=(ROOT/'05_Fuentes_Originales/saaaf-html-code.html').read_text()
shim="""<script>window.__storageData={};Object.defineProperty(window,'localStorage',{value:{getItem:k=>window.__storageData[k]||null,setItem:(k,v)=>window.__storageData[k]=String(v),removeItem:k=>delete window.__storageData[k]},configurable:true});</script>"""
html=source.replace('<head>','<head>'+shim)
asset={'id':'demo1','codigo':'ACT-001','nombre':'Equipo Demo','tipo':'Equipo TI','area':'Ventas','responsable':'Demo','estado':'Activo','fecha':'2026-01-10','valor':'100','obs':''}
rows=[]
with sync_playwright() as p:
 opts={'headless':True,'args':['--no-sandbox']}
 executable=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium')
 if executable:opts['executable_path']=executable
 browser=p.chromium.launch(**opts)
 def check(id,name,expected,fn):
  page=browser.new_page(viewport={'width':1365,'height':900});page.set_default_timeout(4000);page.set_content(html)
  try:
   actual=fn(page);rows.append({'id':id,'hallazgo':name,'comprobacion':expected,'observado':actual,'estado':'REPRODUCIDO'})
  except Exception as e:rows.append({'id':id,'hallazgo':name,'comprobacion':expected,'observado':str(e),'estado':'NO_REPRODUCIDO'})
  page.close()
 def login(page):
  page.fill('#login-user','usuario_invalido');page.fill('#login-pass','clave_invalida');page.click('#login-btn');assert not page.locator('#login-screen').is_visible();return 'La funcion doLogin oculta el acceso con cualquier dato.'
 check('OB-01','Acceso sin validacion','El formulario acepta usuario y clave incorrectos',login)
 def duplicates(page):
  n=page.evaluate("""()=>{document.getElementById('a-nombre').value='Equipo Demo';document.getElementById('a-codigo').value='ACT-001';saveActivo();saveActivo();return activos.length;}""")
  assert n==2;return 'Se almacenaron dos activos con ACT-001.'
 check('OB-02','Codigos duplicados','Guardar dos veces el mismo codigo crea dos activos',duplicates)
 def negative(page):
  value=page.evaluate("""()=>{document.getElementById('a-nombre').value='Equipo Demo';document.getElementById('a-codigo').value='ACT-001';document.getElementById('a-valor').value='-10';saveActivo();return activos[0].valor;}""")
  assert value=='-10';return 'El valor -10 fue aceptado.'
 check('OB-03','Valor negativo aceptado','Guardar un valor -10 sin validacion',negative)
 def deletion(page):
  a=dict(asset,estado='Asignado');page.evaluate('(a)=>{activos=[a];asigns=[{id:"as1",activoId:a.id,estado:"Activo"}];deleteAsign("as1");document.getElementById("confirm-ok").click()}',a)
  r=page.evaluate('({estado:activos[0].estado,asignaciones:asigns.length})');assert r=={'estado':'Asignado','asignaciones':0};return r
 check('OB-04','Asignacion eliminada deja activo ocupado','Eliminar asignacion y comprobar estado del activo',deletion)
 def mant(page):
  a=dict(asset,estado='Mantenimiento');page.evaluate('(a)=>{activos=[a];mants=[{id:"m1",activoId:a.id,estado:"Pendiente"}];deleteMant("m1");document.getElementById("confirm-ok").click()}',a)
  r=page.evaluate('({estado:activos[0].estado,mantenimientos:mants.length})');assert r=={'estado':'Mantenimiento','mantenimientos':0};return r
 check('OB-05','Mantenimiento eliminado no libera activo','Eliminar mantenimiento y comprobar activo',mant)
 def prefs(page):
  page.evaluate("document.getElementById('cfg-nombre').value='Prueba de preferencias';document.querySelector('#page-config button').click()")
  keys=page.evaluate('Object.keys(window.__storageData)');assert not any('config' in key or 'pref' in key for key in keys);return 'El boton solo muestra un aviso; no escribe preferencias.'
 check('OB-06','Preferencias no persistidas','Guardar preferencias no escribe almacenamiento',prefs)
 def xss(page):
  a=dict(asset,nombre='<img src=x onerror="window.__baselineXss=1">');page.evaluate('(a)=>{activos=[a];refreshAll()}',a);page.wait_for_timeout(200)
  val=page.evaluate('window.__baselineXss||0');assert val==1;return 'Se ejecuto un manejador onerror almacenado como nombre de activo.'
 check('OB-07','HTML de usuario ejecutable','Mostrar nombre de activo con etiqueta img y evento',xss)
 def mobile(page):
  page.set_viewport_size({'width':390,'height':844});page.evaluate('doLogin()')
  size=page.locator('.tb-right').bounding_box();assert size['x']+size['width']>390
  page.screenshot(path=str(OUT/'capturas/00_original_movil.png'));return {'ancho_pantalla':390,'borde_derecho_barra':round(size['x']+size['width'],2)}
 check('OB-08','Interfaz original recortada en movil','La barra de acciones se extiende fuera de 390px',mobile)
 meta={'fecha_utc':datetime.now(timezone.utc).isoformat(),'navegador':browser.version,'modo':'DOM con Storage simulado','fuente':'05_Fuentes_Originales/saaaf-html-code.html','hallazgos':rows}
 (OUT/'hallazgos_original.json').write_text(json.dumps(meta,ensure_ascii=False,indent=2));browser.close()
print(json.dumps(rows,ensure_ascii=False,indent=2))
raise SystemExit(0 if all(r['estado']=='REPRODUCIDO' for r in rows) else 1)
