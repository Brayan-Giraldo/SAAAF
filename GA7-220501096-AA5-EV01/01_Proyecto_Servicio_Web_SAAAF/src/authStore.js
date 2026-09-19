import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

/**
 * Capa de persistencia y autenticacion del servicio SAAAF.
 * Las contrasenas nunca se almacenan en texto plano: se usa scrypt con salt aleatorio.
 */
export class AuthStore {
  constructor(filePath) {
    this.filePath = filePath;
    this.ensureFile();
  }

  ensureFile() {
    const dir = path.dirname(this.filePath);
    fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(this.filePath)) fs.writeFileSync(this.filePath, '[]', 'utf8');
  }

  readUsers() {
    try {
      return JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
    } catch {
      return [];
    }
  }

  writeUsers(users) {
    fs.writeFileSync(this.filePath, JSON.stringify(users, null, 2), 'utf8');
  }

  normalizeUsername(value) {
    return String(value || '').trim().toLowerCase();
  }

  validateCredentials(usuario, contrasena) {
    const user = this.normalizeUsername(usuario);
    const password = String(contrasena || '');
    if (!user || !password) return 'Usuario y contrasena son obligatorios';
    if (user.length < 4 || user.length > 40) return 'El usuario debe tener entre 4 y 40 caracteres';
    if (!/^[a-z0-9._-]+$/.test(user)) return 'El usuario contiene caracteres no permitidos';
    if (password.length < 8 || password.length > 72) return 'La contrasena debe tener entre 8 y 72 caracteres';
    return null;
  }

  hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    return { salt, hash };
  }

  verifyPassword(password, salt, storedHash) {
    const calculated = crypto.scryptSync(password, salt, 64);
    const expected = Buffer.from(storedHash, 'hex');
    return calculated.length === expected.length && crypto.timingSafeEqual(calculated, expected);
  }

  register(usuario, contrasena) {
    const error = this.validateCredentials(usuario, contrasena);
    if (error) return { status: 400, error };

    const username = this.normalizeUsername(usuario);
    const users = this.readUsers();
    if (users.some((u) => u.usuario === username)) {
      return { status: 409, error: 'El usuario ya se encuentra registrado' };
    }

    const { salt, hash } = this.hashPassword(String(contrasena));
    const record = {
      id: users.reduce((max, u) => Math.max(max, Number(u.id) || 0), 0) + 1,
      usuario: username,
      salt,
      passwordHash: hash,
      creadoEn: new Date().toISOString()
    };
    users.push(record);
    this.writeUsers(users);
    return {
      status: 201,
      data: {
        message: 'Usuario registrado correctamente',
        usuario: { id: record.id, usuario: record.usuario, creadoEn: record.creadoEn }
      }
    };
  }

  login(usuario, contrasena) {
    const error = this.validateCredentials(usuario, contrasena);
    if (error) return { status: 400, error };

    const username = this.normalizeUsername(usuario);
    const user = this.readUsers().find((u) => u.usuario === username);
    if (!user || !this.verifyPassword(String(contrasena), user.salt, user.passwordHash)) {
      return { status: 401, error: 'Error en la autenticacion' };
    }

    return {
      status: 200,
      data: {
        message: 'Autenticacion satisfactoria',
        usuario: { id: user.id, usuario: user.usuario }
      }
    };
  }
}
