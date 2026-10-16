// Naikkan CACHE_NAME setiap kali index.html diperbarui
const CACHE_NAME = "essenroll-cache-v8";
const ASSETS_TO_CACHE = [
  "./", "./index.html", "./manifest.json", "./xlsx.full.min.js",
  "./icons/icon-192.png", "./icons/icon-512.png", "./icons/icon-96.png",
  "./icons/logo.png", "./icons/apple-touch-icon.png", "./icons/favicon-32.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS_TO_CACHE)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  if (new URL(event.request.url).origin !== location.origin) return; // Firebase & CDN diurus browser
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const net = fetch(event.request).then((res) => {
        if (res && res.status === 200) { const cp = res.clone(); caches.open(CACHE_NAME).then((c) => c.put(event.request, cp)); }
        return res;
      }).catch(() => cached);
      return cached || net;
    })
  );
});
