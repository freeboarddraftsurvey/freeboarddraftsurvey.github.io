// Freeboard service worker: keeps the app working offline.
// Change VERSION whenever app.html is updated so phones pick up the new version.
const VERSION = "freeboard-1.0.17";
const CORE = ["/app.html", "/manifest.webmanifest", "/icon-192.png", "/icon-512.png", "/maskable-512.png"];
const EXTRA_HOSTS = ["cdn.sheetjs.com", "fonts.googleapis.com", "fonts.gstatic.com"];
const XLSX_URL = "https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js"; // Excel reader + fonts, cached after first use

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then(async (c) => {
    await c.addAll(CORE);
    try { const r = await fetch(XLSX_URL, { mode: "no-cors" }); await c.put(XLSX_URL, r); } catch (_) { /* fetched later, on first import */ }
  }).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
