# SAAAF Web Servlets - versión revisada 1.1.0

Base: proyecto **GA7-220501096-AA2-EV02** recibido en el ZIP. Esta derivación se documenta como soporte de la evidencia **AA3-EV02**. Implementa exclusivamente CRUD de activos y Dashboard con Java, Servlets, JSP, JDBC y esquema MySQL. No está integrada con `02_Aplicacion_Web`.

## Cambios

Validación en servidor; identificadores y fechas controlados; códigos normalizados; errores 400/403/404/405/409/500; eliminación mediante POST; token CSRF por sesión; escape de datos en JSP; selección del estado al editar; credenciales mediante configuración externa; SQL de inicialización no destructivo. Se conservan los nombres de paquetes y la estructura del material.

## Estado de verificación

Se compiló el código Java con `javac --release 11` usando JDK 21.0.11 y Servlet API 4.0. Se ejecutaron 38 pruebas. El DAO se comprobó con JDBC real y HSQLDB 1.8 disponible en el entorno, **solo como motor de pruebas aislado**. Los controladores se probaron con dobles de request/response y dispatcher; no se ejecutaron JSP. No se ejecutaron `mvn package`, Tomcat ni MySQL y no se distribuye un WAR supuestamente validado.

## Preparar el despliegue en tu equipo

1. Usa un entorno de desarrollo aislado con JDK compatible con objetivo Java 11, Maven, Tomcat 9 y MySQL. Tomcat 9 conserva el espacio de nombres `javax.servlet` del material.
2. Ejecuta `database/saaaf_web.sql` con una cuenta autorizada para crear una base de pruebas. No elimina una tabla existente. El archivo `datos_demo.sql` es opcional y sus códigos deben estar libres antes de ejecutarlo.
3. Crea/configura una cuenta de aplicación con acceso solo a la base de pruebas y permisos necesarios sobre `activos`. No uses una cuenta administrativa compartida.
4. Configura antes de iniciar Tomcat: `SAAAF_DB_URL`, `SAAAF_DB_USER`, `SAAAF_DB_PASSWORD`. Opcional: `SAAAF_DB_DRIVER`, cuyo valor por defecto es `com.mysql.cj.jdbc.Driver`. También se aceptan propiedades JVM `saaaf.db.url`, `saaaf.db.user`, `saaaf.db.password`, `saaaf.db.driver`.
5. Ejecuta `mvn clean package`; revisa su resultado. Las versiones del pom proceden de la base recibida y no se presentan como una selección actualizada para producción.
6. Copia `target/saaaf-web.war` a la carpeta `webapps` de Tomcat 9 e inicia el servidor.
7. Abre `http://localhost:8080/saaaf-web/`, luego `/activos` y `/dashboard`.
8. Ejecuta la lista pendiente de despliegue, incluyendo el formulario HTML `/registro-activo.html` y las vistas JSP. Conserva capturas y logs reales.

No hay autenticación de usuarios ni autorización multirol en este módulo. No lo publiques en una red abierta. CSRF, validación y escape no lo convierten en un sistema listo para producción.

## Repetir las pruebas ejecutadas

```text
python tests/ejecutar_java.py --servlet-api RUTA_AL_SERVLET_API_JAR --jdbc-test RUTA_AL_HSQLDB_JAR
```

El script compila en una carpeta temporal y ejecuta `src/test/java/co/sena/saaaf/tests/PruebasJava.java`. No requiere JUnit. Los JAR de terceros no se redistribuyen. En Linux con los mismos paquetes del entorno, el script detecta las rutas predeterminadas documentadas en su código.

## Rutas del controlador

GET `/activos`: listar. GET `/activos?accion=nuevo`: formulario. GET `/activos?accion=editar&id=ID`: editar. GET con `accion=eliminar` devuelve 405 y no modifica datos. POST `/activos`: acciones `guardar`, `actualizar`, `eliminar` con token `csrf`. GET `/token`: token para el formulario HTML del mismo origen. GET `/dashboard`: indicadores.
