import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // ถ้าต้องการเข้าจาก LAN / ngrok
    port: 3000, // port ของคุณ
    strictPort: true,
    allowedHosts: ['2fb411a9646e.ngrok-free.app']
  }
})
