import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/lib/index.jsx'),
      name: 'diy-pwa',
      fileName: (format) => `diy-pwa.${format}.js`
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        manualChunks: undefined,
        globals: {
          react: 'React'
        }
      }
    }
  },
  plugins: [cssInjectedByJsPlugin(), svgr(), react()]
})