// Claw Paper Scissors service worker. Scoped to /claw-paper-scissors/ only.
const CACHE = 'claw-paper-scissors-v2';
const SHELL = ['./', 'index.html', 'game.js', 'manifest.webmanifest',
  'fonts/press-start-2p-latin-400-normal.woff2', 'fonts/vt323-latin-400-normal.woff2',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  // Only clear this game's old caches; the site root has its own app.
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('claw-paper-scissors-') && k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  // Pages and the game script: network first so updates land, cache when offline.
  if (req.mode === 'navigate' || req.url.endsWith('game.js')) {
    e.respondWith(fetch(req).then(r => {
      if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req.mode === 'navigate' ? 'index.html' : req, copy)); }
      return r;
    }).catch(() => caches.match(req.mode === 'navigate' ? 'index.html' : req)));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req)));
});
