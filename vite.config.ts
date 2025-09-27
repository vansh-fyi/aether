import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "components": path.resolve(__dirname, "./components"),
      "styles": path.resolve(__dirname, "./styles"),
      "store": path.resolve(__dirname, "./store"),
      "services": path.resolve(__dirname, "./services"),
      "utils": path.resolve(__dirname, "./utils"),
      "engine": path.resolve(__dirname, "./engine"),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    target: 'es2015'
  },
  server: {
    port: 3000,
    open: true
  }
})
