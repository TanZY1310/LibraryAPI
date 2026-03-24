import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // During dev, proxy /library calls to Spring Boot so no CORS needed
      '/library': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
})