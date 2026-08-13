// Kill switch: this project no longer registers a service worker anywhere
// in its source, but any browser that registered an earlier version of
// this file keeps it active indefinitely — a normal "clear browser cache"
// action does NOT unregister an active service worker or clear its Cache
// Storage in most browsers. That stale SW was intercepting every GET
// request (including /api/ticker) with a network-first-then-cache-fallback
// strategy, serving old cached responses under conditions a regular user
// can't diagnose or fix themselves.
//
// This version immediately deletes every cache this origin's service
// worker ever created and unregisters itself, so the browser falls back
// to normal (uncached-by-SW) networking on the very next load.
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));
      await self.registration.unregister();
      const clientsList = await self.clients.matchAll({ type: "window" });
      for (const client of clientsList) {
        client.navigate(client.url);
      }
    })(),
  );
});
