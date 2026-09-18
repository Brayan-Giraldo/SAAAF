/* SAAAF - interfaz de la evidencia. Presentacion separada del dominio.
 * Las entradas de usuario se escapan antes de renderizar HTML.
 * El acceso es solo demostrativo, no una barrera de seguridad.
 */
'use strict';
const C = SAAAFCore;
const $ = id => document.getElementById(id);
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
let store, loggedIn=false, storageError='', filterEstado='', filterSearch='', opener=null, toastTimer;
const COLORS=['#E85D04','#3B82F6','#10B981','#F59E0B','#8B5CF6','#EC4899','#06B6D4'];
function loadData(){
  try {
    const raw=localStorage.getItem(C.KEY);
    store=new C.Store(raw?JSON.parse(raw):C.initial(),C.storageWriter(localStorage));
  } catch(error){
    storageError='No se pudieron cargar los datos: '+error.message+'. En Configuraci\u00f3n puedes respaldar el contenido o recuperar un respaldo v\u00e1lido.';
    store=new C.Store(C.initial());
  }
  $('storage-warning').textContent=storageError;
}
function toast(message,color){
  $('toast-msg').textContent=message;
  $('toast-dot').style.background=color || '#10B981';
  $('toast').classList.add('show');clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>$('toast').classList.remove('show'),4500);
}
function run(action,message){
  try {
    if(!loggedIn)throw new Error('Primero ingresa a la demostraci\u00f3n');
    if(storageError)throw new Error(storageError);
    const result=action();refreshAll();
    if(message && store.state.config.notificaciones==='Activadas')toast(message);
    return {ok:true,result};
  }catch(error){toast(error.message,'#EF4444');return {ok:false,error:error.message};}
}
function doLogin(){
  if($('login-user').value.trim()!=='demo'||$('login-pass').value!=='DemoSaaaf2026!'){
    $('login-error').textContent='Usuario o contrase\u00f1a de demostraci\u00f3n incorrectos';return;
  }
  loggedIn=true;$('login-error').textContent='';$('login-screen').classList.remove('open');
  document.querySelector('.app').hidden=false;refreshAll();
  toast('Demostraci\u00f3n local iniciada');
}
function logout(){
  document.querySelectorAll('.overlay').forEach(e=>e.classList.remove('open'));
  loggedIn=false;document.querySelector('.app').hidden=true;$('login-screen').classList.add('open');$('login-pass').value='';$('login-user').focus();
}
function nav(el){
  if(!loggedIn)return;
  document.querySelectorAll('.sb-item').forEach(e=>e.classList.remove('on'));el.classList.add('on');
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  $('page-'+el.dataset.page).classList.add('active');$('page-title').textContent=el.querySelector('span').textContent;
  document.querySelector('.sidebar').classList.remove('mobile-open');$('menu-toggle').setAttribute('aria-expanded','false');
  if(el.dataset.page==='reportes')renderReportes();
}
function toggleSidebar(){
  const open=document.querySelector('.sidebar').classList.toggle('mobile-open');$('menu-toggle').setAttribute('aria-expanded',String(open));
}
function setValue(id,value){$(id).value=value ?? '';}
function showModal(id){
  if(!loggedIn)return;opener=document.activeElement;$(id).classList.add('open');
  const focus=$(id).querySelector('input:not([type=hidden]),select,button,textarea');if(focus)focus.focus();
}
function options(id,assets){
  $(id).innerHTML='<option value="">Seleccionar activo disponible...</option>'+assets.map(a=>'<option value="'+esc(a.id)+'">'+esc(a.nombre)+' ('+esc(a.codigo)+')</option>').join('');
}
function openModal(id){
  if(id==='modal-activo'){
    $('modal-activo-title').textContent='Nuevo Activo';setValue('activo-edit-id','');
    ['a-nombre','a-codigo','a-responsable','a-valor','a-obs','a-tipo','a-area'].forEach(i=>setValue(i,''));
    setValue('a-estado','Activo');setValue('a-fecha',C.today());
    ['a-estado','a-area','a-responsable'].forEach(i=>$(i).disabled=false);
    Array.from($('a-estado').options).forEach(o=>o.disabled=['Asignado','Mantenimiento'].includes(o.value));
  }
  if(id==='modal-asign'){
    ['asign-edit-id','as-colaborador','as-cedula','as-area','as-obs'].forEach(i=>setValue(i,''));
    options('as-activo',store.state.activos.filter(a=>a.estado==='Activo'));setValue('as-fecha',C.today());setValue('as-estado','Activo');
  }
  if(id==='modal-mant'){
    ['mant-edit-id','m-tecnico','m-desc'].forEach(i=>setValue(i,''));
    options('m-activo',store.state.activos.filter(a=>a.estado==='Activo'));setValue('m-fecha',C.today());setValue('m-estado','Pendiente');setValue('m-tipo','Preventivo');
  }
  showModal(id);
}
function closeModal(id){if(id==='login-screen')return;$(id).classList.remove('open');if(opener&&opener.isConnected)opener.focus();}
function confirmAction(title,message,action){
  $('confirm-title').textContent=title;$('confirm-msg').textContent=message;
  $('confirm-ok').onclick=()=>{const outcome=action();if(outcome!==false)closeModal('modal-confirm');};showModal('modal-confirm');
}
function saveActivo(){
  const data={};[['nombre','a-nombre'],['codigo','a-codigo'],['tipo','a-tipo'],['area','a-area'],['responsable','a-responsable'],['estado','a-estado'],['fecha','a-fecha'],['valor','a-valor'],['obs','a-obs']].forEach(([k,id])=>data[k]=$(id).value);
  const result=run(()=>store.saveAsset(data,$('activo-edit-id').value),'Activo guardado');if(result.ok)closeModal('modal-activo');
}
function editActivo(id){
  const a=store.state.activos.find(x=>x.id===id);if(!a)return;
  $('modal-activo-title').textContent='Editar Activo';setValue('activo-edit-id',id);
  [['nombre','a-nombre'],['codigo','a-codigo'],['tipo','a-tipo'],['area','a-area'],['responsable','a-responsable'],['estado','a-estado'],['fecha','a-fecha'],['valor','a-valor'],['obs','a-obs']].forEach(([key,f])=>setValue(f,a[key]));
  const locked=['Asignado','Mantenimiento'].includes(a.estado);
  ['a-estado','a-area','a-responsable'].forEach(i=>$(i).disabled=locked);
  Array.from($('a-estado').options).forEach(o=>o.disabled=['Asignado','Mantenimiento'].includes(o.value));
  showModal('modal-activo');
}
function deleteActivo(id){confirmAction('Dar de baja el activo','Se conservar\u00e1n los datos y su historial. No se permite dar de baja un activo ocupado.',()=>run(()=>store.retireAsset(id),'Baja registrada').ok);}
function fmtDate(value){if(!value)return '\u2014';return value.split('-').reverse().join('/');}
function fmtTime(value){return new Intl.DateTimeFormat('es-CO',{timeZone:'America/Bogota',dateStyle:'short',timeStyle:'short'}).format(new Date(value));}
function tagHtml(value){const cls=value==='En proceso'?'proceso':value;return '<span class="tag '+esc(cls)+'">'+esc(value)+'</span>';}
function viewActivo(id){
  const state=store.state,a=state.activos.find(x=>x.id===id);if(!a)return;
  const fields=[['Nombre',a.nombre],['C\u00f3digo',a.codigo],['Tipo',a.tipo],['\u00c1rea',a.area],['Responsable',a.responsable||'Sin asignar'],['Estado',a.estado],['Fecha ingreso',fmtDate(a.fecha)],['Valor',new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:2}).format(a.valor)]];
  const history=state.movs.filter(m=>m.activoId===id);
  $('detalle-body').innerHTML='<div class="detail-grid">'+fields.map(([label,value])=>'<div class="detail-field"><div class="df-label">'+esc(label)+'</div><div class="df-val">'+esc(value)+'</div></div>').join('')+'</div><div class="detail-field"><div class="df-label">Observaciones</div><div class="df-val">'+esc(a.obs||'Sin observaciones')+'</div></div><h4 style="margin:18px 0 8px">Historial por identificador</h4>'+history.map(m=>'<div class="detail-field" style="margin-top:8px"><div>'+esc(m.tipo)+': '+esc(m.detalle)+'</div><div class="df-label" style="margin-top:6px">'+esc(fmtTime(m.fecha))+'</div></div>').join('');showModal('modal-detalle');
}
function saveAsign(){
  const result=run(()=>store.assign({colaborador:$('as-colaborador').value,cedula:$('as-cedula').value,area:$('as-area').value,activoId:$('as-activo').value,fecha:$('as-fecha').value,obs:$('as-obs').value}),'Asignaci\u00f3n guardada');if(result.ok)closeModal('modal-asign');
}
function devolverAsign(id){confirmAction('Registrar devoluci\u00f3n','El activo volver\u00e1 a estar disponible. Se conservar\u00e1 la asignaci\u00f3n en el historial.',()=>run(()=>store.returnAssignment(id),'Devoluci\u00f3n registrada').ok);}
function saveMant(){
  const result=run(()=>store.maintenance({activoId:$('m-activo').value,tipo:$('m-tipo').value,tecnico:$('m-tecnico').value,fecha:$('m-fecha').value,estado:$('m-estado').value,desc:$('m-desc').value}),'Mantenimiento registrado');if(result.ok)closeModal('modal-mant');
}
function closeMant(id,estado){confirmAction(estado==='Completado'?'Completar mantenimiento':'Cancelar mantenimiento','El activo volver\u00e1 a estar disponible y el registro se conservar\u00e1.',()=>run(()=>store.closeMaintenance(id,estado),'Mantenimiento cerrado').ok);}
function setFilter(el,estado){document.querySelectorAll('.chips .chip').forEach(e=>e.classList.remove('on'));el.classList.add('on');filterEstado=estado;renderTblActivos();}
function filterActivos(){filterSearch=$('search-input').value.trim().toLocaleLowerCase('es');if(filterSearch)nav(document.querySelector('[data-page="activos"]'));renderTblActivos();}
function blank(cols,text){return '<tr><td colspan="'+cols+'"><div class="empty">'+esc(text)+'</div></td></tr>';}
function button(label,action,id,extra=''){return '<button class="btn btn-ghost" data-action="'+action+'" data-id="'+esc(id)+'"'+extra+'>'+esc(label)+'</button>';}
function renderTblActivos(){
  const list=store.state.activos.filter(a=>(!filterEstado||a.estado===filterEstado)&&(!filterSearch||[a.nombre,a.codigo,a.area,a.responsable].join(' ').toLocaleLowerCase('es').includes(filterSearch)));
  $('tbl-activos').innerHTML=list.length?list.map(a=>'<tr><td><strong>'+esc(a.nombre)+'</strong></td><td>'+esc(a.codigo)+'</td><td>'+esc(a.tipo)+'</td><td>'+esc(a.area)+'</td><td>'+esc(a.responsable||'Sin asignar')+'</td><td>'+tagHtml(a.estado)+'</td><td><div class="actions">'+button('Editar','edit',a.id)+button('Ver','view',a.id)+(a.estado==='Activo'?button('Baja','retire',a.id):'')+'</div></td></tr>').join(''):blank(7,'No hay activos que coincidan');
}
function renderTblAsign(){
  const list=store.state.asigns;
  $('tbl-asign').innerHTML=list.length?list.map(a=>'<tr><td><strong>'+esc(a.colaborador)+'</strong></td><td>'+esc(a.cedula)+'</td><td>'+esc(a.activoNombre)+'</td><td>'+esc(a.area)+'</td><td>'+fmtDate(a.fecha)+'</td><td>'+tagHtml(a.estado)+'</td><td>'+(a.estado==='Activo'?button('Devolver','return',a.id):'Devuelto el '+fmtDate(a.fechaDevolucion))+'</td></tr>').join(''):blank(7,'No hay asignaciones');
}
function renderTblMant(){
  const list=store.state.mants;
  $('tbl-mant').innerHTML=list.length?list.map(m=>'<tr><td><strong>'+esc(m.activoNombre)+'</strong></td><td>'+esc(m.tipo)+'</td><td>'+esc(m.desc)+'</td><td>'+esc(m.tecnico)+'</td><td>'+fmtDate(m.fecha)+'</td><td>'+tagHtml(m.estado)+'</td><td><div class="actions">'+(['Pendiente','En proceso'].includes(m.estado)?button('Completar','complete',m.id)+button('Cancelar','cancel-maint',m.id):'Cerrado el '+fmtDate(m.fechaCierre))+'</div></td></tr>').join(''):blank(7,'No hay mantenimientos');
}
function renderTblMov(){
  const list=store.state.movs;
  $('tbl-mov').innerHTML=list.length?list.map(m=>'<tr><td>'+esc(fmtTime(m.fecha))+'</td><td>'+esc(m.tipo)+'</td><td>'+esc(m.activo)+'</td><td>'+esc(m.detalle)+'</td><td>'+esc(m.usuario)+'</td></tr>').join(''):blank(5,'No hay movimientos');
}
function counts(assets){return {total:assets.length,act:assets.filter(a=>a.estado==='Activo').length,asig:assets.filter(a=>a.estado==='Asignado').length,mant:assets.filter(a=>a.estado==='Mantenimiento').length};}
function bars(data,key){
  const map=new Map();data.forEach(a=>map.set(a[key],(map.get(a[key])||0)+1));
  const list=Array.from(map).sort((a,b)=>b[1]-a[1]);const max=list.length?list[0][1]:1;
  return list.length?list.map(([label,n],i)=>'<div class="bar-row"><span class="bar-label">'+esc(label)+'</span><div class="bar-track"><div class="bar-fill" style="width:'+Math.round(n/max*100)+'%;background:'+COLORS[i%COLORS.length]+'"></div></div><span class="bar-val">'+n+'</span></div>').join(''):'<div class="empty">Sin datos</div>';
}
function renderKPIs(){
  const s=store.state,c=counts(s.activos);$('kpi-total').textContent=c.total;$('kpi-activos').textContent=c.act;$('kpi-asignados').textContent=c.asig;$('kpi-mant').textContent=c.mant;
  $('kpi-total-sub').textContent='Registros, incluidas las bajas';$('kpi-activos-pct').textContent=c.total?Math.round(c.act/c.total*100)+'% del inventario':'Sin registros';$('kpi-asignados-pct').textContent=c.total?Math.round(c.asig/c.total*100)+'% del inventario':'Sin registros';$('kpi-mant-pct').textContent=c.mant?'Requieren atenci\u00f3n':'Sin pendientes';
  $('badge-activos').textContent=c.total;$('badge-mant').textContent=s.mants.filter(m=>['Pendiente','En proceso'].includes(m.estado)).length;
}
function renderDash(){
  const assets=store.state.activos;
  const rows=assets.slice(0,6).map(a=>'<tr><td>'+esc(a.nombre)+'</td><td>'+esc(a.tipo)+'</td><td>'+esc(a.area)+'</td><td>'+tagHtml(a.estado)+'</td></tr>').join('');
  $('dash-recientes').innerHTML=assets.length?'<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Nombre</th><th>Tipo</th><th>\u00c1rea</th><th>Estado</th></tr></thead><tbody>'+rows+'</tbody></table></div>':'<div class="empty">Sin registros</div>';
  $('dash-areas').innerHTML=bars(assets,'area');
  $('dash-estado').innerHTML=assets.length?'<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Nombre</th><th>C\u00f3digo</th><th>\u00c1rea</th><th>Responsable</th><th>Estado</th></tr></thead><tbody>'+assets.map(a=>'<tr><td>'+esc(a.nombre)+'</td><td>'+esc(a.codigo)+'</td><td>'+esc(a.area)+'</td><td>'+esc(a.responsable||'Sin asignar')+'</td><td>'+tagHtml(a.estado)+'</td></tr>').join('')+'</tbody></table></div>':'<div class="empty">Sin registros</div>';
}
function getReportData(){return C.report(store.state,{desde:$('rf-fecha-ini').value,hasta:$('rf-fecha-fin').value,area:$('rf-area').value,estado:$('rf-estado').value});}
function renderReportes(){
  let data=[];
  try {data=getReportData();}catch(error){toast(error.message,'#EF4444');}
  const c=counts(data);[['r-total',c.total],['r-act',c.act],['r-asig',c.asig],['r-mant',c.mant]].forEach(([id,v])=>$(id).textContent=v);
  $('rep-tipo').innerHTML=bars(data,'tipo');$('rep-area').innerHTML=bars(data,'area');
  $('rep-tbl').innerHTML=data.length?data.map(a=>'<tr><td>'+esc(a.nombre)+'</td><td>'+esc(a.codigo)+'</td><td>'+esc(a.tipo)+'</td><td>'+esc(a.area)+'</td><td>'+tagHtml(a.estado)+'</td><td>'+fmtDate(a.fecha)+'</td></tr>').join(''):blank(6,'Ning\u00fan activo coincide o el rango es inv\u00e1lido');
}
function clearRepFilters(){['rf-fecha-ini','rf-fecha-fin','rf-area','rf-estado'].forEach(id=>setValue(id,''));renderReportes();}
function download(filename,data,type){
  const url=URL.createObjectURL(new Blob([data],{type}));const a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function exportCSV(){try{const data=getReportData();download('SAAAF_reporte.csv',C.csv(data),'text/csv;charset=utf-8');toast('Reporte exportado: '+data.length+' activos');}catch(error){toast(error.message,'#EF4444');}}
function saveConfig(){const r=run(()=>store.saveConfig({nombre:$('cfg-nombre').value,notificaciones:$('cfg-notif').value}));if(r.ok)toast('Preferencias guardadas');}
function exportBackup(){
  try {const raw=storageError?localStorage.getItem(C.KEY):JSON.stringify(store.state,null,2);download(storageError?'SAAAF_recuperacion.txt':'SAAAF_respaldo.json',raw||'','application/json;charset=utf-8');toast('Respaldo exportado');}catch(error){toast(error.message,'#EF4444');}
}
async function importBackup(file){
  if(!file)return;
  try {
    if(file.size>10*1024*1024)throw new Error('El respaldo supera 10 MB');
    const data=JSON.parse(await file.text());C.verifyState(data);
    confirmAction('Importar respaldo','Se reemplazar\u00e1n los datos locales por los '+data.activos.length+' activos del respaldo. Exporta antes una copia de tus datos actuales.',()=>{
      try {
        if(storageError){localStorage.setItem(C.KEY,JSON.stringify(data));storageError='';store=new C.Store(data,C.storageWriter(localStorage));}
        else store.replace(data);
        refreshAll();toast('Respaldo importado');return true;
      }catch(error){toast(error.message,'#EF4444');return false;}
    });
  }catch(error){toast('Respaldo rechazado: '+error.message,'#EF4444');}
}
function resetData(){confirmAction('Reiniciar datos locales','Se borrar\u00e1n solamente los datos de esta versi\u00f3n en este navegador. Exporta un respaldo antes. No modifica las fuentes originales.',()=>{
  try{localStorage.removeItem(C.KEY);storageError='';store=new C.Store(C.initial(),C.storageWriter(localStorage));refreshAll();toast('Datos locales reiniciados');return true;}catch(error){toast(error.message,'#EF4444');return false;}
});}
function refreshAll(){
  renderKPIs();renderTblActivos();renderTblAsign();renderTblMant();renderTblMov();renderDash();renderReportes();
  const config=store.state.config;setValue('cfg-nombre',config.nombre);setValue('cfg-notif',config.notificaciones);document.querySelector('.sb-user .nm').textContent=config.nombre;
  $('storage-status').textContent=storageError||'Almacenamiento local disponible. Versi\u00f3n 2, revisi\u00f3n '+store.state.revision+'.';
}
document.addEventListener('DOMContentLoaded',()=>{
  loadData();refreshAll();
  $('login-btn').addEventListener('click',doLogin);
  ['login-user','login-pass'].forEach(id=>$(id).addEventListener('keydown',event=>{if(event.key==='Enter')doLogin();}));
  document.querySelectorAll('.overlay:not(#login-screen)').forEach(ov=>ov.addEventListener('click',event=>{if(event.target===ov)closeModal(ov.id);}));
  document.addEventListener('keydown',event=>{
    const ov=document.querySelector('.overlay.open');if(!ov)return;
    if(event.key==='Escape' && ov.id!=='login-screen')closeModal(ov.id);
    if(event.key==='Tab'){
      const items=Array.from(ov.querySelectorAll('button,input,select,textarea')).filter(el=>!el.disabled&&el.type!=='hidden'&&el.offsetParent!==null);
      if(!items.length)return;const first=items[0],last=items[items.length-1];
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
    }
  });
  document.body.addEventListener('click',event=>{
    const b=event.target.closest('button[data-action]');if(!b)return;const id=b.dataset.id;
    const actions={edit:()=>editActivo(id),view:()=>viewActivo(id),retire:()=>deleteActivo(id),return:()=>devolverAsign(id),complete:()=>closeMant(id,'Completado'),'cancel-maint':()=>closeMant(id,'Cancelado')};
    if(actions[b.dataset.action])actions[b.dataset.action]();
  });
  window.addEventListener('storage',event=>{if(event.key===C.KEY)toast('Los datos cambiaron en otra pesta\u00f1a. Recarga antes de guardar.','#F59E0B');});
});
