/* V-FACTOR STUDIOS // @_the_v_factor_ // BUILT BY VINAY — OFFLINE CACHE SERVICE WORKER */
"use strict";

const CACHE_NAME = "vf-turbo-racer-v1.0.0";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./core.js",
  "./ships.js",
  "./engine.js",
  "./app.js",
  "./manifest.json",
  "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js",
  "https://unpkg.com/peerjs@1.5.2/dist/peerjs.min.js"
];

self.addEventListener("install", function(event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(CORE_ASSETS).catch(function() {});
    })
  );
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.map(function(key) {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function(event) {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then(function(cachedResponse) {
      return cachedResponse || fetch(event.request).then(function(networkResponse) {
        if (networkResponse && networkResponse.status === 200) {
          const copy = networkResponse.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, copy);
          });
        }
        return networkResponse;
      }).catch(function() {
        return cachedResponse;
      });
    })
  );
});