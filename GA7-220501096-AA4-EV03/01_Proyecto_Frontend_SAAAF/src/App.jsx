import React, { useEffect, useState } from 'react';
import AppShell from './components/AppShell.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Inventario from './pages/Inventario.jsx';
import Asignaciones from './pages/Asignaciones.jsx';
import Empleados from './pages/Empleados.jsx';
import Areas from './pages/Areas.jsx';
import Actas from './pages/Actas.jsx';
import { initialAssets, initialEmployees, initialAssignments, initialActs } from './data/mockData.js';
import { nextCode } from './utils/formatters.js';

const STORAGE_KEY = 'saaaf-aa4-ev03';

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export default function App() {
  const stored = loadState();
  const [activePage, setActivePage] = useState('dashboard');
  const [assets, setAssets] = useState(stored?.assets || initialAssets);
  const [employees, setEmployees] = useState(stored?.employees || initialEmployees);
  const [assignments, setAssignments] = useState(stored?.assignments || initialAssignments);
  const [acts, setActs] = useState(stored?.acts || initialActs);

  // Persistencia local para que la evidencia pueda demostrarse sin un back-end activo.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ assets, employees, assignments, acts }));
  }, [assets, employees, assignments, acts]);

  function addAsset(data) {
    setAssets((current) => [...current, { ...data, id: Date.now() }]);
  }

  function addEmployee(data) {
    setEmployees((current) => [...current, { ...data, id: Date.now() }]);
  }

  function addAssignment(data) {
    const id = Date.now();
    const assignment = { ...data, id, assetId: Number(data.assetId), employeeId: Number(data.employeeId), status: 'Activa' };
    setAssignments((current) => [...current, assignment]);
    setAssets((current) => current.map((asset) => asset.id === assignment.assetId ? { ...asset, status: 'Asignado' } : asset));
    setActs((current) => [...current, { id: id + 1, number: nextCode('ACTA', current), assignmentId: id, createdAt: data.date, status: 'Vigente' }]);
  }

  function registerReturn(actId) {
    const act = acts.find((item) => item.id === actId);
    const related = assignments.find((item) => item.id === act?.assignmentId);
    if (!act || !related) return;

    setActs((current) => current.map((item) => item.id === actId ? { ...item, status: 'Devuelta' } : item));
    setAssignments((current) => current.map((item) => item.id === related.id ? { ...item, status: 'Finalizada' } : item));
    setAssets((current) => current.map((asset) => asset.id === related.assetId ? { ...asset, status: 'Disponible' } : asset));
  }

  const pages = {
    dashboard: <Dashboard assets={assets} assignments={assignments} />,
    inventario: <Inventario assets={assets} onAddAsset={addAsset} />,
    asignaciones: <Asignaciones assets={assets} employees={employees} assignments={assignments} onAddAssignment={addAssignment} />,
    empleados: <Empleados employees={employees} onAddEmployee={addEmployee} />,
    areas: <Areas assets={assets} employees={employees} />,
    actas: <Actas acts={acts} assignments={assignments} assets={assets} employees={employees} onReturn={registerReturn} />,
  };

  return <AppShell activePage={activePage} onNavigate={setActivePage}>{pages[activePage]}</AppShell>;
}
