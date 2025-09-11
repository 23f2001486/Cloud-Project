import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5000'
    }
  },
  build: {
    rollupOptions: {
      input: './index.html'
    }
  },
  // 👇 Add this section
  preview: {
    port: 4173,
  },
  // 👇 This makes React Router work properly
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
