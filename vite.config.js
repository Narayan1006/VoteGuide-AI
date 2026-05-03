import { defineConfig } from 'vite';
import react            from '@vitejs/plugin-react';
import path             from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks':      path.resolve(__dirname, './src/hooks'),
      '@services':   path.resolve(__dirname, './src/services'),
      '@pages':      path.resolve(__dirname, './src/pages'),
      '@data':       path.resolve(__dirname, './src/data'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('firebase')) return 'firebase';
          if (id.includes('@google/generative-ai')) return 'gemini';
          if (id.includes('@react-google-maps')) return 'maps';
          if (id.includes('framer-motion')) return 'motion';
        },
      },
    },
  },
});
