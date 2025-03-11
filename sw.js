const CACHE_NAME = "offline-cache-v1";
const urlsToCache = [
    "/",
    "/index.html",
    "/style.css",  // Adjust if your CSS file has a different name
    "/script.js",  // Adjust if your JS file has a different name
    "/images/logo.png",  // Example image file
];

// Install event: Cache files when the Service Worker is installed
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

// Fetch event: Serve files from cache when offline
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
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
