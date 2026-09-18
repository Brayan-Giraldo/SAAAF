import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import SummaryCard from '../components/SummaryCard.jsx';
import DataTable from '../components/DataTable.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

export default function Dashboard({ assets, assignments }) {
  const available = assets.filter((item) => item.status === 'Disponible').length;
  const assigned = assets.filter((item) => item.status === 'Asignado').length;
  const maintenance = assets.filter((item) => item.status === 'Mantenimiento').length;

  return (
    <>
      <PageHeader title="Dashboard" description="Resumen operativo del inventario y las asignaciones de activos fijos." />
      <section className="summary-grid">
        <SummaryCard label="Total activos" value={assets.length} hint="Inventario registrado" />
        <SummaryCard label="Disponibles" value={available} hint="Listos para asignación" />
        <SummaryCard label="Asignados" value={assigned} hint={`${assignments.filter((item) => item.status === 'Activa').length} asignaciones activas`} />
        <SummaryCard label="Mantenimiento" value={maintenance} hint="Requieren seguimiento" />
      </section>
      <section className="section-block">
        <div className="section-title"><h2>Activos recientes</h2><span>Vista rápida</span></div>
        <DataTable
          rows={assets.slice(0, 5)}
          columns={[
            { key: 'code', label: 'Código' },
            { key: 'name', label: 'Activo' },
            { key: 'area', label: 'Área' },
            { key: 'status', label: 'Estado', render: (row) => <StatusBadge value={row.status} /> },
          ]}
        />
      </section>
    </>
  );
}
