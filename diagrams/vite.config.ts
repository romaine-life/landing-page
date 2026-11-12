import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/diagrams/',
  plugins: [react()],
  server: {
    port: 5505,
  },
})
