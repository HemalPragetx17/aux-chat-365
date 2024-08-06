'use strict';

importScripts('https://www.gstatic.com/firebasejs/8.2.4/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.4/firebase-messaging.js');

firebase.initializeApp({
  apiKey: 'AIzaSyDK9LRE2Ht0k3VGKQBVb6bMiAJhs_2zgeg',
  authDomain: 'aux365-49786.firebaseapp.com',
  projectId: 'aux365-49786',
  storageBucket: 'aux365-49786.appspot.com',
  messagingSenderId: '915023845200',
  appId: '1:915023845200:web:84b23c02ec952021783e55',
  measurementId: 'G-WDSR6BG6QD',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload?.data?.title;
  const notificationOptions = {
    body: payload?.data?.body,
    icon: '',
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions,
  );
});
