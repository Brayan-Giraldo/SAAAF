import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuración mínima de Vite para el módulo front-end de SAAAF.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
  },
});
