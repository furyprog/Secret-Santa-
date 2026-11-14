const VERSION = "1.1.28"; // à changer à chaque publication, en même temps que APP_VERSION dans index.html
const C = "secret-santa-v" + VERSION;
const FILES = ["./", "index.html", "manifest.json", "icon-192.png", "icon-512.png", "help.svg"];
self.addEventListener("install", e => { e.waitUntil(caches.open(C).then(c => c.addAll(FILES.map(f => new Request(f, {cache: "reload"}))))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  if(e.request.method !== "GET") return;
  if(new URL(e.request.url).hostname.endsWith("workers.dev")) return; // serveur de suivi : jamais de cache
  e.respondWith(fetch(e.request, {cache: "no-cache"}).then(r => { const copy = r.clone(); if(r.ok) caches.open(C).then(c => c.put(e.request, copy)); return r; })
    .catch(() => caches.match(e.request, {ignoreSearch: true}).then(r => r || caches.match("index.html"))));
});
