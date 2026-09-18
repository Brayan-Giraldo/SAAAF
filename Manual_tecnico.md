# Manual técnico - SAAAF

## 1. Dos implementaciones independientes

La carpeta web contiene una aplicación de navegador derivada del HTML recibido. La carpeta Java conserva la arquitectura del proyecto del ZIP: vista HTML/JSP, controladores Servlet, DAO, conexión JDBC y tabla MySQL. No se ha creado un API que conecte estas dos versiones. No se atribuyen al Java las asignaciones, mantenimientos, respaldos o movimientos de la interfaz local.

## 2. Código del navegador

`core.js` usa un objeto Store con snapshots defensivos. Toda modificación opera sobre una copia, valida campos y relaciones, incrementa revisión y llama al escritor; el estado en memoria solo se sustituye cuando la escritura no lanza errores. Se previenen duplicados, asignaciones simultáneas y combinaciones inconsistentes entre estado y relaciones.

`verifyState()` revisa la estructura completa antes de cargar o restaurar datos. `storageWriter()` comprueba la revisión existente para detectar cambios de otra pestaña antes de escribir. Esta comprobación es una protección local básica, no una transacción distribuida: localStorage no resuelve concurrencia de una aplicación multiusuario.

`ui.js` enlaza la interfaz y el dominio, escapa valores antes de generar HTML, mantiene confirmaciones y actualiza tablas/indicadores desde el estado. Los identificadores de respaldo deben cumplir un patrón restringido. Las descargas se construyen con Blob y enlaces temporales. El acceso es una demostración visible en el código, no una credencial secreta.

El snapshot tiene `version`, `revision`, `activos`, `asigns`, `mants`, `movs` y `config`. La clave es `saaaf_evidencia_v2`; no se reutilizan las claves de la fuente original para evitar sobrescribirlas. Las fechas operativas siguen el formato AAAA-MM-DD y el día predeterminado se obtiene en America/Bogota; los movimientos guardan instante ISO y se presentan con zona horaria Bogotá.

## 3. Modelo y estados

Activo: identificador, código, nombre, tipo, área, responsable, estado, fecha, valor y observaciones. Asignación: activoId, colaborador, cédula ficticia, área, fecha, estado y fechaDevolucion al cerrar. Mantenimiento: activoId, tipo, técnico, fecha, descripción, estado y fechaCierre. Movimiento: activoId estable, nombre mostrado en ese instante, tipo, detalle, usuario y fecha ISO.

La web permite: Activo -> Asignado -> Activo; Activo -> Mantenimiento -> Activo; Activo -> Baja. No acepta ocupar un activo que ya está ocupado. Java conserva la tabla original de activos con estados Disponible, Asignado, Mantenimiento y Baja; no tiene tablas de relaciones adicionales. No se implementa una migración automática entre modelos.

## 4. Java y JSP

`ValidacionActivo` aplica límites compatibles con el esquema, normaliza código y valida identificador/fecha/estado. `ActivoServlet` limita las acciones por método, solicita token para POST, maneja los errores esperados y aplica redirección después de escrituras exitosas. El DAO usa PreparedStatement y cierre automático de recursos. Actualización/eliminación devuelven si se afectó una fila.

`CsrfToken` genera un token por sesión con SecureRandom y compara el token recibido. `TokenServlet` suministra el token al formulario HTML del mismo origen. Los JSP incluyen el token y usan `Html.escape` para valores editables. El formulario JSP conserva seleccionado el estado actual. El filtro agrega UTF-8, nosniff, DENY y no-store. Estas medidas no sustituyen autenticación, autorización, HTTPS o gestión segura del despliegue.

`ConexionJDBC` permite variables de entorno o propiedades JVM, sin usuario root incrustado. La configuración de ejecución y rutas aparece en `03_Java_Servlets/README.md`. El esquema no elimina tablas existentes. Los ejemplos de datos se separan de la creación de estructura.

## 5. Pruebas y herramientas

Node.js ejecuta 48 casos del dominio con su runner integrado. Playwright ejecuta 30 casos de interfaz y 8 reproducciones del original. El modo DOM usa Chromium real y Storage en memoria debido al bloqueo de navegación local del entorno; el código del doble queda exclusivamente en las pruebas. El mismo runner dispone de modo HTTP para un entorno autorizado, pendiente de ejecución.

Java se compila con objetivo 11 y JDK 21.0.11, y ejecuta 38 casos mediante un runner sin JUnit. HSQLDB 1.8 disponible en el entorno se usa solamente para pruebas JDBC aisladas. Los servlets reciben dobles de request/response/dispatcher; no se compiló ni ejecutó una vista JSP. Maven, Tomcat y MySQL no se ejecutaron y no se presenta un WAR probado.

## 6. Preparación para otro alcance

Una implementación productiva necesita alcance aprobado, API/backend integrado, autenticación y permisos reales, transacciones de base de datos, auditoría del lado servidor, respaldo administrado, HTTPS, gestión de secretos, revisión de dependencias y pruebas de despliegue/rendimiento/seguridad. Son trabajos fuera del alcance demostrado, no características incluidas en esta entrega.
