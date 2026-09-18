# Diagnóstico y cambios

## HTML: defectos reproducidos con Chromium/DOM

| Hallazgo | Situación original | Cambio realizado | Verificación |
|---|---|---|---|
| OB-01 | doLogin oculta el formulario sin validar entradas | Verificación demostrativa y cierre de sesión; sin afirmar seguridad real | UI-01/02/30 |
| OB-02 | Se aceptan códigos repetidos | Código normalizado y único | UT-05, UI-05 |
| OB-03 | Se guardan valores negativos | Validación numérica y de rango | UT-08/09, UI-06 |
| OB-04 | Borrar asignación deja activo Asignado | Devolución con conservación de historial | UT-19/20, UI-11 |
| OB-05 | Borrar mantenimiento deja activo ocupado | Cierre Completado/Cancelado con liberación del activo | UT-30/31, UI-14/15 |
| OB-06 | Preferencias solo muestran un aviso | Persistencia en snapshot y recuperación | UT-39, UI-18 |
| OB-07 | Texto editable se inserta como HTML ejecutable | Escape de salida y validación de IDs de respaldo | UT-43, UI-26 |
| OB-08 | Barra de acciones queda fuera de pantalla móvil | Menú adaptable, formularios de una columna y paneles desplazables | UI-27/28 |

Resultados originales: `04_Pruebas/hallazgos_original.json`. Pruebas del código revisado: `04_Pruebas/resultados_interfaz.json` y TAP del dominio. El uso de Storage simulado limita la conclusión a la lógica y al DOM ejecutados.

## Java: hallazgos por inspección estática de la base

La eliminación se ejecutaba desde GET; ahora devuelve 405 y la modificación requiere POST con token. El servlet leía identificadores/fechas sin manejo explícito de entradas inválidas; ahora se responden errores controlados. Las expresiones JSP mostraban valores sin escape y el selector de estado no recuperaba la opción actual; se corrigieron ambos puntos. La conexión contenía root y clave vacía como constantes; se reemplazó por configuración externa. El esquema original eliminaba la tabla al iniciarse; la nueva inicialización conserva tablas existentes y separa ejemplos.

Estos hallazgos Java originales no se presentan como ejecuciones contra Tomcat. La verificación posterior ejecutada comprende compilación Java, validadores, DAO/HSQLDB y controladores con dobles. El renderizado JSP y el despliegue MySQL permanecen pendientes.

## Decisiones nuevas, no requisitos textuales del instrumento

Se agregaron límites de campos, validación de cédula ficticia de 5 a 15 dígitos, reglas cronológicas, baja lógica web, respaldo JSON versionado, rechazo de relaciones inconsistentes y validación de revisión entre pestañas. El mantenimiento web exige primero liberar un activo asignado. Son decisiones de implementación para resolver inconsistencias del material y se someten a revisión del alcance académico.

## Diferencias conservadas

AA2 del ZIP y AA3 del instrumento permanecen identificados. Disponible en Java no se renombra silenciosamente a Activo. Las bases no se sincronizan. No se agregan ni se declaran aplicaciones nativas, actas PDF, firma, SharePoint o correo corporativo. La interfaz web y el CRUD Java no constituyen por sí mismos tres modalidades certificadas.
