import React, { useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import DataTable from '../components/DataTable.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import Modal from '../components/Modal.jsx';
import { areas } from '../data/mockData.js';

const emptyForm = { code: '', name: '', type: 'Equipo TI', area: 'Tecnología', serial: '', status: 'Disponible' };

export default function Inventario({ assets, onAddAsset }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return assets;
    return assets.filter((asset) => [asset.code, asset.name, asset.serial, asset.area, asset.status].some((value) => String(value).toLowerCase().includes(term)));
  }, [assets, query]);

  function submit(event) {
    event.preventDefault();
    onAddAsset(form);
    setForm(emptyForm);
    setOpen(false);
  }

  return (
    <>
      <PageHeader
        title="Inventario"
        description="Registro, consulta y control del estado de los activos fijos."
        action={<button className="primary-button" onClick={() => setOpen(true)}>+ Nuevo activo</button>}
      />
      <div className="toolbar"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por código, nombre, serial, área o estado..." /></div>
      <DataTable
        rows={filtered}
        columns={[
          { key: 'code', label: 'Código' },
          { key: 'name', label: 'Activo' },
          { key: 'serial', label: 'Serial' },
          { key: 'type', label: 'Tipo' },
          { key: 'area', label: 'Área' },
          { key: 'status', label: 'Estado', render: (row) => <StatusBadge value={row.status} /> },
        ]}
      />
      <Modal title="Registrar activo" open={open} onClose={() => setOpen(false)}>
        <form className="form-grid" onSubmit={submit}>
          <label>Código<input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="ACT-005" /></label>
          <label>Nombre<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Portátil Dell Latitude" /></label>
          <label>Serial<input required value={form.serial} onChange={(e) => setForm({ ...form, serial: e.target.value.toUpperCase() })} /></label>
          <label>Tipo<select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option>Equipo TI</option><option>Periférico</option><option>Mobiliario</option><option>Otro</option></select></label>
          <label>Área<select value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })}>{areas.map((area) => <option key={area}>{area}</option>)}</select></label>
          <label>Estado<select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option>Disponible</option><option>Asignado</option><option>Mantenimiento</option><option>Baja</option></select></label>
          <div className="form-actions"><button type="button" className="secondary-button" onClick={() => setOpen(false)}>Cancelar</button><button className="primary-button">Guardar activo</button></div>
        </form>
      </Modal>
    </>
  );
}
