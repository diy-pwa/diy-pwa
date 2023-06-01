import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  build: {
    outDir: "./dist",
    lib: {
      name: "diy-pwa",
      entry: [
        path.resolve(__dirname, 'src/lib/index.js'),
        path.resolve(__dirname, 'src/lib/components.js'),
      ],
      fileName: (format, entryName) => {
        return `js/${entryName}.${format}.js`;
      },
    },
  },
  plugins: [svgr(), react()]
})