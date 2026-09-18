"""Genera el archivo unico sin introducir cambios en el codigo de la aplicacion."""
from pathlib import Path
root=Path(__file__).resolve().parent
html=(root/'index.html').read_text(encoding='utf-8')
html=html.replace('<link href="css/estilos.css" rel="stylesheet"/>','<style>'+(root/'css/estilos.css').read_text(encoding='utf-8')+'</style>')
for name in ['core','ui']:
    html=html.replace('<script defer="" src="js/'+name+'.js"></script>','<script>'+(root/'js'/f'{name}.js').read_text(encoding='utf-8')+'</script>')
(root/'SAAAF_Demostracion.html').write_text(html,encoding='utf-8')
print(root/'SAAAF_Demostracion.html')
