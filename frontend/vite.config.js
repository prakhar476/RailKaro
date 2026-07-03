import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        // Log proxy errors to the terminal so they are easy to spot
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.error('\n[Vite Proxy Error] Could not reach backend at http://localhost:5000');
            console.error('Make sure the backend server is running: cd backend && npm run dev\n');
          });
        },
      },
    },
  },
});
