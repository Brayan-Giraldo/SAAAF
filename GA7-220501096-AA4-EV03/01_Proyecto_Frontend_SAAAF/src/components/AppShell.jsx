import React from 'react';

const items = [
  ['dashboard', 'Dashboard'],
  ['inventario', 'Inventario'],
  ['asignaciones', 'Asignaciones'],
  ['empleados', 'Empleados'],
  ['areas', 'Áreas'],
  ['actas', 'Actas'],
];

export default function AppShell({ activePage, onNavigate, children }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">S</span><div><strong>SAAAF</strong><small>Activos Fijos</small></div></div>
        <nav aria-label="Navegación principal">
          {items.map(([key, label]) => (
            <button key={key} className={activePage === key ? 'nav-item active' : 'nav-item'} onClick={() => onNavigate(key)}>
              {label}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer"><div className="avatar">BG</div><div><strong>Brayan Giraldo</strong><small>Administrador</small></div></div>
      </aside>
      <main className="main-area">
        <div className="mobile-nav">
          <strong>SAAAF</strong>
          <select value={activePage} onChange={(event) => onNavigate(event.target.value)} aria-label="Cambiar módulo">
            {items.map(([key, label]) => <option key={key} value={key}>{label}</option>)}
          </select>
        </div>
        <div className="content">{children}</div>
      </main>
    </div>
  );
}
