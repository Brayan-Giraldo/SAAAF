# Trazabilidad de requerimientos y evidencia

Los requerimientos se derivan de las funciones visibles del material. Los controles y cierres agregados se identifican como desarrollo de esta entrega; no se presentan como texto literal de una guía no recibida.

| ID | Funcionalidad | Origen | Implementación | Pruebas |
|---|---|---|---|---|
| RF-01 | Acceso de demostración | HTML original, acceso marcado como demo | ui.js: doLogin/logout | UI-01, UI-02, UI-30 |
| RF-02 | Registrar, consultar y editar activos | HTML y CRUD Java del material | core.js: saveAsset; ActivoServlet/DAO | UT-02 a UT-13; UI-03 a UI-08; JV-17 a JV-21 |
| RF-03 | Indicadores y consulta de inventario | Dashboard de ambas fuentes | renderKPIs/renderDash; DashboardServlet | UI-02, UI-04; JV-37 |
| RF-04 | Asignar y devolver activos | HTML: saveAsign/devolverAsign | Store.assign/returnAssignment | UT-14 a UT-24; UI-09 a UI-11 |
| RF-05 | Registrar y cerrar mantenimiento | HTML: módulo mantenimiento; cierre agregado como corrección | Store.maintenance/closeMaintenance | UT-25 a UT-32; UI-12 a UI-15 |
| RF-06 | Conservar movimientos de activos | HTML: logMov; ID estable agregado | Store.log; viewActivo por activoId | UT-13, UT-19, UT-33; UI-19 |
| RF-07 | Filtrar reportes y exportar CSV | HTML: getReportData/exportCSV | report/csv; renderReportes | UT-35 a UT-38; UI-20 a UI-22 |
| RF-08 | Guardar preferencias | Pantalla original; persistencia completada | Store.saveConfig | UT-39; UI-18 |
| RF-09 | Persistir estado y validar recuperación | localStorage original; snapshot y respaldo agregados | Store.transaction/replace; storageWriter | UT-40 a UT-46; UI-17, UI-23 a UI-25, UI-29 |
| RF-10 | CRUD Java mediante HTML/JSP y JDBC | Proyecto y PDF AA2 del ZIP | ActivoServlet/ActivoDAO/vistas JSP | JV-17 a JV-38; JSP/MySQL pendientes |
| RNF-01 | Validar entradas y evitar interpretarlas como HTML | Criterio de validaciones; controles añadidos | verifyState, esc, ValidacionActivo, Html | UT-03 a UT-11; UI-26; JV-01 a JV-16 |
| RNF-02 | Adaptar interfaz a pantallas pequeñas | Interfaz web recibida; CSS responsivo agregado | estilos.css; toggleSidebar | UI-27, UI-28; dispositivo físico pendiente |