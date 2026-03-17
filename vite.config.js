import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/AIBE4_FinalProject_Team2_FE/',
  server: {
    proxy: {'/api/v1': 'http://localhost:8081/api/v1'},
  }
})
