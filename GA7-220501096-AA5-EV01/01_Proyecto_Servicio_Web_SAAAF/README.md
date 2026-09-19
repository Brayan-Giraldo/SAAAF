# SAAAF - Servicio web de registro e inicio de sesion

**Evidencia:** GA7-220501096-AA5-EV01  
**Aprendiz:** Brayan Giraldo Garcia  
**Programa:** Analisis y Desarrollo de Software

Este proyecto implementa el caso solicitado por SENA: un servicio web para registrar usuarios y validar un inicio de sesion mediante usuario y contrasena.

## Requisitos

- Node.js 18 o superior.
- No requiere librerias externas ni `npm install`.

## Ejecucion

En PowerShell, dentro de esta carpeta:

```powershell
npm.cmd start
```

Si PowerShell bloquea `npm.ps1`, puede ejecutarse directamente:

```powershell
node .\src\server.js
```

La aplicacion queda disponible en:

- Interfaz: `http://localhost:3001/`
- Health: `GET http://localhost:3001/api/health`
- Registro: `POST http://localhost:3001/api/auth/register`
- Login: `POST http://localhost:3001/api/auth/login`

## Ejemplo de registro

```json
{
  "usuario": "bgiraldo",
  "contrasena": "Saaaf2026!"
}
```

Respuesta esperada: HTTP 201 y mensaje `Usuario registrado correctamente`.

## Ejemplo de login correcto

Mismo cuerpo JSON. Respuesta esperada: HTTP 200 y mensaje `Autenticacion satisfactoria`.

## Login incorrecto

Si el usuario no existe o la contrasena no coincide, responde HTTP 401:

```json
{
  "error": "Error en la autenticacion"
}
```

## Validaciones

- Usuario y contrasena obligatorios.
- Usuario entre 4 y 40 caracteres.
- Usuario limitado a letras minusculas, numeros, punto, guion y guion bajo.
- Contrasena entre 8 y 72 caracteres.
- No permite usuarios duplicados.
- Las contrasenas se almacenan mediante `scrypt` y un `salt` aleatorio; no se guardan en texto plano.

## Pruebas

```powershell
npm.cmd test
```

El conjunto verifica registro, duplicados, login correcto, login fallido y validaciones.
