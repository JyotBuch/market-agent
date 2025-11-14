import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/market-agent/' : '/',  // Use root for dev, /market-agent/ for production
  build: {
    outDir: 'dist',
  },
  server: {
    fs: {
      // Allow serving files from parent directory
      allow: ['..']
    }
  }
})
