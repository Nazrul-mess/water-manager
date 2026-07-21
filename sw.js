// Service worker for Nazrul Mess Water Management PWA
// A fetch handler + registered SW is required by Chrome/Android for the
// "Add to Home Screen" / install prompt to appear.
//
// IMPORTANT: bump CACHE_NAME (e.g. v2 -> v3) every time you deploy an
// update. This forces old caches to be deleted (see "activate" below)
// so phones/installed apps can't keep serving stale files forever.

const CACHE_NAME = "nazrul-mess-v2";
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

// Fetch strategy:
// - Navigations (index.html/main.html) and all JS/CSS: NETWORK-FIRST.
//   This matters most for config.js and any app code — you always get
//   the latest deployed version when online, and only fall back to the
//   cache if the network request fails (offline).
// - Images: CACHE-FIRST, since a logo rarely changes and it saves data.
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Only handle GET requests, and skip cross-origin requests (Firebase,
  // Google Sheets webhook, gstatic CDN) so they always go straight to
  // the network and are never cached here.
  if (req.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  const isImage = /\.(png|jpg|jpeg|svg|webp|gif|ico)$/i.test(url.pathname);

  if (isImage) {
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
    return;
  }

  // Network-first for everything else (html, css, js, json)
  event.respondWith(
    fetch(req)
      .then((res) => {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
        return res;
      })
      .catch(() => caches.match(req).then((r) => r || caches.match("./main.html")))
  );
});

