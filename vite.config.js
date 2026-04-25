import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/_api': {
        target: 'http://localhost:5237',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/_api/, ''),
      },
    },
  },
})
