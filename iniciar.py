"""Servidor local de demostracion. Solo escucha en 127.0.0.1."""
from pathlib import Path
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from functools import partial
import argparse, webbrowser
parser=argparse.ArgumentParser(description="Iniciar SAAAF en este equipo")
parser.add_argument('--puerto',type=int,default=8765)
parser.add_argument('--sin-abrir',action='store_true')
args=parser.parse_args()
root=Path(__file__).resolve().parent
class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control','no-store')
        super().end_headers()
try:
    server=ThreadingHTTPServer(('127.0.0.1',args.puerto),partial(Handler,directory=str(root)))
except OSError as exc:
    parser.exit(1,'No fue posible abrir el puerto. Prueba --puerto 8766. Detalle: '+str(exc)+'\n')
url=f'http://127.0.0.1:{args.puerto}/index.html'
print('SAAAF: '+url+'\nCierra con Ctrl+C. Usa solo datos de demostracion.')
if not args.sin_abrir:webbrowser.open(url)
try:server.serve_forever()
except KeyboardInterrupt:pass
finally:server.server_close()
