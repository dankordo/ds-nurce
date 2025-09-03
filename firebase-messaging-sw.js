importScripts('https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/11.0.0/firebase-messaging.js');

// Инициализация Firebase в сервис-воркере
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

// Обработка фоновых сообщений (когда приложение закрыто)
messaging.onBackgroundMessage((payload) => {
    console.log('Received background message: ', payload);
    
    const notificationTitle = payload.notification?.title || 'Напоминание';
    const notificationOptions = {
        body: payload.notification?.body || 'Пора выполнить действие',
        icon: 'favicon.png',
        badge: 'favicon.png'
    };

    // Показываем уведомление
    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Обработка клика по уведомлению
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    // Открываем/фокусируем приложение при клике на уведомление
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
