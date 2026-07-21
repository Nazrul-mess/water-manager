// Service worker for Nazrul Mess Water Management PWA
//
// This app is online-only by design. Everything (main.html, style.css,
// config.js, etc.) is always fetched fresh from the network — this
// service worker does NOT cache any of that, so you'll never see
// stale data.
//
// The ONE exception: a tiny "offline shell" (just the splash page,
// index.html, and the logo) is cached so that if there's genuinely no
// internet connection, the browser has something to fall back to and
// can show OUR "No Internet Connection" screen — instead of the
// browser's own generic "This site can't be reached" error page.
//
// Bump CACHE_NAME any time you edit the splash page and want the
// cached fallback shell refreshed.

const CACHE_NAME = "nazrul-mess-offline-shell-v2";
const OFFLINE_SHELL = ["./index.html", "./logo.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => (key !== CACHE_NAME ? caches.delete(key) : null)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Only ever touch same-origin GET requests. Everything else — the
  // Firebase SDK from gstatic.com, Firestore's realtime connection,
  // the Google Sheets webhook, etc. — must go straight to the network
  // completely untouched, or things like Firestore's live listener can
  // break and the app will appear to hang on a blank page.
  if (req.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  // Page navigations: always try the network first (so you get the
  // live app). Only fall back to the cached splash page if that fails,
  // e.g. no internet connection at all.
  if (req.mode === "navigate") {
    event.respondWith(fetch(req).catch(() => caches.match("./index.html")));
    return;
  }

  // Everything else (css/js/json/images): network-first, no caching of
  // the response. Only logo.png has a cached fallback, purely so the
  // offline splash screen still has its logo to show when offline.
  event.respondWith(fetch(req).catch(() => caches.match(req)));
});
