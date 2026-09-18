# Matriz completa de pruebas - SAAAF

Fecha: 15 de septiembre de 2026. Se conservan resultados observados, no aprobaciones inferidas.

## Alcance y condiciones

UT: Node.js y reglas del dominio. UI: Chromium 144, DOM real con un doble de Storage en memoria; no prueba el disco del navegador, HTTP o un teléfono físico. JV: compilación Java 11, validadores, DAO JDBC sobre HSQLDB y controladores con dobles de request/response. No se ejecutaron MySQL, Tomcat/JSP o Maven.

**Total: 116 casos ejecutados; 116 aprobados dentro de ese alcance.** Los 8 hallazgos del original no se suman como aprobaciones del producto.

## 1. Pruebas de interfaz documentadas

### UI-01 - Acceso incorrecto y Escape

**Precondición:** secuencia controlada del script `02_Aplicacion_Web/tests/browser_test.py`, datos ficticios y contexto del navegador creado por el runner.

**Pasos y datos:** Ingresar clave incorrecta y pulsar Escape.

**Resultado esperado:** La pantalla de acceso permanece y el contenido no se muestra.

**Resultado obtenido:** La pantalla de acceso permanece y el contenido no se muestra.

**Estado:** APROBADA. **Duración registrada:** 77.64 ms.

**Soporte:** resultados_interfaz.json y ejecucion_interfaz.log.

### UI-02 - Acceso demostrativo correcto

**Precondición:** secuencia controlada del script `02_Aplicacion_Web/tests/browser_test.py`, datos ficticios y contexto del navegador creado por el runner.

**Pasos y datos:** Ingresar demo y clave de demostracion.

**Resultado esperado:** Se abre Dashboard sin activos.

**Resultado obtenido:** Se abre Dashboard sin activos.

**Estado:** APROBADA. **Duración registrada:** 97.96 ms.

**Soporte:** capturas/01_acceso.png.

### UI-03 - Validacion de campos obligatorios

**Precondición:** secuencia controlada del script `02_Aplicacion_Web/tests/browser_test.py`, datos ficticios y contexto del navegador creado por el runner.

**Pasos y datos:** Guardar el formulario de activo vacio.

**Resultado esperado:** No crea registros y muestra la validacion.

**Resultado obtenido:** No crea registros y muestra la validacion.

**Estado:** APROBADA. **Duración registrada:** 442.63 ms.

**Soporte:** capturas/02_validacion.png.

### UI-04 - Registro de tres activos

**Precondición:** secuencia controlada del script `02_Aplicacion_Web/tests/browser_test.py`, datos ficticios y contexto del navegador creado por el runner.

**Pasos y datos:** Diligenciar tres formularios con datos ficticios.

**Resultado esperado:** Tres activos y tres movimientos de alta.

**Resultado obtenido:** Tres activos y tres movimientos de alta.

**Estado:** APROBADA. **Duración registrada:** 674.58 ms.

**Soporte:** capturas/03_inventario.png.

### UI-05 - Codigo duplicado

**Precondición:** secuencia controlada del script `02_Aplicacion_Web/tests/browser_test.py`, datos ficticios y contexto del navegador creado por el runner.

**Pasos y datos:** Intentar registrar act-001 por segunda vez.

**Resultado esperado:** Rechaza el duplicado sin crear un cuarto activo.

**Resultado obtenido:** Rechaza el duplicado sin crear un cuarto activo.

**Estado:** APROBADA. **Duración registrada:** 176.99 ms.

**Soporte:** resultados_interfaz.json y ejecucion_interfaz.log.

### UI-06 - Valor negativo

**Precondición:** secuencia controlada del script `02_Aplicacion_Web/tests/browser_test.py`, datos ficticios y contexto del navegador creado por el runner.

**Pasos y datos:** Registrar activo con valor -1.

**Resultado esperado:** Rechazo y ningun registro nuevo.

**Resultado obtenido:** Rechazo y ningun registro nuevo.

**Estado:** APROBADA. **Duración registrada:** 192.95 ms.

**Soporte:** resultados_interfaz.json y ejecucion_interfaz.log.

### UI-07 - Edicion de activo

