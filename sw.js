const CACHE_NAME = "offline-cache-v1";
const urlsToCache = [
    "/tangsoodomalaysia-score",
    "/tangsoodomalaysia-score/index.html",
    "/tangsoodomalaysia-score/styles.css",  // Change this if your CSS file has a different name
    "/tangsoodomalaysia-score/script.js",  // Change this if your JS file has a different name
];

cache.addAll()

// Install event: Cache files when the Service Worker is installed
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request).catch(() => caches.match('/tangsoodomalaysia-score/index.html'));
            })
    );
});

// Activate event: Clear old caches when a new version is available
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});
