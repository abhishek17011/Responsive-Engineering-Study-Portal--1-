self.addEventListener("install", event => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", event => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "Engineer Vault";
  const options = {
    body: data.body || "New study updates are available.",
    icon: "/icons/engineer-vault-logo-192.png",
    badge: "/icons/engineer-vault-logo-192.png",
    tag: data.tag || "engineer-vault-update",
    data: { url: data.url || "/" }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", event => {
  event.notification.close();

  event.waitUntil((async () => {
    const targetUrl = new URL(event.notification.data.url || "/", self.location.origin).href;
    const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    const existingWindow = windows.find(client => client.url === targetUrl);

    if (existingWindow) {
      return existingWindow.focus();
    }

    return self.clients.openWindow(targetUrl);
  })());
});