**Precondición:** secuencia controlada del script `02_Aplicacion_Web/tests/browser_test.py`, datos ficticios y contexto del navegador creado por el runner.

**Pasos y datos:** Abrir Editar y cambiar nombre.

**Resultado esperado:** Actualiza sin duplicar el activo.

**Resultado obtenido:** Actualiza sin duplicar el activo.

**Estado:** APROBADA. **Duración registrada:** 157.35 ms.

**Soporte:** resultados_interfaz.json y ejecucion_interfaz.log.

### UI-08 - Busqueda por codigo

**Precondición:** secuencia controlada del script `02_Aplicacion_Web/tests/browser_test.py`, datos ficticios y contexto del navegador creado por el runner.

**Pasos y datos:** Escribir ACT-002 en la busqueda.

**Resultado esperado:** Solo muestra el proyector.

**Resultado obtenido:** Solo muestra el proyector.

**Estado:** APROBADA. **Duración registrada:** 22.25 ms.

**Soporte:** resultados_interfaz.json y ejecucion_interfaz.log.

### UI-09 - Validacion de cedula

**Precondición:** secuencia controlada del script `02_Aplicacion_Web/tests/browser_test.py`, datos ficticios y contexto del navegador creado por el runner.

**Pasos y datos:** Intentar asignar con cedula alfanumerica.

**Resultado esperado:** Rechaza la asignacion.

**Resultado obtenido:** Rechaza la asignacion.

**Estado:** APROBADA. **Duración registrada:** 285.96 ms.

**Soporte:** resultados_interfaz.json y ejecucion_interfaz.log.

### UI-10 - Asignacion

**Precondición:** secuencia controlada del script `02_Aplicacion_Web/tests/browser_test.py`, datos ficticios y contexto del navegador creado por el runner.

**Pasos y datos:** Asignar ACT-001 al Colaborador Demo.

**Resultado esperado:** Estado Asignado y responsable actualizado.

**Resultado obtenido:** Estado Asignado y responsable actualizado.

**Estado:** APROBADA. **Duración registrada:** 395.74 ms.

**Soporte:** capturas/04_asignacion.png.

### UI-11 - Cancelacion y confirmacion de devolucion

**Precondición:** secuencia controlada del script `02_Aplicacion_Web/tests/browser_test.py`, datos ficticios y contexto del navegador creado por el runner.

**Pasos y datos:** Cancelar una devolucion; luego confirmar.

**Resultado esperado:** Cancelar conserva la asignacion; confirmar libera y conserva historial.

**Resultado obtenido:** Cancelar conserva la asignacion; confirmar libera y conserva historial.

**Estado:** APROBADA. **Duración registrada:** 185.44 ms.

**Soporte:** resultados_interfaz.json y ejecucion_interfaz.log.

### UI-12 - Tecnico de mantenimiento obligatorio

**Precondición:** secuencia controlada del script `02_Aplicacion_Web/tests/browser_test.py`, datos ficticios y contexto del navegador creado por el runner.

**Pasos y datos:** Guardar mantenimiento sin tecnico.

**Resultado esperado:** No crea mantenimiento.

**Resultado obtenido:** No crea mantenimiento.

**Estado:** APROBADA. **Duración registrada:** 228.86 ms.

**Soporte:** resultados_interfaz.json y ejecucion_interfaz.log.

### UI-13 - Registro de mantenimiento

**Precondición:** secuencia controlada del script `02_Aplicacion_Web/tests/browser_test.py`, datos ficticios y contexto del navegador creado por el runner.

**Pasos y datos:** Crear mantenimiento preventivo para ACT-002.

**Resultado esperado:** Activo en mantenimiento y registro Pendiente.

**Resultado obtenido:** Activo en mantenimiento y registro Pendiente.

**Estado:** APROBADA. **Duración registrada:** 370.01 ms.

**Soporte:** capturas/05_mantenimiento.png.

### UI-14 - Cierre de mantenimiento

**Precondición:** secuencia controlada del script `02_Aplicacion_Web/tests/browser_test.py`, datos ficticios y contexto del navegador creado por el runner.

**Pasos y datos:** Pulsar Completar y confirmar.

**Resultado esperado:** Activo disponible, mantenimiento Completado.

