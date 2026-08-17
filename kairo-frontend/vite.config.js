import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Kairo runs on its own domain, fully separate from QuikHire.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5180,
    host: true,
  },
})
