// JusticeBridge Standalone Service Worker for PWABuilder & Mobile PWA
const CACHE_NAME = 'justicebridge-pwa-v3';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/app-logo.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('PWA cache addAll error:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PURGE_SENSITIVE_CACHE') {
    event.waitUntil(
      caches.keys().then((names) => Promise.all(names.map((n) => caches.delete(n))))
    );
  }
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // Shared-Device Privacy Enforcement: NEVER cache /api/* routes, Auth tokens, or Firestore/Storage payloads
  const reqUrl = new URL(event.request.url);
  if (
    reqUrl.pathname.startsWith('/api/') ||
    reqUrl.hostname.includes('firestore.googleapis.com') ||
    reqUrl.hostname.includes('identitytoolkit.googleapis.com') ||
    reqUrl.hostname.includes('firebasestorage.googleapis.com')
  ) {
    return;
  }

  // Network-first with Cache fallback strategy exclusively for static shell assets
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone and cache valid static asset responses only
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          if (event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/index.html');
          }
          return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
        });
      })
  );
});