**Resultado obtenido:** Activo disponible, mantenimiento Completado.

**Estado:** APROBADA. **Duración registrada:** 95.63 ms.

**Soporte:** resultados_interfaz.json y ejecucion_interfaz.log.

### UI-15 - Cancelacion de mantenimiento

**Precondición:** secuencia controlada del script `02_Aplicacion_Web/tests/browser_test.py`, datos ficticios y contexto del navegador creado por el runner.

**Pasos y datos:** Abrir otro mantenimiento y cancelarlo.

**Resultado esperado:** Activo disponible, registro Cancelado conservado.

**Resultado obtenido:** Activo disponible, registro Cancelado conservado.

**Estado:** APROBADA. **Duración registrada:** 254.36 ms.

**Soporte:** resultados_interfaz.json y ejecucion_interfaz.log.

### UI-16 - Baja logica

**Precondición:** secuencia controlada del script `02_Aplicacion_Web/tests/browser_test.py`, datos ficticios y contexto del navegador creado por el runner.

**Pasos y datos:** Dar de baja ACT-003 y confirmar.

**Resultado esperado:** Conserva tres activos y registra Baja.

**Resultado obtenido:** Conserva tres activos y registra Baja.

**Estado:** APROBADA. **Duración registrada:** 120.77 ms.

**Soporte:** resultados_interfaz.json y ejecucion_interfaz.log.

### UI-17 - Recuperacion de estado al reinicializar

**Precondición:** secuencia controlada del script `02_Aplicacion_Web/tests/browser_test.py`, datos ficticios y contexto del navegador creado por el runner.

**Pasos y datos:** Reinicializar la pagina con el almacenamiento previo.

**Resultado esperado:** Recupera exactamente el estado previo; en DOM el Storage es simulado.

**Resultado obtenido:** Recupera exactamente el estado previo; en DOM el Storage es simulado.

**Estado:** APROBADA. **Duración registrada:** 189.32 ms.

**Soporte:** resultados_interfaz.json y ejecucion_interfaz.log.

### UI-18 - Preferencias guardadas

**Precondición:** secuencia controlada del script `02_Aplicacion_Web/tests/browser_test.py`, datos ficticios y contexto del navegador creado por el runner.

**Pasos y datos:** Guardar nombre y reinicializar.

**Resultado esperado:** Recupera el nombre configurado; persistencia simulada en modo DOM.

**Resultado obtenido:** Recupera el nombre configurado; persistencia simulada en modo DOM.

**Estado:** APROBADA. **Duración registrada:** 574.84 ms.

**Soporte:** capturas/06_configuracion.png.

### UI-19 - Trazabilidad tras renombrar

**Precondición:** secuencia controlada del script `02_Aplicacion_Web/tests/browser_test.py`, datos ficticios y contexto del navegador creado por el runner.

**Pasos y datos:** Consultar detalle del activo editado y el historial.

**Resultado esperado:** Se conservan alta asignacion y devolucion por ID.

**Resultado obtenido:** Se conservan alta asignacion y devolucion por ID.

**Estado:** APROBADA. **Duración registrada:** 447.6 ms.

**Soporte:** capturas/07_movimientos.png.

### UI-20 - Filtros combinados de reporte

**Precondición:** secuencia controlada del script `02_Aplicacion_Web/tests/browser_test.py`, datos ficticios y contexto del navegador creado por el runner.

**Pasos y datos:** Area Ventas, estado Activo y rango del ano 2026.

**Resultado esperado:** Dos registros coinciden con los filtros.

**Resultado obtenido:** Dos registros coinciden con los filtros.

**Estado:** APROBADA. **Duración registrada:** 321.18 ms.

**Soporte:** capturas/08_reportes.png.

### UI-21 - Rango invertido

**Precondición:** secuencia controlada del script `02_Aplicacion_Web/tests/browser_test.py`, datos ficticios y contexto del navegador creado por el runner.

**Pasos y datos:** Fecha inicial mayor a fecha final.

**Resultado esperado:** Mensaje de validacion y reporte vacio.

**Resultado obtenido:** Mensaje de validacion y reporte vacio.

**Estado:** APROBADA. **Duración registrada:** 76.44 ms.

