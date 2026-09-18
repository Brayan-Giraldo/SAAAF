/* SAAAF - dominio de la demostracion local. Sin dependencias externas.
 * Cambios de estado validados; persistencia antes de confirmar la operacion.
 * No es un servidor ni implementa autorizacion real.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SAAAFCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const TIPOS = ['Equipo TI','Mobiliario','Veh\u00edculo','Herramienta','Equipo AV','Climatizaci\u00f3n','Otro'];
  const AREAS = ['Tecnolog\u00eda','Administraci\u00f3n','RRHH','Contabilidad','Ventas','Gerencia','Bodega','Otro'];
  const ESTADOS = ['Activo','Asignado','Mantenimiento','Baja'];
  const MANT_TIPOS = ['Preventivo','Correctivo','Predictivo'];
  const KEY = 'saaaf_evidencia_v2';
  const copy = value => JSON.parse(JSON.stringify(value));
  const isObject = x => x !== null && typeof x === 'object' && !Array.isArray(x);
  function fail(message) { throw new Error(message); }
  function text(value, label, min = 0, max = 1000) {
    if (typeof value !== 'string') fail(label + ': dato inv\u00e1lido');
    const result = value.trim();
    if (result.length < min || result.length > max) fail(label + ': usa entre ' + min + ' y ' + max + ' caracteres');
    return result;
  }
  function oneOf(value, list, label) {
    if (!list.includes(value)) fail(label + ': selecciona una opci\u00f3n v\u00e1lida');
    return value;
  }
  function date(value, label = 'Fecha') {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) fail(label + ': fecha obligatoria o inv\u00e1lida');
    const d = new Date(value + 'T12:00:00Z');
    if (!Number.isFinite(d.getTime()) || d.toISOString().slice(0,10) !== value) fail(label + ': fecha inv\u00e1lida');
    if (value < '1900-01-01' || value > '2100-12-31') fail(label + ': fecha fuera del rango admitido');
    return value;
  }
  function today() {
    const parts = new Intl.DateTimeFormat('en-CA', {timeZone:'America/Bogota',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
    const p = Object.fromEntries(parts.map(v => [v.type, v.value]));
    return p.year + '-' + p.month + '-' + p.day;
  }
  function uid() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
    return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2,12);
  }
  function initial() {
    return {version:2, revision:0, activos:[], asigns:[], mants:[], movs:[], config:{nombre:'Brayan Giraldo Garc\u00eda',notificaciones:'Activadas'}};
  }
  function assetData(input) {
    const raw = input.valor === '' || input.valor === undefined ? 0 : input.valor;
    if ((typeof raw !== 'number' && typeof raw !== 'string') || typeof raw === 'boolean' || !Number.isFinite(Number(raw)) || Number(raw) < 0 || Number(raw) > 1e12) fail('Valor: debe ser un n\u00famero entre 0 y 1 bill\u00f3n');
    return {
      nombre:text(input.nombre,'Nombre',3,120), codigo:text(input.codigo,'C\u00f3digo',3,30).toUpperCase(),
      tipo:oneOf(input.tipo,TIPOS,'Tipo'),area:oneOf(input.area,AREAS,'\u00c1rea'),
      responsable:text(input.responsable || '', 'Responsable',0,100),
      estado:oneOf(input.estado || 'Activo',ESTADOS,'Estado'),fecha:date(input.fecha,'Fecha de ingreso'),
      valor:Number(raw),obs:text(input.obs || '', 'Observaciones',0,1000)
    };
  }
  function assertId(value) {
    if (typeof value !== 'string' || !/^[A-Za-z0-9_-]{1,64}$/.test(value)) fail('Identificador inv\u00e1lido en los datos');
  }
  function verifyState(s) {
    if (!isObject(s) || s.version !== 2 || !Number.isSafeInteger(s.revision) || s.revision < 0) fail('Respaldo: versi\u00f3n o revisi\u00f3n inv\u00e1lida');
    ['activos','asigns','mants','movs'].forEach(k => {
      if (!Array.isArray(s[k]) || s[k].length > 50000) fail('Respaldo: colecci\u00f3n inv\u00e1lida ('+k+')');
      const ids = new Set();
      s[k].forEach(row => { if (!isObject(row)) fail('Registro inv\u00e1lido'); assertId(row.id); if (ids.has(row.id)) fail('Identificadores duplicados'); ids.add(row.id); });
    });
    if (!isObject(s.config)) fail('Preferencias inv\u00e1lidas');
    text(s.config.nombre,'Nombre de usuario',3,100);
    oneOf(s.config.notificaciones,['Activadas','Desactivadas'],'Notificaciones');
    const assets = new Map(); const codes = new Set();
    s.activos.forEach(a => {
      const normal = assetData(a);
      if (normal.codigo !== a.codigo || typeof a.valor !== 'number') fail('Activo sin normalizar');
      if (codes.has(normal.codigo)) fail('El c\u00f3digo ya existe');
      codes.add(normal.codigo); assets.set(a.id,a);
    });
    const occupied = new Map(), maintenance = new Map();
    s.asigns.forEach(a => {
      if (!assets.has(a.activoId)) fail('Asignaci\u00f3n sin activo relacionado');
      text(a.colaborador,'Colaborador',3,100);
      if (!/^\d{5,15}$/.test(a.cedula)) fail('C\u00e9dula: usa entre 5 y 15 d\u00edgitos');
      oneOf(a.area,AREAS,'\u00c1rea'); date(a.fecha); text(a.obs || '', 'Observaciones',0,1000);
      oneOf(a.estado,['Activo','Devuelto'],'Estado de asignaci\u00f3n');
      if (a.fecha < assets.get(a.activoId).fecha) fail('La asignaci\u00f3n no puede ser anterior al ingreso');
      if (a.estado === 'Activo') {
        if (occupied.has(a.activoId)) fail('El activo ya tiene una asignaci\u00f3n vigente');
        occupied.set(a.activoId,a);
      } else { date(a.fechaDevolucion); if (a.fechaDevolucion < a.fecha) fail('Devoluci\u00f3n anterior a la asignaci\u00f3n'); }
    });
    s.mants.forEach(m => {
      if (!assets.has(m.activoId)) fail('Mantenimiento sin activo relacionado');
      oneOf(m.tipo,MANT_TIPOS,'Tipo de mantenimiento'); text(m.tecnico,'T\u00e9cnico',3,100);
      text(m.desc,'Descripci\u00f3n',3,1000); date(m.fecha); oneOf(m.estado,['Pendiente','En proceso','Completado','Cancelado'],'Estado de mantenimiento');
      if (m.fecha < assets.get(m.activoId).fecha) fail('Mantenimiento anterior al ingreso');
      if (['Pendiente','En proceso'].includes(m.estado)) {
        if (maintenance.has(m.activoId)) fail('El activo ya tiene mantenimiento abierto');
        maintenance.set(m.activoId,m);
      } else { date(m.fechaCierre); if(m.fechaCierre < m.fecha) fail('Cierre anterior al mantenimiento'); }
    });
    s.activos.forEach(a => {
      const as = occupied.get(a.id), m = maintenance.get(a.id);
      if (as && m) fail('Activo asignado y en mantenimiento al mismo tiempo');
      if ((a.estado === 'Asignado') !== !!as) fail('Estado del activo no coincide con la asignaci\u00f3n');
      if ((a.estado === 'Mantenimiento') !== !!m) fail('Estado del activo no coincide con el mantenimiento');
      if (as && (a.responsable !== as.colaborador || a.area !== as.area)) fail('Responsable o \u00e1rea no coincide con la asignaci\u00f3n');
    });
    s.movs.forEach(m => {
      if (!assets.has(m.activoId)) fail('Movimiento sin activo');
      if (typeof m.fecha !== 'string' || !Number.isFinite(Date.parse(m.fecha))) fail('Fecha de movimiento inv\u00e1lida');
      text(m.tipo,'Tipo de movimiento',1,60);text(m.activo,'Nombre del activo',3,120);text(m.detalle,'Detalle',1,1500);text(m.usuario,'Usuario',3,100);
    });
    return true;
  }
  class Store {
    constructor(state = initial(), writer = () => {}) {
      verifyState(state); this._state = copy(state); this._writer = writer;
    }
    get state() { return copy(this._state); }
    transaction(mutator) {
      const draft = copy(this._state);
      const result = mutator(draft);
      draft.revision += 1;
      verifyState(draft);
      this._writer(copy(draft), this._state.revision);
      this._state = draft;
      return result;
    }
    find(s,id) { const a=s.activos.find(x=>x.id===id); if(!a) fail('El activo no existe'); return a; }
    log(s,a,tipo,detalle) { s.movs.unshift({id:uid(),activoId:a.id,activo:a.nombre,tipo,detalle,usuario:s.config.nombre,fecha:new Date().toISOString()}); }
    saveAsset(input,id = '') {
      return this.transaction(s => {
        const data=assetData(input), existing=id ? this.find(s,id) : null;
        if(s.activos.some(a=>a.codigo===data.codigo && a.id!==id)) fail('El c\u00f3digo ya existe');
        if(!existing && !['Activo','Baja'].includes(data.estado)) fail('Usa los m\u00f3dulos de asignaci\u00f3n o mantenimiento para cambiar ese estado');
        if(existing && ['Asignado','Mantenimiento'].includes(existing.estado)) {
          if(data.estado!==existing.estado) fail('Primero devuelve el activo o cierra su mantenimiento');
          data.responsable=existing.responsable; data.area=existing.area;
        } else if (!['Activo','Baja'].includes(data.estado)) fail('El cambio de estado requiere su m\u00f3dulo correspondiente');
        const a=Object.assign({},data,{id:existing ? existing.id : uid()});
        if(existing) s.activos[s.activos.findIndex(v=>v.id===id)]=a;
        else s.activos.unshift(a);
        this.log(s,a,existing?'Edici\u00f3n':'Alta',existing?'Datos del activo actualizados':'Activo registrado');
        return a.id;
      });
    }
    retireAsset(id) {
      return this.transaction(s=>{
        const a=this.find(s,id);
        if(a.estado!=='Activo') fail('Solo se puede dar de baja un activo disponible');
        a.estado='Baja'; a.responsable=''; this.log(s,a,'Baja','Baja l\u00f3gica; se conserva el historial');
      });
    }
    assign(input) {
      return this.transaction(s=>{
        const a=this.find(s,input.activoId);
        if(a.estado!=='Activo') fail('El activo no est\u00e1 disponible');
        const colaborador=text(input.colaborador,'Colaborador',3,100);
        const cedula=text(input.cedula,'C\u00e9dula',5,15);
        if(!/^\d{5,15}$/.test(cedula)) fail('C\u00e9dula: usa entre 5 y 15 d\u00edgitos');
        const area=oneOf(input.area,AREAS,'\u00c1rea'), fecha=date(input.fecha);
        if(fecha<a.fecha) fail('La asignaci\u00f3n no puede ser anterior al ingreso');
        const as={id:uid(),activoId:a.id,activoNombre:a.nombre,colaborador,cedula,area,fecha,estado:'Activo',obs:text(input.obs||'','Observaciones',0,1000)};
        s.asigns.unshift(as); a.estado='Asignado';a.responsable=colaborador;a.area=area;
        this.log(s,a,'Asignaci\u00f3n','Asignado a '+colaborador);return as.id;
      });
    }
    returnAssignment(id,fecha=today()) {
      return this.transaction(s=>{
        const as=s.asigns.find(x=>x.id===id);if(!as) fail('La asignaci\u00f3n no existe');
        if(as.estado!=='Activo') fail('La asignaci\u00f3n ya fue devuelta');
        date(fecha);if(fecha<as.fecha)fail('La devoluci\u00f3n no puede ser anterior a la asignaci\u00f3n');
        const a=this.find(s,as.activoId);as.estado='Devuelto';as.fechaDevolucion=fecha;
        a.estado='Activo';a.responsable='';this.log(s,a,'Devoluci\u00f3n','Devuelto por '+as.colaborador);
      });
    }
    maintenance(input) {
      return this.transaction(s=>{
        const a=this.find(s,input.activoId);if(a.estado!=='Activo')fail('Primero devuelve o libera el activo');
        const fecha=date(input.fecha);if(fecha<a.fecha)fail('Mantenimiento anterior al ingreso');
        const m={id:uid(),activoId:a.id,activoNombre:a.nombre,tipo:oneOf(input.tipo,MANT_TIPOS,'Tipo'),tecnico:text(input.tecnico,'T\u00e9cnico',3,100),fecha,estado:oneOf(input.estado||'Pendiente',['Pendiente','En proceso'],'Estado'),desc:text(input.desc,'Descripci\u00f3n',3,1000)};
        s.mants.unshift(m);a.estado='Mantenimiento';this.log(s,a,'Mantenimiento',m.tipo+' - '+m.estado);return m.id;
      });
    }
    closeMaintenance(id,estado='Completado',fecha=today()) {
      return this.transaction(s=>{
        oneOf(estado,['Completado','Cancelado'],'Estado final');date(fecha);
        const m=s.mants.find(x=>x.id===id);if(!m)fail('Mantenimiento no encontrado');
        if(!['Pendiente','En proceso'].includes(m.estado))fail('El mantenimiento ya est\u00e1 cerrado');
        if(fecha<m.fecha)fail('Cierre anterior al mantenimiento');
        const a=this.find(s,m.activoId);m.estado=estado;m.fechaCierre=fecha;a.estado='Activo';
        this.log(s,a,'Cierre de mantenimiento',m.tipo+' - '+estado);
      });
    }
    saveConfig(input) {
      return this.transaction(s=>{s.config={nombre:text(input.nombre,'Nombre',3,100),notificaciones:oneOf(input.notificaciones,['Activadas','Desactivadas'],'Notificaciones')};});
    }
    replace(snapshot) {
      verifyState(snapshot);
      const result=copy(snapshot);result.revision=this._state.revision+1;
      this._writer(result,this._state.revision);this._state=result;
    }
  }
  function report(state, filters = {}) {
    const {desde='',hasta='',area='',estado=''}=filters;
    if(desde)date(desde);if(hasta)date(hasta);
    if(desde&&hasta&&desde>hasta)fail('La fecha inicial no puede superar la fecha final');
    if(area)oneOf(area,AREAS,'\u00c1rea');if(estado)oneOf(estado,ESTADOS,'Estado');
    return copy(state.activos.filter(a=>(!desde||a.fecha>=desde)&&(!hasta||a.fecha<=hasta)&&(!area||a.area===area)&&(!estado||a.estado===estado)));
  }
  function csv(data) {
    const cell = value => {
      let v=String(value ?? '');
      if(/^[\s]*[=+\-@\t\r]/.test(v))v="'"+v;
      return '"'+v.replace(/"/g,'""')+'"';
    };
    const rows=[['Nombre','C\u00f3digo','Tipo','\u00c1rea','Responsable','Estado','Fecha','Valor']];
    data.forEach(a=>rows.push([a.nombre,a.codigo,a.tipo,a.area,a.responsable,a.estado,a.fecha,a.valor]));
    return '\uFEFF'+rows.map(r=>r.map(cell).join(',')).join('\r\n');
  }
  function storageWriter(storage) {
    return (draft, expectedRevision) => {
      const previous=storage.getItem(KEY);
      if(previous && JSON.parse(previous).revision!==expectedRevision) fail('Los datos cambiaron en otra pesta\u00f1a. Recarga antes de guardar');
      storage.setItem(KEY,JSON.stringify(draft));
    };
  }
  return {Store,initial,verifyState,assetData,report,csv,today,KEY,TIPOS,AREAS,ESTADOS,MANT_TIPOS,storageWriter};
});
