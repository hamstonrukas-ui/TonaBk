import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/icon-192.png", "icons/icon-512.png"],
      manifest: {
        name: "TonaBk",
        short_name: "TonaBk",
        description: "Trouvez votre maison en confiance",
        theme_color: "#D88A9A",
        background_color: "#F4F1EB",
        display: "standalone",
        start_url: "/",
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
        ],
      },
      workbox: {
        // Cache les pages et images déjà vues pour un usage hors-ligne
        // ou avec une connexion instable.
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "tonabk-images",
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith("/rest/v1"),
            handler: "NetworkFirst",
            options: { cacheName: "tonabk-api" },
          },
        ],
      },
    }),
  ],
});
