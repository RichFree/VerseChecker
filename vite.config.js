import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    VITE_BUILD_DATE: JSON.stringify(new Date().toLocaleString()),
  },
})
