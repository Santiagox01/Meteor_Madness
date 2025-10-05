import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client'),
    },
  },
  server: {
    port: 3999,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})