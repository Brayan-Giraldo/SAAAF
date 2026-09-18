# Demostración web SAAAF

Versión derivada de `saaaf-html-code.html`. Conserva los módulos Dashboard, Activos, Asignaciones, Mantenimiento, Movimientos, Reportes y Configuración.

## Inicio

1. Ejecuta `python iniciar.py` o `iniciar_windows.bat` con Python instalado.
2. Abre `http://127.0.0.1:8765/index.html`.
3. Ingresa con `demo` / `DemoSaaaf2026!`.
4. Usa datos ficticios. Finaliza el servidor con Ctrl+C.

Como alternativa existe `SAAAF_Demostracion.html`, que contiene el mismo CSS y JavaScript. El comportamiento de localStorage con archivos `file:` depende del navegador; para conservar un origen estable, usa el servidor local y exporta respaldos. No se han probado ni publicado servicios de Internet.

## Estructura y persistencia

`js/core.js` contiene validaciones, transacciones y reglas de estado. `js/ui.js` conecta formularios, tablas, descargas y navegación. `css/estilos.css` conserva el estilo oscuro/naranja y agrega ajustes responsivos. `index.html` es la interfaz. La clave `saaaf_evidencia_v2` guarda un snapshot versionado. Las antiguas claves `saaaf_activos`, `saaaf_asigns`, `saaaf_mants` y `saaaf_movs` no se migran ni se borran automáticamente.

## Pruebas reproducibles

Dominio, sin dependencias externas:

```text
node --test tests/core.test.js
```

Interfaz: requiere Python y Playwright con un Chromium disponible. En un equipo donde se permita HTTP local:

```text
python tests/browser_test.py --mode http
```

El modo ejecutado durante la preparación fue:

```text
python tests/browser_test.py --mode dom
python tests/baseline_original.py
```

En modo DOM se usa un doble de Storage en memoria y HTML/CSS/JS reales. No se incorporan dobles a la aplicación entregada. La ruta del navegador puede indicarse mediante `CHROMIUM_PATH`. Los resultados se escriben en `../04_Pruebas` y contienen el modo exacto de ejecución.

La versión portable se regenera con `python generar_portable.py`. La prueba del servidor HTTP local en otro entorno requiere actualizar la evidencia con los resultados obtenidos allí.
