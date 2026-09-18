import React, { useState } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import DataTable from '../components/DataTable.jsx';
import Modal from '../components/Modal.jsx';
import { areas } from '../data/mockData.js';

const emptyForm = { document: '', name: '', email: '', area: 'Tecnología' };

export default function Empleados({ employees, onAddEmployee }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  function submit(event) {
    event.preventDefault();
    onAddEmployee(form);
    setForm(emptyForm);
    setOpen(false);
  }

  return (
    <>
      <PageHeader title="Empleados" description="Colaboradores habilitados para recibir activos y generar actas." action={<button className="primary-button" onClick={() => setOpen(true)}>+ Nuevo empleado</button>} />
      <DataTable rows={employees} columns={[
        { key: 'document', label: 'Documento' },
        { key: 'name', label: 'Nombre' },
        { key: 'email', label: 'Correo' },
        { key: 'area', label: 'Área' },
      ]} />
      <Modal title="Registrar empleado" open={open} onClose={() => setOpen(false)}>
        <form className="form-grid" onSubmit={submit}>
          <label>Documento<input required inputMode="numeric" value={form.document} onChange={(e) => setForm({ ...form, document: e.target.value.replace(/\D/g, '') })} /></label>
          <label>Nombre completo<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
          <label>Correo<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
          <label>Área<select value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })}>{areas.map((area) => <option key={area}>{area}</option>)}</select></label>
          <div className="form-actions"><button type="button" className="secondary-button" onClick={() => setOpen(false)}>Cancelar</button><button className="primary-button">Guardar empleado</button></div>
        </form>
      </Modal>
    </>
  );
}
