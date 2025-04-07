import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  matchPrecache,
  precacheAndRoute,
} from "workbox-precaching";
import { clientsClaim } from "workbox-core";
import { NavigationRoute, registerRoute } from "workbox-routing";
import { googleFontsCache } from "workbox-recipes";
import { CacheFirst } from "workbox-strategies";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { ExpirationPlugin } from "workbox-expiration";

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);
googleFontsCache();

self.skipWaiting();
clientsClaim();

registerRoute(new NavigationRoute(createHandlerBoundToURL("/index.html")));

registerRoute(
  ({ request }) =>
    request.destination === "image" && request.url.includes("/uploads/"),
  new CacheFirst({
    cacheName: "uploads",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 7 * 24 * 60 * 60,
      }),
      {
        handlerDidError: async () => {
          return await matchPrecache("/assets/defaultRecipeImage-CwSf_7Rf.jpg");
        },
      },
    ],
  }),
);
