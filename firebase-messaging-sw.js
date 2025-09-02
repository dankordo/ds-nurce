importScripts('https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/11.0.0/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyBUUrP-CevoeDOsUZorjC6XDзZ-vd3Uauw",
    authDomain: "ds-nurce-bdc37.firebaseapp.com",
    databaseURL: "https://ds-nurce-bdc37-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "ds-nurce-bdc37",
    storageBucket: "ds-nurce-bdc37.appspot.com",
    messagingSenderId: "725307523922",
    appId: "1:725307523922:web:9bb5c6ae685e479719b08b"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
    const notificationTitle = payload.notification?.title || 'MidwifeApp';
    const notificationOptions = {
        body: payload.notification?.body || '',
        icon: '/favicon.png'
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
});
