const SideBySide = require('side-by-side');

new SideBySide();

(function() {
  // TODO(frederickk): Implement service worker in an attempt to cache
  // material-icons
  // https://github.com/frederickk/side-by-side/issues/4
  // if ('serviceWorker' in navigator) {
  //   navigator.serviceWorker.register('service-worker.js').then(registration => {
  //     console.log('Service Worker registration successful with scope: ', registration.scope);
  //   })
  //   .catch(function(err) {
  //     console.log('Service Worker registration failed: ', err);
  //   });
  // }
})();
