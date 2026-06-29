self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // PWA requires a fetch handler to be recognized as installable.
  // We just let the browser handle it natively.
  return;
});
