import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/app',
  server: {
    proxy: {
      '/admin': 'http://localhost:40002',
      '/login': 'http://localhost:40002',
      '/home': 'http://localhost:40002',
      '/api': 'http://localhost:40002',
    },
  },
})
