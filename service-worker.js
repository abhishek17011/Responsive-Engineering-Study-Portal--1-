self.addEventListener("install", event => {
  console.log("Service Worker Installed");
  // Ensure SW update becomes active quickly.
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  console.log("Service Worker Activated");
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", event => {
  // No caching strategies currently.
});

