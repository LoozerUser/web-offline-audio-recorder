const OFFLINE_VERSION = 1;
const CACHE_NAME = 'offline';
// Customize this with a different URL if needed.
const OFFLINE_URL = '/../index.html';

const putInCache = async (request, response) => {
  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response);
};

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME)
      .then(cache => cache.addAll([
        '/scripts/app.js',
        '/scripts/setup-db.js',
        '/styles/app.css',
        '/index.html'
      ]))
    // Setting {cache: 'reload'} in the new request will ensure that the response
    // isn't fulfilled from the HTTP cache; i.e., it will be from the network.
    //await cache.add(new Request(OFFLINE_URL, {cache: 'reload'}));
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // Enable navigation preload if it's supported.
    // See https://developers.google.com/web/updates/2017/02/navigation-preload
    if ('navigationPreload' in self.registration) {
      await self.registration.navigationPreload.enable();
    }
  })());

  // Tell the active service worker to take control of the page immediately.
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
     .then((networkResponse) => {
       return caches.open(currentCache).then((cache) => {
         cache.put(event.request, networkResponse.clone());
         return networkResponse;
       })
     })
     .catch(() => {
       return caches.match(event.request);
     })
  );
});

