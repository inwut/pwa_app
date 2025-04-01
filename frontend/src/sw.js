import {
  cleanupOutdatedCaches,
  matchPrecache,
  precacheAndRoute,
} from "workbox-precaching";
import { clientsClaim } from "workbox-core";
import { registerRoute } from "workbox-routing";
import { googleFontsCache } from "workbox-recipes";

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);
googleFontsCache();

self.skipWaiting();
clientsClaim();

registerRoute(
  ({ request }) => request.mode === "navigate",
  async () => {
    return await matchPrecache("/index.html");
  },
);
