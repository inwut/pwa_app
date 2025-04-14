import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  matchPrecache,
  precacheAndRoute,
} from "workbox-precaching";
import { clientsClaim } from "workbox-core";
import { NavigationRoute, registerRoute } from "workbox-routing";
import { googleFontsCache } from "workbox-recipes";
import { CacheFirst, NetworkOnly } from "workbox-strategies";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { ExpirationPlugin } from "workbox-expiration";
import { BackgroundSyncPlugin } from "workbox-background-sync";
import { addToDeferredQueue } from "./utils/deferredRequestManager.js";

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

const backgroundSyncPlugin = new BackgroundSyncPlugin("defaultQueue", {
  maxRetentionTime: 24 * 60,
  async onSync({ queue }) {
    let entry;
    while ((entry = await queue.shiftRequest())) {
      try {
        const response = await fetch(entry.request.clone());
        if (response.status === 401) {
          const cloned = entry.request.clone();
          const body = await cloned.clone().text();

          const headers = {};
          cloned.headers.forEach((value, key) => {
            headers[key] = value;
          });

          await addToDeferredQueue({
            url: cloned.url,
            method: cloned.method,
            headers,
            body,
          });
        }
      } catch (error) {
        console.error("Network error:", error);
        await queue.unshiftRequest(entry);
        break;
      }
    }
  },
});

registerRoute(
  ({ url, request }) =>
    url.pathname.match(/\/api\/(comments|recipes\/\d+\/like)/) &&
    request.method === "POST",
  new NetworkOnly({ plugins: [backgroundSyncPlugin] }),
  "POST",
);

registerRoute(
  ({ url, request }) =>
    url.pathname.match(/\/api\/(comments|recipes|recipes\/\d+\/like)/) &&
    request.method === "DELETE",
  new NetworkOnly({ plugins: [backgroundSyncPlugin] }),
  "DELETE",
);

self.addEventListener("push", (event) => {
  const data = event.data?.json();
  if (!data) return;

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      data: data.data || {},
      icon: data.icon || "/pwa-192x192.png",
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url
    ? new URL(event.notification.data.url, self.location.origin).href
    : self.location.origin;

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === targetUrl && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      }),
  );
});
