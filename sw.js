
const CACHE_NAME = "nazrul-mess-v3"; // bump this string any time you want to force a cleanup

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

// Network-only. No caching, no offline fallback.
self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});
