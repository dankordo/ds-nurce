importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyCXFoCq_GBexrKgTmKukzhaJo5_tROjTxo",
    authDomain: "ds-nurce-bdc37.firebaseapp.com",
    databaseURL: "https://ds-nurce-bdc37-default-rtdb.firebaseio.com",
    projectId: "ds-nurce-bdc37",
    storageBucket: "ds-nurce-bdc37.appspot.com",
    messagingSenderId: "725307523922",
    appId: "1:725307523922:web:b9c71b96e2a35c42a7e401"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
    console.log('[firebase-messaging-sw.js] Получено фоновое сообщение ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.icon
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
});
