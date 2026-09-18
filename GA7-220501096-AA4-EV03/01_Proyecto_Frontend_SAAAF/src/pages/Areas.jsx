import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { areas } from '../data/mockData.js';

export default function Areas({ assets, employees }) {
  return (
    <>
      <PageHeader title="Áreas" description="Resumen de áreas utilizadas para clasificar responsables y activos." />
      <section className="area-grid">
        {areas.map((area) => (
          <article className="area-card" key={area}>
            <h3>{area}</h3>
            <p>{assets.filter((item) => item.area === area).length} activos</p>
            <span>{employees.filter((item) => item.area === area).length} empleados</span>
          </article>
        ))}
      </section>
    </>
  );
}
