import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react({
    jsxImportSource: 'react' // Ensure this is set
  }), tsconfigPaths()],
  base: '/',
  build: {
    sourcemap: true, // Helps with debugging
    outDir:'./dist'
  },
  publicDir:'public'
})