importScripts('https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/11.0.0/firebase-messaging.js');

// Кэширование для оффлайн работы
const CACHE_NAME = 'midwife-app-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.png',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

// Установка сервис-воркера
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Обработка запросов для оффлайн работы
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

// Инициализация Firebase
firebase.initializeApp({
    apiKey: "AIzaSyBUUrP-CevoeDOsUZorjC6XDzZ-vd3Uauw",
    authDomain: "ds-nurce-bdc37.firebaseapp.com",
    databaseURL: "https://ds-nurce-bdc37-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "ds-nurce-bdc37",
    storageBucket: "ds-nurce-bdc37.appspot.com",
    messagingSenderId: "725307523922",
    appId: "1:725307523922:web:9bb5c6ae685e479719b08b"
});

const messaging = firebase.messaging();

// Обработка фоновых сообщений
messaging.onBackgroundMessage((payload) => {
    console.log('Received background message: ', payload);
    
    const notificationTitle = payload.notification?.title || 'Напоминание';
    const notificationOptions = {
        body: payload.notification?.body || 'Пора выполнить действие',
        icon: 'icon-192x192.png',
        badge: 'icon-192x192.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Обработка клика по уведомлению
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then((clientList) => {
            for (const client of clientList) {
                if (client.url === '/' && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});
