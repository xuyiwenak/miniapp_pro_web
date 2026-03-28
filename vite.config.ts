import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendPort = env.VITE_BACKEND_PORT || '40002'
  const backendUrl = `http://localhost:${backendPort}`

  return {
    plugins: [react()],
    base: '/app',
    server: {
      proxy: {
        '/admin': backendUrl,
        '/login': backendUrl,
        '/home': backendUrl,
        '/api': backendUrl,
        '/work': backendUrl,
        '/oss': backendUrl,
      },
    },
  }
})
