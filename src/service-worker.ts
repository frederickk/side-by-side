// Lifted nearly verbatim from https://github.com/google-developer-training/pwa-training-labs/tree/master/cache-api-lab
// TODO (frederickk): With Manifest v3, should this be moved to background.ts.

(function() {
  /**
   * Files and URLs to cache
   */
  const filesToCache: Array<string> = [
    'https://fonts.googleapis.com/css?family=Material+Icons|Space+Mono&subset=latin',
  ];

  /**
   * Name of the cache
   */
  const staticCacheName = 'side-by-side-cache';

  /**
   * Install service worker and cache static assets
   */
  self.addEventListener('install', event => {
    console.log('Attempting to install service worker and cache static assets');
    event.waitUntil(caches.open(staticCacheName).then(cache => {
      return cache.addAll(filesToCache);
    }));
  });

  /**
   * Fetch cached assets
   */
  self.addEventListener('fetch', event => {
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
