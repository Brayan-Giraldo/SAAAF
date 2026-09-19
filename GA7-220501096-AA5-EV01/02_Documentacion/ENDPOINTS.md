# Endpoints - SAAAF Auth API

Base URL local: `http://localhost:3001`

| Metodo | Endpoint | Uso | Respuestas principales |
|---|---|---|---|
| GET | `/api/health` | Verificar disponibilidad | 200 |
| POST | `/api/auth/register` | Registrar usuario | 201, 400, 409 |
| POST | `/api/auth/login` | Iniciar sesion | 200, 400, 401 |

## Registro

`POST /api/auth/register`

```json
{ "usuario": "bgiraldo", "contrasena": "Saaaf2026!" }
```

## Login

`POST /api/auth/login`

```json
{ "usuario": "bgiraldo", "contrasena": "Saaaf2026!" }
```

- Autenticacion correcta: HTTP 200 + `Autenticacion satisfactoria`.
- Usuario o contrasena incorrectos: HTTP 401 + `Error en la autenticacion`.
