import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import DataTable from '../components/DataTable.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { formatDate } from '../utils/formatters.js';

export default function Actas({ acts, assignments, assets, employees, onReturn }) {
  function assignment(id) { return assignments.find((item) => item.id === Number(id)); }
  function assetName(act) { const a = assignment(act.assignmentId); return assets.find((item) => item.id === a?.assetId)?.name || '-'; }
  function employeeName(act) { const a = assignment(act.assignmentId); return employees.find((item) => item.id === a?.employeeId)?.name || '-'; }

  return (
    <>
      <PageHeader title="Actas" description="Actas generadas por la asignación de activos y control de devolución." />
      <DataTable rows={acts} columns={[
        { key: 'number', label: 'Acta' },
        { key: 'asset', label: 'Activo', render: (row) => assetName(row) },
        { key: 'employee', label: 'Colaborador', render: (row) => employeeName(row) },
        { key: 'createdAt', label: 'Fecha', render: (row) => formatDate(row.createdAt) },
        { key: 'status', label: 'Estado', render: (row) => <StatusBadge value={row.status} /> },
        { key: 'actions', label: 'Acción', render: (row) => row.status === 'Vigente' ? <button className="table-button" onClick={() => onReturn(row.id)}>Registrar devolución</button> : <span className="muted">Cerrada</span> },
      ]} />
    </>
  );
}
