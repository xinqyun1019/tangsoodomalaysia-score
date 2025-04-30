const CACHE_NAME = "offline-cache-v2"; // 3.2.217
const urlsToCache = [
    "/tangsoodomalaysia-score",
    "/tangsoodomalaysia-score/index.html",
    "/tangsoodomalaysia-score/styles.css",
    "/tangsoodomalaysia-score/script.js",
];

// Install event
self.addEventListener("install", (event) => {
    self.skipWaiting(); // Immediately activate new SW
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
    );
});

// Activate event
self.addEventListener("activate", (event) => {
    clients.claim(); // Control all pages immediately
    event.waitUntil(
        caches.keys().then((cacheNames) =>
            Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            )
        )
    );
});

// Fetch event
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) =>
            response || fetch(event.request).catch(() =>
                caches.match('/tangsoodomalaysia-score/index.html')
            )
        )
    );
});

// Allow manual update via message
self.addEventListener("message", (event) => {
    if (event.data === "SKIP_WAITING") {
        self.skipWaiting();
    }
});
