const CACHE_NAME = "math-masters-v1";
const ASSETS = [
  "index.html",
  "categories.html",
  "algebra.html",
  "fractions.html",
  "geometry.html",
  "bodmas.html",
  "arithmetic.html",
  "percentage.html",
  "ai.html",
  "formulas.html",
  "howto.html",
  "test.html",
  "manifest.json",
  "math.png",
  "math2.jpg",
  "bg.mp3",
  "click.mp3",
  "bronze.png",
  "silver.png",
  "gold.png",
  "platinum.png",
  "diamond.png",
  "heroic.png",
  "grandmaster.png"
];

// Install Service Worker and cache files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate Service Worker and remove old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
  self.clients.claim();
});

// Fetch from cache, else from network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).then((res) => {
          // Dynamic caching
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, res.clone());
            return res;
          });
        })
      );
    }).catch(() => {
      if (event.request.destination === "document") {
        return caches.match("index.html");
      }
    })
  );
});
