import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.js",
      injectManifest: {
        swSrc: "src/sw.js",
        swDest: "./dist/sw.js",
        globDirectory: "./dist",
        globPatterns: [
          "**/*.html",
          "**/*.js",
          "**/*.css",
          "**/*.ico",
          "**/*.png",
          "**/*.jpg",
        ],
      },
      includeAssets: [
        "favicon.ico",
        "apple-touch-icon-180x180.png",
        "maskable-icon-512x512.png",
      ],
      manifest: {
        name: "Recipegram",
        short_name: "Recipegram",
        description:
          "A progressive web app for sharing your favorite recipes and discovering new ones.",
        theme_color: "#476730",
        background_color: "#f9faef",
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
        orientation: "any",
        display: "standalone",
        dir: "auto",
        start_url: "/",
        scope: "/",
      },
    }),
  ],
});
