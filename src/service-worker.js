// Lifted nearly verbatim from https://github.com/google-developer-training/pwa-training-labs/tree/master/cache-api-lab

(function() {
  'use strict';

  /**
   * Files and URLs to cache
   * @type {Array}
   */
  const filesToCache = [
    'https://fonts.googleapis.com/css?family=Material+Icons|Space+Mono&subset=latin',
  ];

  /**
   * Name of the cache
   * @type {string}
   */
  const staticCacheName = 'side-by-side-cache';

  /**
   * Install service worker and cache static assets
   * @type {[type]}
   */
  self.addEventListener('install', event => {
    console.log('Attempting to install service worker and cache static assets');
    event.waitUntil(caches.open(staticCacheName).then(cache => {
      return cache.addAll(filesToCache);
    }));
  });

  /**
   * Fetch cached assets
   * @type {[type]}
   */
  self.addEventListener('fetch', event => {
    console.log('Fetch event for ', event.request.url);
    event.respondWith(caches.match(event.request).then(response => {
      if (response) {
        console.log('Found ', event.request.url, ' in cache');
        return response;
      }
      console.log('Network request for ', event.request.url);
      return fetch(event.request).then(response => {
        return caches.open(staticCacheName).then(cache => {
          if (event.request.url.indexOf('test') < 0) {
            cache.put(event.request.url, response.clone());
          }
          return response;
        });
      });
    }).catch(function(error) {
      console.log('Error, ', error);
    }));
  });

  /**
   * Activate/create service worker
   * @type {[type]}
   */
  self.addEventListener('activate', event => {
    console.log('Activating new service worker...');

    const cacheWhitelist = [staticCacheName];

    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        }));
      })
    );
  });

})();