**Soporte:** resultados_interfaz.json y ejecucion_interfaz.log.

### UI-22 - Descarga CSV

**Precondición:** secuencia controlada del script `02_Aplicacion_Web/tests/browser_test.py`, datos ficticios y contexto del navegador creado por el runner.

**Pasos y datos:** Exportar todos los activos y leer el archivo descargado.

**Resultado esperado:** CSV real descargado con UTF-8, codigos y valor cero.

**Resultado obtenido:** CSV real descargado con UTF-8, codigos y valor cero.

**Estado:** APROBADA. **Duración registrada:** 38.6 ms.

**Soporte:** SAAAF_reporte_prueba.csv.

### UI-23 - Descarga de respaldo

**Precondición:** secuencia controlada del script `02_Aplicacion_Web/tests/browser_test.py`, datos ficticios y contexto del navegador creado por el runner.

**Pasos y datos:** Exportar JSON y comparar contenido.

**Resultado esperado:** JSON descargado coincide con el estado completo.

**Resultado obtenido:** JSON descargado coincide con el estado completo.

**Estado:** APROBADA. **Duración registrada:** 133.17 ms.

**Soporte:** respaldo_prueba.json.

### UI-24 - Rechazo de respaldo incompatible

**Precondición:** secuencia controlada del script `02_Aplicacion_Web/tests/browser_test.py`, datos ficticios y contexto del navegador creado por el runner.

**Pasos y datos:** Importar JSON con version 1.

**Resultado esperado:** No modifica datos y muestra rechazo.

**Resultado obtenido:** No modifica datos y muestra rechazo.

**Estado:** APROBADA. **Duración registrada:** 116.73 ms.

**Soporte:** resultados_interfaz.json y ejecucion_interfaz.log.

### UI-25 - Restauracion de respaldo

**Precondición:** secuencia controlada del script `02_Aplicacion_Web/tests/browser_test.py`, datos ficticios y contexto del navegador creado por el runner.

**Pasos y datos:** Reiniciar datos e importar el respaldo valido.

**Resultado esperado:** Recupera tres activos y sus relaciones.

**Resultado obtenido:** Recupera tres activos y sus relaciones.

**Estado:** APROBADA. **Duración registrada:** 206.21 ms.

**Soporte:** resultados_interfaz.json y ejecucion_interfaz.log.

### UI-26 - Renderizado seguro de texto

**Precondición:** secuencia controlada del script `02_Aplicacion_Web/tests/browser_test.py`, datos ficticios y contexto del navegador creado por el runner.

**Pasos y datos:** Registrar texto con etiqueta img y manejador de evento.

**Resultado esperado:** Lo muestra como texto sin ejecutar el evento.

**Resultado obtenido:** Lo muestra como texto sin ejecutar el evento.

**Estado:** APROBADA. **Duración registrada:** 189.26 ms.

**Soporte:** resultados_interfaz.json y ejecucion_interfaz.log.

### UI-27 - Vista movil 390 x 844

**Precondición:** secuencia controlada del script `02_Aplicacion_Web/tests/browser_test.py`, datos ficticios y contexto del navegador creado por el runner.

**Pasos y datos:** Abrir menu Dashboard y formulario en viewport movil.

**Resultado esperado:** No hay desbordamiento global y el formulario cabe; no es telefono fisico.

**Resultado obtenido:** No hay desbordamiento global y el formulario cabe; no es telefono fisico.

**Estado:** APROBADA. **Duración registrada:** 680.33 ms.

**Soporte:** capturas/09_movil_dashboard.png.

### UI-28 - Vista movil 360 x 800

**Precondición:** secuencia controlada del script `02_Aplicacion_Web/tests/browser_test.py`, datos ficticios y contexto del navegador creado por el runner.

**Pasos y datos:** Reducir viewport y navegar a Activos.

**Resultado esperado:** Sin desbordamiento global; tabla con desplazamiento propio.

**Resultado obtenido:** Sin desbordamiento global; tabla con desplazamiento propio.

**Estado:** APROBADA. **Duración registrada:** 72.16 ms.

**Soporte:** resultados_interfaz.json y ejecucion_interfaz.log.

### UI-29 - Almacenamiento corrupto y recuperacion

