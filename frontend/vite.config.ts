import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, mkdirSync } from 'fs'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-data-files',
      buildStart() {
        // Copy data files to public directory during development
        const dataDir = resolve(__dirname, '../data')
        const publicDataDir = resolve(__dirname, 'public/data')
        
        try {
          mkdirSync(`${publicDataDir}/summary`, { recursive: true })
          mkdirSync(`${publicDataDir}/prices`, { recursive: true })
        } catch (e) {
          // Directory already exists
        }
      }
    }
  ],
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
