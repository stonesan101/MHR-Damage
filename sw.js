// const cacheName = 'site-cache-v1';
// const assetsToCache = ['setCreation.js'];
//
// self.addEventListener('install', event => {
// event.waitUntil(
// caches.open(cacheName).then(cache => {
// console.log('Opened cache');
// return cache.addAll(assetsToCache);
// })
// );
// });
//
const CACHE_NAME = "my-image-cache";
const IMAGE_URLS = [
  "./icons/ramp1.png",
  "./icons/ramp2.png",
  "./icons/ramp3.png",
  "./icons/Lvl1.png",
  "./icons/Lvl2.png",
  "./icons/Lvl3.png",
  "./icons/Lvl4.png",
  "./icons/chest.png",
  "./icons/leg.png",
  "./icons/helm.png",
  "./icons/waist.png",
  "./icons/arm.png",
  "./icons/charm.png",
  "./icons/gs.png",
];
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (let url of IMAGE_URLS) {
        if (!(await cache.match(url))) {
          await cache.add(url);
        }
      }
    })
  );
});

// Listen for the fetch event and respond with the cached image if found
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});
const unregisterServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      registration.unregister();
    }
  }
};
