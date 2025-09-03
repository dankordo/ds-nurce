// firebase-messaging-sw.js

// Используем compat-версии для Service Worker (наиболее надёжно)
importScripts('https://www.gstatic.com/firebasejs/11.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.0.0/firebase-messaging-compat.js');

// Инициализация Firebase — те же значения, что и в index.html
firebase.initializeApp({
    apiKey: "AIzaSyBUUrP-CevoeDOsUZorjC6XDzZ-vd3Uauw",
    authDomain: "ds-nurce-bdc37.firebaseapp.com",
    projectId: "ds-nurce-bdc37",
    storageBucket: "ds-nurce-bdc37.appspot.com",
    messagingSenderId: "725307523922",
    appId: "1:725307523922:web:9bb5c6ae685e479719b08b"
});

const messaging = firebase.messaging();

// Фоновая обработка сообщений
messaging.onBackgroundMessage(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message', payload);

    const notificationTitle = (payload && payload.notification && payload.notification.title) ? payload.notification.title : 'Уведомление';
    const notificationOptions = {
        body: (payload && payload.notification && payload.notification.body) ? payload.notification.body : '',
        icon: '/favicon.png',
        data: payload.data || {}
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Обработка клика по нотификации
self.addEventListener('notificationclick', function(event) {
    console.log('[firebase-messaging-sw.js] notificationclick Received.', event.notification);
    event.notification.close();

    const urlToOpen = (event.notification && event.notification.data && event.notification.data.url) ? event.notification.data.url : '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if (client.url === urlToOpen && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});
