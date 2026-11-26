/* BT TOEIC — Lightweight Service Worker for PWA install & fast asset caching */
const CACHE_NAME = "bt-toeic-shell-v1";
const SHELL_ASSETS = [
  "./login.html",
  "./index.html",
  "./manifest.json",
  "./css/tokens.css",
  "./css/layout.css",
  "./css/components.css",
  "./js/auth.js",
  "./js/common.js",
  "./js/data.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  /* Cache-first for compressed WebP images & icons */
  if (url.pathname.includes("/assets/")) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((resp) => {
          if (resp && resp.status === 200) {
            const clone = resp.clone();
            caches.open(CACHE_NAME).then((c) => c.put(event.request, clone));
          }
          return resp;
        });
      })
    );
    return;
  }

  /* Network-first for HTML / JS / CSS so updates appear immediately */
  event.respondWith(
    fetch(event.request)
      .then((resp) => {
        if (resp && resp.status === 200) {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then((c) => c.put(event.request, clone));
        }
        return resp;
      })
      .catch(() => caches.match(event.request))
  );
});
