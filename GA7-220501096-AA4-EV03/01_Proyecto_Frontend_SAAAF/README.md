# SAAAF - Componente front-end

**Evidencia:** GA7-220501096-AA4-EV03  
**Aprendiz:** Brayan Giraldo García  
**Programa:** Análisis y Desarrollo de Software  

Este proyecto implementa el componente front-end de SAAAF (Sistema de Asignación de Actas de Activos Fijos) utilizando React y Vite. La interfaz se construye a partir de los prototipos, historias de usuario y componentes definidos en las evidencias anteriores.

## Módulos implementados

- Dashboard con indicadores de inventario.
- Inventario con búsqueda y registro de activos.
- Empleados con registro de colaboradores.
- Áreas con resumen de activos y empleados.
- Asignaciones de activos a colaboradores.
- Actas asociadas a las asignaciones.
- Registro de devolución con actualización automática del estado del activo.
- Navegación responsive para escritorio y móvil.
- Persistencia de demostración mediante `localStorage`.

## Ejecución

```bash
npm install
npm run dev
```

Luego abra `http://localhost:3001`.

## Construcción de producción

```bash
npm run build
npm run preview
```

## Estándares aplicados

- Componentes funcionales y Hooks de React.
- Separación por páginas, componentes, datos y utilidades.
- Nombres descriptivos para variables y funciones.
- Comentarios en puntos de entrada, persistencia y configuración.
- Formularios con etiquetas y validaciones HTML.
- Diseño responsive mediante media queries.
- Estado inmutable usando `setState` y funciones de actualización.
- Archivo `.gitignore` para evitar versionar dependencias y compilados.

## Repositorio

https://github.com/Brayan-Giraldo/SAAAF
