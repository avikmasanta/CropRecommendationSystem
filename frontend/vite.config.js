import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/predict': 'http://127.0.0.1:5000',
      '/explain': 'http://127.0.0.1:5000',
      '/tts': 'http://127.0.0.1:5000',
      '/models': 'http://127.0.0.1:5000',
      '/api': 'http://127.0.0.1:5000',
    }
  },
  build: {
    outDir: '../frontend_dist',
    emptyOutDir: true
  }
})
