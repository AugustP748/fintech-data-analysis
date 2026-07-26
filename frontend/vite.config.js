import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [
//     react(),
//     tailwindcss(),
//   ],
// })

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Reemplaza 'nombre-de-tu-repositorio' por el nombre exacto de tu repo en GitHub
  base: '/fintech-data-analysis/', 
  build: {
    outDir: '../docs',       // Compila en la carpeta 'docs' en la raíz del proyecto
    emptyOutDir: true,       // Limpia la carpeta docs antes de compilar
  }
})