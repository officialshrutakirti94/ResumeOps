import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api': 'https://backendservice-wpxk.onrender.com',
      '/resume': 'https://backendservice-wpxk.onrender.com',
      '/compatibilityCheck': 'https://backendservice-wpxk.onrender.com',
      '/getresumes': 'https://backendservice-wpxk.onrender.com',
      '/getAnalysisHistory': 'https://backendservice-wpxk.onrender.com',
      '/analysisDelete': 'https://backendservice-wpxk.onrender.com',
      '/resumeDelete': 'https://backendservice-wpxk.onrender.com',
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
