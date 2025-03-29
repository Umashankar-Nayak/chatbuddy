import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Bind to all network interfaces
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000, // Use Render's PORT or fallback
  },
  preview: {
    host: '0.0.0.0',
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    allowedHosts: ['chatbuddy-ffkj.onrender.com'], // Allow Render's domain
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
