import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { AuthStore } from './authStore.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const publicDir = path.join(projectRoot, 'public');
const dataFile = process.env.DATA_FILE || path.join(projectRoot, 'data', 'usuarios.json');
const PORT = Number(process.env.PORT || 3001);
const store = new AuthStore(dataFile);

function sendJson(res, status, body) {
  const data = JSON.stringify(body, null, 2);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(data),
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(data);
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    return null;
  }
}

function serveStatic(res, pathname) {
  const routes = {
    '/': ['index.html', 'text/html; charset=utf-8'],
    '/app.js': ['app.js', 'text/javascript; charset=utf-8'],
    '/styles.css': ['styles.css', 'text/css; charset=utf-8']
  };
  const entry = routes[pathname];
  if (!entry) return false;
  const [name, type] = entry;
  const body = fs.readFileSync(path.join(publicDir, name));
  res.writeHead(200, { 'Content-Type': type, 'Content-Length': body.length });
  res.end(body);
  return true;
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return sendJson(res, 204, {});
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  if (req.method === 'GET' && url.pathname === '/api/health') {
    return sendJson(res, 200, { service: 'SAAAF Auth API', status: 'ok', version: '1.0.0' });
  }

  // Servicio de registro solicitado por la evidencia.
  if (req.method === 'POST' && url.pathname === '/api/auth/register') {
    const body = await readJson(req);
    if (body === null) return sendJson(res, 400, { error: 'JSON invalido' });
    const result = store.register(body.usuario, body.contrasena);
    return sendJson(res, result.status, result.data || { error: result.error });
  }

  // Servicio de inicio de sesion solicitado por la evidencia.
  if (req.method === 'POST' && url.pathname === '/api/auth/login') {
    const body = await readJson(req);
    if (body === null) return sendJson(res, 400, { error: 'JSON invalido' });
    const result = store.login(body.usuario, body.contrasena);
    return sendJson(res, result.status, result.data || { error: result.error });
  }

  if (req.method === 'GET' && serveStatic(res, url.pathname)) return;
  return sendJson(res, 404, { error: 'Endpoint no encontrado' });
});

server.listen(PORT, () => {
  console.log(`SAAAF Auth API disponible en http://localhost:${PORT}`);
  console.log(`Interfaz de demostracion: http://localhost:${PORT}/`);
});
