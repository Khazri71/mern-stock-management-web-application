import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { viteStaticCopy } from 'vite-plugin-static-copy'
// npm install vite-plugin-static-copy --save-dev



// https://vite.dev/config/
export default defineConfig({
  plugins: [react() , tailwindcss(),


     viteStaticCopy({
      targets: [
        {
          src: 'public/_redirects', // chemin du fichier source
          dest: ''                  // destination : racine de dist
        }
      ]
    })



  ],
  server : {port : 3000},


  
})
