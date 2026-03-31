import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 假設你的 GitHub 儲存庫名稱是 chess-academy
export default defineConfig({
  plugins: [react()],
  base: '/chessAPP/', 
})