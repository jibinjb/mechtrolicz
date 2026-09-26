import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: [
      'firebase/app',
      'firebase/auth',
      'firebase/firestore',
      'firebase/analytics',
    ],
  },
})
