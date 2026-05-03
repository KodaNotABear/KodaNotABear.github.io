import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Custom domain on GitHub Pages means base path is '/' (not a subpath)
export default defineConfig({
  plugins: [react()],
  base: '/',
})
