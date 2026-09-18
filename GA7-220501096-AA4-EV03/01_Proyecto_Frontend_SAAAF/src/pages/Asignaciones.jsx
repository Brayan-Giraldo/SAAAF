import React, { useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import DataTable from '../components/DataTable.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import Modal from '../components/Modal.jsx';
import { formatDate } from '../utils/formatters.js';

export default function Asignaciones({ assets, employees, assignments, onAddAssignment }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ assetId: '', employeeId: '', date: new Date().toISOString().slice(0, 10), observations: '' });
  const availableAssets = useMemo(() => assets.filter((asset) => asset.status === 'Disponible'), [assets]);

  function assetName(id) { return assets.find((item) => item.id === Number(id))?.name || '-'; }
  function employeeName(id) { return employees.find((item) => item.id === Number(id))?.name || '-'; }

  function submit(event) {
    event.preventDefault();
    onAddAssignment(form);
    setForm({ assetId: '', employeeId: '', date: new Date().toISOString().slice(0, 10), observations: '' });
    setOpen(false);
  }

  return (
    <>
      <PageHeader title="Asignaciones" description="Entrega controlada de activos a colaboradores y trazabilidad del responsable." action={<button className="primary-button" onClick={() => setOpen(true)}>+ Nueva asignación</button>} />
      <DataTable rows={assignments} columns={[
        { key: 'assetId', label: 'Activo', render: (row) => assetName(row.assetId) },
        { key: 'employeeId', label: 'Colaborador', render: (row) => employeeName(row.employeeId) },
        { key: 'date', label: 'Fecha', render: (row) => formatDate(row.date) },
        { key: 'status', label: 'Estado', render: (row) => <StatusBadge value={row.status} /> },
        { key: 'observations', label: 'Observaciones' },
      ]} />
      <Modal title="Nueva asignación" open={open} onClose={() => setOpen(false)}>
        <form className="form-grid" onSubmit={submit}>
          <label>Activo<select required value={form.assetId} onChange={(e) => setForm({ ...form, assetId: e.target.value })}><option value="">Seleccione...</option>{availableAssets.map((asset) => <option key={asset.id} value={asset.id}>{asset.code} - {asset.name}</option>)}</select></label>
          <label>Colaborador<select required value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })}><option value="">Seleccione...</option>{employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.name}</option>)}</select></label>
          <label>Fecha<input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></label>
          <label className="full-field">Observaciones<textarea value={form.observations} onChange={(e) => setForm({ ...form, observations: e.target.value })} placeholder="Condiciones de entrega, accesorios u observaciones..." /></label>
          <div className="form-actions"><button type="button" className="secondary-button" onClick={() => setOpen(false)}>Cancelar</button><button className="primary-button" disabled={!availableAssets.length}>Asignar activo</button></div>
        </form>
      </Modal>
    </>
  );
}
