import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'UNSIA Marketing System',
        short_name: 'UnsiaMark',
        description: 'Sistem Informasi Pemasaran Universitas Siber Asia',
        theme_color: '#002855',
        icons: [
          {
            src: 'https://unsia.ac.id/wp-content/uploads/2020/10/cropped-Logo-Unsia-Kecil-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'https://unsia.ac.id/wp-content/uploads/2020/10/cropped-Logo-Unsia-Kecil-192x192.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})