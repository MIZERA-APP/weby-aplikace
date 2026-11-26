const CACHE = 'weby-aplikace-v4';
const CORE = ['./', 'index.html', 'podminky.html', 'ukazky.html', 'sluzby.html', 'funkce.html', 'cenik.html', 'o-mne.html', 'kontakt.html', 'manifest.webmanifest', 'img/icon-192.png', 'img/icon-512.png', 'img/sonia-desk.webp', 'img/pr-uvod.webp', 'img/mor-app1.webp'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  if (r.mode === 'navigate') {
    e.respondWith(fetch(r).then(res => { const c = res.clone(); caches.open(CACHE).then(x => x.put(r, c)); return res; }).catch(() => caches.match(r).then(m => m || caches.match('index.html'))));
    return;
  }
  e.respondWith(caches.match(r).then(m => m || fetch(r).then(res => { if (res.ok && new URL(r.url).origin === location.origin) { const c = res.clone(); caches.open(CACHE).then(x => x.put(r, c)); } return res; })));
});
