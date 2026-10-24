// Bench Academy service worker: precache the app shell and card art, cache Google Fonts at runtime.
const CACHE = 'bench-academy-v5';
const SHELL = ['./', 'index.html', 'app.js', 'net.js', 'vendor/qrcode.min.js', 'vendor/jsQR.min.js', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png'];
const ART = ['cindlet','pyrrox','magmaw','puffkin','budling','thornoak','ripplet','stag','potion','switch','fieldguide','research','fireE','grassE','waterE','rival'].map(n => `art/${n}.webp`);
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(async c => {
    await c.addAll(SHELL);
    // Art is best-effort: a missing file must not block install.
    await Promise.all(ART.map(u => c.add(u).catch(() => {})));
  }));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // App pages: network first so updates land, fall back to cache offline.
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put('index.html', copy)); return r; })
      .catch(() => caches.match('index.html')));
    return;
  }
  // Everything else (art, icons, fonts): cache first.
  if (url.origin === location.origin || /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
      if (r.ok || r.type === 'opaque') { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return r;
    })));
  }
});
