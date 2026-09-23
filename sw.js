/* RotinaPet - Service Worker para PWA + Firebase Cloud Messaging */

importScripts('https://www.gstatic.com/firebasejs/12.18.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.18.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCiDk3ERIe8_uVqBhRnFRD5Od8nyLNlLVQ",
  authDomain: "rotinapet-624a9.firebaseapp.com",
  databaseURL: "https://rotinapet-624a9-default-rtdb.firebaseio.com",
  projectId: "rotinapet-624a9",
  storageBucket: "rotinapet-624a9.appspot.com",
  messagingSenderId: "218579871240",
  appId: "1:218579871240:web:c681389aacd70f677693bd"
});

const messaging = firebase.messaging();

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

messaging.onBackgroundMessage(payload => {
  const notification = payload.notification || {};
  const data = payload.data || {};

  const title =
    notification.title ||
    data.title ||
    '🐾 RotinaPet';

  const options = {
    body:
      notification.body ||
      data.body ||
      'Nova atividade na família',

    icon: data.icon || './icon-192.png',
    badge: data.badge || './icon-192.png',

    tag: data.tag || 'rotinapet-push',

    data: {
      url: data.url || './',
      ...data
    }
  };

  return self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', event => {
  event.notification.close();

  const targetUrl = new URL(
    (event.notification.data &&
      event.notification.data.url) ||
      './',
    self.location.href
  ).href;

  event.waitUntil(
    clients
      .matchAll({
        type: 'window',
        includeUncontrolled: true
      })
      .then(list => {

        for (const client of list) {

          if (
            client.url.startsWith(self.location.origin) &&
            'focus' in client
          ) {

            if ('navigate' in client) {
              return client
                .navigate(targetUrl)
                .then(() => client.focus());
            }

            return client.focus();
          }
        }

        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
  );
});
