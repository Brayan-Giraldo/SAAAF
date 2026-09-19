import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const port = 3197;
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'saaaf-auth-test-'));
const dataFile = path.join(tempDir, 'usuarios.json');
const child = spawn(process.execPath, ['src/server.js'], {
  cwd: path.resolve('.'),
  env: { ...process.env, PORT: String(port), DATA_FILE: dataFile },
  stdio: ['ignore', 'pipe', 'pipe']
});

function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }
async function request(method, route, body) {
  const response = await fetch(`http://localhost:${port}${route}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined
  });
  const json = await response.json();
  return { status: response.status, json };
}

const results = [];
function check(name, condition, detail = '') {
  results.push({ name, pass: Boolean(condition), detail });
}

try {
  await sleep(250);
  let r = await request('GET', '/api/health');
  check('Health responde 200', r.status === 200, String(r.status));

  r = await request('POST', '/api/auth/register', { usuario: 'bgiraldo', contrasena: 'Saaaf2026!' });
  check('Registro correcto responde 201', r.status === 201, JSON.stringify(r.json));
  check('Registro confirma usuario', r.json?.usuario?.usuario === 'bgiraldo', JSON.stringify(r.json));

  r = await request('POST', '/api/auth/register', { usuario: 'bgiraldo', contrasena: 'Saaaf2026!' });
  check('Usuario duplicado responde 409', r.status === 409, JSON.stringify(r.json));

  r = await request('POST', '/api/auth/login', { usuario: 'bgiraldo', contrasena: 'Saaaf2026!' });
  check('Login correcto responde 200', r.status === 200, JSON.stringify(r.json));
  check('Login devuelve mensaje satisfactorio', r.json?.message === 'Autenticacion satisfactoria', JSON.stringify(r.json));

  r = await request('POST', '/api/auth/login', { usuario: 'bgiraldo', contrasena: 'ClaveIncorrecta' });
  check('Contrasena incorrecta responde 401', r.status === 401, JSON.stringify(r.json));
  check('Error de autenticacion informado', r.json?.error === 'Error en la autenticacion', JSON.stringify(r.json));

  r = await request('POST', '/api/auth/login', { usuario: 'noexiste', contrasena: 'ClaveSegura123' });
  check('Usuario inexistente responde 401', r.status === 401, JSON.stringify(r.json));

  r = await request('POST', '/api/auth/register', { usuario: 'abc', contrasena: '123' });
  check('Validacion de datos responde 400', r.status === 400, JSON.stringify(r.json));
} finally {
  child.kill();
}

const passed = results.filter((r) => r.pass).length;
for (const r of results) console.log(`${r.pass ? 'PASS' : 'FAIL'} - ${r.name}${r.detail ? ` | ${r.detail}` : ''}`);
console.log(`\nResultado: ${passed}/${results.length} pruebas aprobadas.`);
if (passed !== results.length) process.exitCode = 1;
