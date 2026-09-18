# Manual de usuario - SAAAF web

## 1. Finalidad y condiciones

La aplicación permite demostrar la administración de activos fijos mediante inventario, asignaciones, devoluciones, mantenimientos, movimientos e informes. Es una demostración académica local. No uses nombres, cédulas, contraseñas o inventarios reales. El acceso inicial no constituye autenticación de servidor.

## 2. Iniciar y salir

Extrae completamente el ZIP. Dentro de `02_Aplicacion_Web`, ejecuta `python iniciar.py` o el archivo `iniciar_windows.bat` con Python instalado. Se abrirá la dirección local indicada en la consola. Mantén esa consola abierta mientras navegas. Si el puerto está ocupado, usa `python iniciar.py --puerto 8766`.

La alternativa `SAAAF_Demostracion.html` permite abrir el mismo código como archivo. La persistencia de los archivos locales depende del navegador; el servidor local proporciona un origen más estable. No se comparten los datos entre el archivo, diferentes puertos, navegadores o equipos.

Ingresa con usuario `demo` y clave `DemoSaaaf2026!`. Los datos erróneos muestran un mensaje y no abren la interfaz. Pulsa **Salir** para ocultar el contenido y volver al acceso. Esta función no protege información real frente a una persona con acceso al equipo o al código.

## 3. Registrar y consultar activos

Pulsa **Nuevo Activo**. Diligencia nombre, código, tipo, área, fecha de ingreso y valor. Nombre y código no pueden estar vacíos; el código se normaliza a mayúsculas y debe ser único. Usa un valor no negativo. Observaciones y responsable son datos opcionales cuando el activo está disponible.

Guarda y comprueba la fila del inventario y el contador del Dashboard. Un error de validación mantiene el formulario abierto y no confirma el registro. El estado inicial operativo es **Activo**, equivalente a disponible en esta interfaz. Los estados Asignado y Mantenimiento se gestionan desde sus módulos, no creando un activo ocupado sin registro relacionado.

En **Activos**, utiliza los filtros de estado o escribe un nombre/código en la búsqueda. **Ver** muestra el detalle y los movimientos vinculados por identificador. **Editar** actualiza los datos manteniendo el mismo ID. Cuando existe una asignación o mantenimiento vigente, no puedes forzar el cambio de estado desde la edición.

**Baja** es una baja lógica: conserva el registro y el historial. Solo se permite cuando el activo está disponible. Un activo dado de baja no aparece como seleccionable para asignación. Puede volver a Activo mediante edición si esa es la decisión del escenario de demostración.

## 4. Asignar y registrar una devolución

Abre **Asignaciones > Nueva Asignación**. Indica colaborador ficticio, cédula de prueba, área, activo disponible y fecha. La cédula debe contener entre 5 y 15 dígitos; esta es una regla de formato de la demostración, no una validación de identidad. La fecha no puede ser anterior al ingreso del activo.

Al guardar, el activo pasa a Asignado, registra responsable y área, y deja de estar disponible para otra asignación. El registro de asignación conserva el estado **Activo** mientras está vigente. Este estado describe la asignación, no la disponibilidad del activo.

Pulsa **Devolver** y confirma. El registro pasa a Devuelto, almacena la fecha de devolución y libera el activo, sin borrar el historial. Cancelar el diálogo no modifica datos. No se admite devolver dos veces la misma asignación.

## 5. Gestionar mantenimientos

Devuelve primero cualquier activo asignado. En **Mantenimiento > Registrar Mantenimiento**, selecciona un activo disponible, tipo, técnico ficticio, fecha, descripción y estado Pendiente o En proceso. El activo queda en Mantenimiento y no se puede asignar simultáneamente.

**Completar** cierra el mantenimiento como Completado. **Cancelar** lo cierra como Cancelado. Ambas acciones requieren confirmación, liberan el activo y conservan el registro. La fecha de cierre no puede ser anterior a la fecha registrada de mantenimiento. No hay eliminación silenciosa de registros de mantenimiento que deje activos ocupados.

## 6. Revisar movimientos e informes

En **Movimientos**, revisa alta, edición, asignación, devolución, mantenimiento, cierre y baja. Se muestran fecha/hora, activo, detalle y nombre configurado. El historial local no es una bitácora inmutable de auditoría: quien controle el navegador puede modificar o borrar su almacenamiento.

En **Reportes**, el rango de fechas filtra la **fecha de ingreso del activo**, no la fecha de asignación o movimiento. Combina el rango con área y estado. La fecha inicial no puede superar la final. Los indicadores y las tablas corresponden al mismo conjunto filtrado.

Pulsa **Exportar CSV** para obtener el archivo con los registros filtrados. Se preservan comillas y valores cero, se agrega marca UTF-8 y se neutralizan prefijos que podrían interpretarse como fórmulas. Estas verificaciones no sustituyen una revisión de seguridad en todas las hojas de cálculo existentes.

## 7. Preferencias y respaldo

En **Configuración**, modifica el nombre mostrado en la sesión de demostración. **Notificaciones** activa o desactiva avisos visuales de operaciones exitosas; no envía correos, SMS ni mensajes de Teams. Los errores siguen mostrándose.

**Exportar respaldo JSON** guarda inventario, relaciones, movimientos y preferencias. **Importar respaldo** valida versión, identificadores, campos y relaciones antes de pedir confirmación. Importar reemplaza los datos locales, no los combina. Exporta una copia de lo actual antes de confirmar.

Si los datos locales están corruptos, la aplicación muestra una advertencia, bloquea la escritura normal y permite descargar el contenido para recuperación. Puedes importar un respaldo válido o reiniciar con confirmación. **Reiniciar datos locales** elimina solamente la clave de esta versión. No borra las fuentes originales ni modifica MySQL.

## 8. Vista móvil y solución de incidencias

En pantallas pequeñas utiliza el botón **Menú**. Las tablas anchas permiten desplazamiento horizontal dentro de su panel; no necesitas desplazar toda la página. Los formularios se muestran en una columna.

Si no aparecen datos anteriores, comprueba el mismo equipo, navegador, dirección y puerto. Si el navegador impide almacenar datos o informa cuota agotada, no se confirma la operación: conserva el aviso y recupera un respaldo. Si otra pestaña modificó la información, recarga antes de guardar para evitar reemplazar cambios ajenos.

Las pruebas de interfaz incluidas usan Chromium con Storage simulado. La comprobación del navegador real, el reinicio completo y los teléfonos físicos están registrados como pendientes en la documentación de despliegue.
