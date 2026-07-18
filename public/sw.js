// Service Worker for Push Notifications
// Place this file at: public/sw.js

self.addEventListener('push', function(event) {
  if (!event.data) return;

  const data = event.data.json();

  const options = {
    body: data.body,
    icon: data.icon || '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200, 100, 200],
    data: data.data || {},
    actions: [
      { action: 'chat', title: '💬 Reply Now' },
      { action: 'dismiss', title: 'Later' },
    ],
    requireInteraction: true,
    tag: `girlfriend-${data.data?.avatarId || 'msg'}`,
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action === 'dismiss') return;

  const avatarId = event.notification.data?.avatarId;
  const url = avatarId ? `/chat/${avatarId}` : '/dashboard';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (const client of clientList) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});
