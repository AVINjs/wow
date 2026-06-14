// sw.js — Apin Downloader Service Worker
const CACHE_NAME = 'apin-dl-v1';
const STATIC_ASSETS = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(STATIC_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Handle share target
  if (url.pathname === '/' && url.searchParams.has('shared_url')) {
    const sharedUrl = url.searchParams.get('shared_url');
    e.respondWith(
      Response.redirect(`/?auto=${encodeURIComponent(sharedUrl)}`, 303)
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
