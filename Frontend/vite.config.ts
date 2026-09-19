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
      '/api': 'http://127.0.0.1:8080',
      '/resume': 'http://127.0.0.1:8080',
      '/compatibilityCheck': 'http://127.0.0.1:8080',
      '/getresumes': 'http://127.0.0.1:8080',
      '/getAnalysisHistory': 'http://127.0.0.1:8080',
      '/analysisDelete': 'http://127.0.0.1:8080',
      '/resumeDelete': 'http://127.0.0.1:8080',
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
