const CACHE_NAME = 'utilitydock-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/logo.png',
  '/privacy.html',
  '/terms.html',
  '/tools/json-formatter.html',
  '/tools/base64-encoder.html',
  '/tools/uuid-generator.html',
  '/tools/password-generator.html',
  '/tools/timestamp-converter.html',
  '/tools/hash-generator.html',
  '/tools/regex-tester.html',
  '/tools/url-encoder.html',
  '/tools/json-to-yaml.html',
  '/tools/html-formatter.html',
  '/tools/docker-compose-validator.html',
  '/tools/kubernetes-yaml-generator.html',
  '/tools/helm-values-formatter.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
