import { defineConfig } from 'vite'

export default defineConfig({
  base: '/string-box/',
  // three.js is one chunk by design
  build: { chunkSizeWarningLimit: 800 },
})
