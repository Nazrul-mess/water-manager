// Service worker for Nazrul Mess Water Management PWA
// A fetch handler + registered SW is required by Chrome/Android for the
// "Add to Home Screen" / install prompt to appear.

const CACHE_NAME = "nazrul-mess-v1";
const APP_SHELL = [
  "./index.html",
  "./main.html",
  "./style.css",
  "./manifest.json",
  "./logo.png"
];

// Install: pre-cache the app shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch: network-first for navigation (so live data / config still loads
// when online), falling back to cache when offline. Cache-first for
// static assets like css/images.
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Only handle GET requests, and skip cross-origin requests (Firebase,
  // Google Sheets webhook, gstatic CDN) so they always go straight to
  // the network and are never cached here.
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) {
    return;
  }

  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(() => caches.match(req).then((r) => r || caches.match("./main.html")))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      return (
        cached ||
        fetch(req).then((res) => {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          return res;
        })
      );
    })
  );
});
