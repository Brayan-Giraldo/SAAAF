# Evidencia GA7-220501096-AA4-EV03

## Componente front-end del proyecto formativo

El componente desarrollado corresponde al front-end del sistema SAAAF - Sistema de Asignación de Actas de Activos Fijos. La solución se implementa en React y organiza la experiencia de usuario en los módulos Dashboard, Inventario, Asignaciones, Empleados, Áreas y Actas.

### 1. Relación con artefactos previos

La codificación mantiene la estructura funcional trabajada en los prototipos y en las evidencias anteriores del proyecto. Se conserva la navegación lateral, tarjetas de resumen, tablas, formularios, estados visuales y flujos de asignación/devolución.

### 2. Componentes codificados

- `AppShell`: estructura general y navegación.
- `PageHeader`: encabezado reutilizable de cada módulo.
- `SummaryCard`: indicadores del dashboard.
- `DataTable`: representación tabular reutilizable.
- `StatusBadge`: estados visuales de activos, actas y asignaciones.
- `Modal`: contenedor para formularios y acciones.
- Páginas: Dashboard, Inventario, Asignaciones, Empleados, Áreas y Actas.

### 3. Navegación y comportamiento

La navegación cambia el módulo visible sin recargar la aplicación. En dispositivos pequeños se reemplaza la barra lateral por un selector responsive. Los formularios permiten crear activos, empleados y asignaciones. Al registrar una asignación se cambia el estado del activo y se crea un acta; al registrar devolución se cierra la asignación y el activo vuelve a estar disponible.

### 4. Persistencia para la demostración

La evidencia utiliza `localStorage` para conservar los registros creados desde el navegador. Esta decisión permite demostrar el front-end de forma independiente del back-end, sin alterar la arquitectura prevista del sistema SAAAF.

### 5. Estándares de codificación

El código está dividido por responsabilidades, emplea nombres descriptivos, comentarios en puntos relevantes, funciones pequeñas, componentes reutilizables, Hooks de React y actualización inmutable del estado. No se versionan `node_modules`, archivos `.env` ni compilados.

### 6. Versionamiento

Repositorio definido para la entrega:

https://github.com/Brayan-Giraldo/SAAAF

Antes de entregar al instructor se debe subir esta carpeta al repositorio y verificar que el enlace sea accesible para evaluación.
