"""Compila y ejecuta validadores, DAO y controladores con dobles HTTP.
Requiere JDK 11+, Servlet API 4.0 y un driver HSQLDB de prueba.
Los JAR no se distribuyen en esta entrega. Usar un entorno aislado de pruebas.
"""
import argparse,os,shutil,subprocess,tempfile
from pathlib import Path
p=argparse.ArgumentParser()
p.add_argument('--servlet-api',default=os.environ.get('SERVLET_API_JAR','/usr/share/java/servlet-api.jar'))
p.add_argument('--jdbc-test',default=os.environ.get('JDBC_TEST_JAR','/usr/share/java/hsqldb1.8.0.jar'))
a=p.parse_args()
root=Path(__file__).resolve().parents[1]
for cmd in ['javac','java']:
    if not shutil.which(cmd):p.error('No se encontro '+cmd+'; configura el JDK en PATH.')
for path in [a.servlet_api,a.jdbc_test]:
    if not Path(path).is_file():p.error('JAR no encontrado: '+path+'; indica su ruta con los argumentos del script.')
with tempfile.TemporaryDirectory(prefix='saaaf-tests-') as tmp:
    sources=list((root/'src/main/java').rglob('*.java'))+list((root/'src/test/java').rglob('*.java'))
    classpath=os.pathsep.join([a.servlet_api,a.jdbc_test])
    subprocess.run(['javac','--release','11','-encoding','UTF-8','-cp',classpath,'-d',tmp]+[str(s) for s in sources],check=True)
    subprocess.run(['java','-cp',tmp+os.pathsep+classpath,'co.sena.saaaf.tests.PruebasJava'],check=True)
