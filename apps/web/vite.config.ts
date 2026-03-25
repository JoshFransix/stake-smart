import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  root: __dirname,
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    outDir: '../../dist/apps/web',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@stake-smart/ui': resolve(__dirname, '../../libs/ui/src'),
      '@stake-smart/betting': resolve(__dirname, '../../libs/betting/src'),
      '@stake-smart/hooks': resolve(__dirname, '../../libs/hooks/src'),
      '@stake-smart/types': resolve(__dirname, '../../libs/types/src'),
      '@stake-smart/api': resolve(__dirname, '../../libs/api/src'),
    },
  },
});
