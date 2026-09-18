/* MYLO service worker — app-shell offline cache + Chrome installability.
   Must be deployed alongside index.html (service workers cannot be inlined/blob-registered). */
const CACHE = 'mylo-shell-v1';
const SHELL = ['./', './index.html'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Never cache media streams / APIs — always go to network.
  if (/radio|googlevideo|youtube|itunes|lrclib|ipapi|supabase|theaudiodb/.test(url.host)) return;

  // App shell: network-first, fall back to cache (keeps app openable offline).
  if (req.mode === 'navigate' || url.pathname.endsWith('index.html') || url.pathname === '/') {
    e.respondWith(fetch(req).then(r => {
      const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return r;
    }).catch(() => caches.match('./index.html')));
    return;
  }

  // Static assets: cache-first.
  e.respondWith(caches.match(req).then(c => c || fetch(req)));
});
