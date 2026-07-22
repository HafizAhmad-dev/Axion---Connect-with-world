import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from "vite-plugin-pwa";
import flowbiteReact from "flowbite-react/plugin/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico"],
      manifest: {
        name: "Axion",
        short_name: "Axion",
        start_url: "/",
        display: "standalone",
        background_color: "#fff",
        theme_color: "#fff",
        icons: [
          {
            src: "/axion5.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    }),
    flowbiteReact(),
    
  ],
   server: {
    host: '0.0.0.0', // Allow access from network
    port: 5173,
  },
})