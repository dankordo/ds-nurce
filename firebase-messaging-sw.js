// firebase-messaging-sw.js

// Используем compat-версии для Service Worker
importScripts('https://www.gstatic.com/firebasejs/11.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.0.0/firebase-messaging-compat.js');

// Инициализация Firebase
firebase.initializeApp({
    apiKey: "BEp5FjaMusKOcJPBREZEad0ZWHMMyYAp0dl_6yeFaiNdqfrtWFJ_0lA0S5kU8usP_IJu0SkdsTrSkOsRzPGYKY4",
    authDomain: "ds-nurce-bdc37.firebaseapp.com",
    projectId: "ds-nurce-bdc37",
    storageBucket: "ds-nurce-bdc37.appspot.com",
    messagingSenderId: "725307523922",
    appId: "1:725307523922:web:9bb5c6ae685e479719b08b"
});

// Получаем объект messaging
const messaging = firebase.messaging();

// Обработка фоновых сообщений
messaging.onBackgroundMessage(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message', payload);

    if (payload.notification) {
        const notificationTitle = payload.notification.title;
        const notificationOptions = {
            body: payload.notification.body,
            icon: '/favicon.png'
        };
        self.registration.showNotification(notificationTitle, notificationOptions);
    }
});