**Precondición:** secuencia controlada del script `02_Aplicacion_Web/tests/browser_test.py`, datos ficticios y contexto del navegador creado por el runner.

**Pasos y datos:** Arrancar con JSON corrupto, intentar guardar y luego restaurar.

**Resultado esperado:** No sobreescribe el contenido corrupto; restaura con confirmacion.

**Resultado obtenido:** No sobreescribe el contenido corrupto; restaura con confirmacion.

**Estado:** APROBADA. **Duración registrada:** 519.87 ms.

**Soporte:** resultados_interfaz.json y ejecucion_interfaz.log.

### UI-30 - Cerrar demostracion

**Precondición:** secuencia controlada del script `02_Aplicacion_Web/tests/browser_test.py`, datos ficticios y contexto del navegador creado por el runner.

**Pasos y datos:** Pulsar Salir.

**Resultado esperado:** Oculta la aplicacion y solicita ingreso nuevamente.

**Resultado obtenido:** Oculta la aplicacion y solicita ingreso nuevamente.

**Estado:** APROBADA. **Duración registrada:** 55.08 ms.

**Soporte:** resultados_interfaz.json y ejecucion_interfaz.log.

## 2. Pruebas del dominio JavaScript

Precondición: Store nuevo o fixture declarado por cada caso. Datos base: ACT-001, Equipo TI, Tecnología, fecha 2026-01-10, valor 2500000. Los casos que alteran esos valores lo indican en su título y en el código de la prueba.

Ejecución: `node --test tests/core.test.js`. Fuente exacta: `02_Aplicacion_Web/tests/core.test.js`. Observación: cada resultado APROBADA corresponde a un `ok` real del runner TAP.

| Caso | Condición / resultado esperado por la aserción | Resultado obtenido |
|---|---|---|
| UT-01 | Inicio sin registros y esquema valido | APROBADA: aserciones superadas |
| UT-02 | Crear activo y registrar alta | APROBADA: aserciones superadas |
| UT-03 | Nombre obligatorio | APROBADA: aserciones superadas |
| UT-04 | Codigo obligatorio y minimo de caracteres | APROBADA: aserciones superadas |
| UT-05 | Rechazar codigo duplicado normalizado | APROBADA: aserciones superadas |
| UT-06 | Tipo obligatorio | APROBADA: aserciones superadas |
| UT-07 | Area obligatoria | APROBADA: aserciones superadas |
| UT-08 | Rechazar valor negativo | APROBADA: aserciones superadas |
| UT-09 | Rechazar valor no numerico | APROBADA: aserciones superadas |
| UT-10 | Fecha obligatoria | APROBADA: aserciones superadas |
| UT-11 | Rechazar fecha de calendario inexistente | APROBADA: aserciones superadas |
| UT-12 | Editar conserva ID y no duplica el registro | APROBADA: aserciones superadas |
| UT-13 | Historial permanece vinculado al ID tras renombrar | APROBADA: aserciones superadas |
| UT-14 | Asignacion actualiza estado responsable y area | APROBADA: aserciones superadas |
| UT-15 | Rechazar doble asignacion del mismo activo | APROBADA: aserciones superadas |
| UT-16 | Cedula debe ser numerica | APROBADA: aserciones superadas |
| UT-17 | Colaborador obligatorio | APROBADA: aserciones superadas |
| UT-18 | Asignacion posterior o igual al ingreso | APROBADA: aserciones superadas |
| UT-19 | Devolucion libera activo y conserva historial | APROBADA: aserciones superadas |
| UT-20 | Rechazar devolucion repetida | APROBADA: aserciones superadas |
| UT-21 | Rechazar devolucion anterior a asignacion | APROBADA: aserciones superadas |
| UT-22 | No dar de baja activo asignado | APROBADA: aserciones superadas |
| UT-23 | Impedir cambio directo que rompa asignacion | APROBADA: aserciones superadas |
| UT-24 | No crear un activo como asignado sin registro | APROBADA: aserciones superadas |
| UT-25 | Registrar mantenimiento cambia estado | APROBADA: aserciones superadas |
| UT-26 | Tecnico obligatorio | APROBADA: aserciones superadas |
| UT-27 | Descripcion de mantenimiento obligatoria | APROBADA: aserciones superadas |
| UT-28 | No abrir mantenimiento sobre activo asignado | APROBADA: aserciones superadas |
| UT-29 | Impedir dos mantenimientos simultaneos | APROBADA: aserciones superadas |
| UT-30 | Completar mantenimiento libera activo | APROBADA: aserciones superadas |
| UT-31 | Cancelar mantenimiento conserva registro y libera | APROBADA: aserciones superadas |
| UT-32 | No cerrar dos veces el mantenimiento | APROBADA: aserciones superadas |
| UT-33 | Baja logica conserva activo e historial | APROBADA: aserciones superadas |
| UT-34 | No asignar activo dado de baja | APROBADA: aserciones superadas |
| UT-35 | Reporte combina rango area y estado | APROBADA: aserciones superadas |
| UT-36 | Reporte rechaza rango de fechas invertido | APROBADA: aserciones superadas |
| UT-37 | CSV conserva cero y escapa comillas | APROBADA: aserciones superadas |
| UT-38 | CSV neutraliza texto que inicia como formula | APROBADA: aserciones superadas |
| UT-39 | Preferencias se guardan en la transaccion | APROBADA: aserciones superadas |
| UT-40 | Respaldo valido se puede restaurar | APROBADA: aserciones superadas |
| UT-41 | Rechazar version de respaldo incompatible | APROBADA: aserciones superadas |
| UT-42 | Rechazar respaldo con referencia huerfana | APROBADA: aserciones superadas |
| UT-43 | Rechazar identificador peligroso en respaldo | APROBADA: aserciones superadas |
| UT-44 | Fallo de escritura no confirma ni muta el estado | APROBADA: aserciones superadas |
| UT-45 | Lectura del estado devuelve copia defensiva | APROBADA: aserciones superadas |
| UT-46 | Persistencia detecta conflicto entre pestanas | APROBADA: aserciones superadas |
| UT-47 | Texto con etiquetas se conserva como dato, no se ejecuta en dominio | APROBADA: aserciones superadas |
| UT-48 | No editar activo inexistente | APROBADA: aserciones superadas |

