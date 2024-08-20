import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { compression } from 'vite-plugin-compression2'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
      react(),
      compression({
        algorithm: "brotliCompress"
      })
  ],
  define: {
    VITE_BUILD_DATE: JSON.stringify(new Date().toLocaleString()),
  },
})
