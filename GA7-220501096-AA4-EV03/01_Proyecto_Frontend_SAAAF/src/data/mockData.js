export const initialAssets = [
  { id: 1, code: 'ACT-001', name: 'Portátil Lenovo ThinkPad', type: 'Equipo TI', area: 'Tecnología', status: 'Asignado', serial: 'PF4SAA01' },
  { id: 2, code: 'ACT-002', name: 'Monitor Dell 24 pulgadas', type: 'Equipo TI', area: 'Contabilidad', status: 'Disponible', serial: 'DL24-0091' },
  { id: 3, code: 'ACT-003', name: 'Impresora Kyocera M2540dw', type: 'Periférico', area: 'Administración', status: 'Mantenimiento', serial: 'KYO-2540-17' },
  { id: 4, code: 'ACT-004', name: 'Portátil HP ProBook', type: 'Equipo TI', area: 'Ventas', status: 'Disponible', serial: 'HP-PB-4421' },
];

export const initialEmployees = [
  { id: 1, document: '1000000001', name: 'Laura Rodríguez', email: 'laura.rodriguez@empresa.com', area: 'Contabilidad' },
  { id: 2, document: '1000000002', name: 'Carlos Méndez', email: 'carlos.mendez@empresa.com', area: 'Ventas' },
  { id: 3, document: '1000000003', name: 'Andrea Torres', email: 'andrea.torres@empresa.com', area: 'Tecnología' },
];

export const areas = ['Tecnología', 'Contabilidad', 'Administración', 'Ventas', 'Gestión Humana', 'Operaciones'];

export const initialAssignments = [
  { id: 1, assetId: 1, employeeId: 3, date: '2026-09-12', observations: 'Asignación inicial para soporte TI', status: 'Activa' },
];

export const initialActs = [
  { id: 1, number: 'ACTA-0001', assignmentId: 1, createdAt: '2026-09-12', status: 'Vigente' },
];