## 3. Pruebas Java

Precondición: tabla de pruebas creada en HSQLDB en memoria, JDK y Servlet API. El código Java utiliza SQL preparado y solicitudes/respuestas dobles en las pruebas de controladores.

Ejecución: `python tests/ejecutar_java.py`. Fuente exacta: `03_Java_Servlets/src/test/java/co/sena/saaaf/tests/PruebasJava.java`. Soporte real: `resultados_java.log`.

| Caso | Condición / resultado esperado por la aserción | Resultado obtenido |
|---|---|---|
| JV-01 | Normalizar codigo y validar activo | APROBADA: aserciones superadas |
| JV-02 | Rechazar nombre vacio | APROBADA: aserciones superadas |
| JV-03 | Rechazar codigo corto | APROBADA: aserciones superadas |
| JV-04 | Rechazar nombre demasiado largo | APROBADA: aserciones superadas |
| JV-05 | Rechazar tipo vacio | APROBADA: aserciones superadas |
| JV-06 | Rechazar area nula | APROBADA: aserciones superadas |
| JV-07 | Rechazar estado desconocido | APROBADA: aserciones superadas |
| JV-08 | Rechazar estado nulo de forma controlada | APROBADA: aserciones superadas |
| JV-09 | Asignado requiere responsable | APROBADA: aserciones superadas |
| JV-10 | Rechazar fecha inexistente | APROBADA: aserciones superadas |
| JV-11 | Rechazar identificador no numerico | APROBADA: aserciones superadas |
| JV-12 | Rechazar fecha nula | APROBADA: aserciones superadas |
| JV-13 | Escapar HTML y atributos | APROBADA: aserciones superadas |
| JV-14 | Token generado por sesion y valido | APROBADA: aserciones superadas |
| JV-15 | Rechazar token alterado | APROBADA: aserciones superadas |
| JV-16 | Rechazar token ausente | APROBADA: aserciones superadas |
| JV-17 | DAO insertar y listar con JDBC real | APROBADA: aserciones superadas |
| JV-18 | DAO consultar por ID | APROBADA: aserciones superadas |
| JV-19 | DAO actualizar registro | APROBADA: aserciones superadas |
| JV-20 | DAO informa actualizacion inexistente | APROBADA: aserciones superadas |
| JV-21 | DAO restriccion de codigo unico | APROBADA: aserciones superadas |
| JV-22 | DAO guarda texto SQL como dato | APROBADA: aserciones superadas |
| JV-23 | DAO eliminar registro | APROBADA: aserciones superadas |
| JV-24 | DAO eliminar inexistente devuelve falso | APROBADA: aserciones superadas |
| JV-25 | GET eliminar devuelve 405 sin modificar | APROBADA: aserciones superadas |
| JV-26 | GET ID invalido devuelve 400 | APROBADA: aserciones superadas |
| JV-27 | GET activo inexistente devuelve 404 | APROBADA: aserciones superadas |
| JV-28 | GET listar prepara vista y token | APROBADA: aserciones superadas |
| JV-29 | POST sin token devuelve 403 | APROBADA: aserciones superadas |
| JV-30 | POST invalido devuelve 400 | APROBADA: aserciones superadas |
| JV-31 | POST guardar inserta y redirige | APROBADA: aserciones superadas |
| JV-32 | POST duplicado devuelve 409 | APROBADA: aserciones superadas |
| JV-33 | POST actualizar persiste los cambios | APROBADA: aserciones superadas |
| JV-34 | POST eliminar con token elimina | APROBADA: aserciones superadas |
| JV-35 | Accion desconocida rechazada | APROBADA: aserciones superadas |
| JV-36 | Error SQL no revela detalle tecnico | APROBADA: aserciones superadas |
| JV-37 | Dashboard calcula indicadores | APROBADA: aserciones superadas |
| JV-38 | Filtro agrega codificacion y cabeceras | APROBADA: aserciones superadas |

