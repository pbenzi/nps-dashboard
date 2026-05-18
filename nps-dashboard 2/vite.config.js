import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    // Expõe variáveis de ambiente VITE_ para o código
    'process.env': {}
  }
})
