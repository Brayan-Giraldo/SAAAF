# Comprobaciones pendientes en el entorno de destino

Estas actividades son **pendientes**, no pruebas aprobadas. La restricción del entorno de preparación impidió navegar a HTTP/file local y no había Maven, Tomcat o MySQL disponibles para una ejecución real.

| ID | Comprobación | Resultado esperado | Estado |
|---|---|---|---|
| PD-01 | Ejecutar iniciar.py y navegar por HTTP local | Interfaz cargada sin errores de consola | Pendiente |
| PD-02 | Crear activo, cerrar el navegador y volver al mismo origen | Inventario recuperado desde localStorage nativo | Pendiente |
| PD-03 | Repetir en Chrome/Edge objetivo y en un teléfono físico | Formularios, tablas y descargas utilizables | Pendiente |
| PD-04 | Ejecutar mvn clean package | Compilación Maven y WAR generado sin errores | Pendiente |
| PD-05 | Ejecutar esquema MySQL y configurar cuenta local | Conexión de aplicación sin credenciales incrustadas | Pendiente |
| PD-06 | Desplegar en Tomcat 9 y abrir las tres JSP | Vistas compiladas y renderizadas correctamente | Pendiente |
| PD-07 | Registrar, editar, consultar y eliminar desde HTML/JSP | CRUD real en MySQL, sin eliminar por GET | Pendiente |
| PD-08 | Probar token ausente, ID inválido y código duplicado en HTTP real | Estados 403, 400 y 409 con mensajes controlados | Pendiente |
| PD-09 | Contrastar AA3 con la guía completa del instructor | Alcance y modalidades exigidas confirmados | Pendiente |
| PD-10 | Publicar en un repositorio autorizado si se exige | URL real comprobada y sin secretos | Pendiente |

Para cada caso realizado, registra fecha, ambiente, datos de entrada, pasos, resultado obtenido, captura/log y responsable. No reemplaces "Pendiente" hasta disponer de esa evidencia.
