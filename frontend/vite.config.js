import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      strategies: "injectManifest",
      srcDir: "src",
      injectManifest: {
        swSrc: "src/sw.js",
        globPatterns: [
          "**/*.html",
          "**/*.js",
          "**/*.css",
          "**/*.ico",
          "**/*.png",
          "**/*.jpg",
        ],
      },
      manifest: {
        name: "Recipegram: Progressive Web App",
        short_name: "Recipegram",
        description:
          "A progressive web app for sharing your favorite recipes and discovering new ones.",
        theme_color: "#476730",
        background_color: "#f9faef",
        display: "standalone",
        start_url: "/",
        scope: "/",
        icons: [
          {
            src: "pwa-64x64.png",
            sizes: "64x64",
            type: "image/png",
          },
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
});