## 4. Hallazgos reproducidos del HTML original

Estos resultados describen defectos del material original, no fallos pendientes de la versión revisada. Soporte: `hallazgos_original.json` y script `baseline_original.py`.

### OB-01 - Acceso sin validacion

**Comprobación:** El formulario acepta usuario y clave incorrectos.

**Observado:** "La funcion doLogin oculta el acceso con cualquier dato.". **Estado:** REPRODUCIDO.

### OB-02 - Codigos duplicados

**Comprobación:** Guardar dos veces el mismo codigo crea dos activos.

**Observado:** "Se almacenaron dos activos con ACT-001.". **Estado:** REPRODUCIDO.

### OB-03 - Valor negativo aceptado

**Comprobación:** Guardar un valor -10 sin validacion.

**Observado:** "El valor -10 fue aceptado.". **Estado:** REPRODUCIDO.

### OB-04 - Asignacion eliminada deja activo ocupado

**Comprobación:** Eliminar asignacion y comprobar estado del activo.

**Observado:** {"estado": "Asignado", "asignaciones": 0}. **Estado:** REPRODUCIDO.

### OB-05 - Mantenimiento eliminado no libera activo

**Comprobación:** Eliminar mantenimiento y comprobar activo.

**Observado:** {"estado": "Mantenimiento", "mantenimientos": 0}. **Estado:** REPRODUCIDO.

### OB-06 - Preferencias no persistidas

**Comprobación:** Guardar preferencias no escribe almacenamiento.

**Observado:** "El boton solo muestra un aviso; no escribe preferencias.". **Estado:** REPRODUCIDO.

### OB-07 - HTML de usuario ejecutable

**Comprobación:** Mostrar nombre de activo con etiqueta img y evento.

**Observado:** "Se ejecuto un manejador onerror almacenado como nombre de activo.". **Estado:** REPRODUCIDO.

### OB-08 - Interfaz original recortada en movil

**Comprobación:** La barra de acciones se extiende fuera de 390px.

**Observado:** {"ancho_pantalla": 390, "borde_derecho_barra": 705.81}. **Estado:** REPRODUCIDO.

## 5. Pendientes

Consultar `07_Documentacion/Validacion_pendiente_despliegue.md`: 10 comprobaciones pendientes separadas de los resultados aprobados.