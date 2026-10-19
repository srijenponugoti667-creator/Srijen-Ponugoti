// Firebase Cloud Messaging Service Worker for background push notifications
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBSRvsaXbQqWbDGyjoS7Z7L8Kb77KxZZwo",
  projectId: "zealous-pod-b09p9",
  messagingSenderId: "426745217281",
  appId: "1:426745217281:web:7be49039d080abd3d2db00"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification?.title || 'JusticeBridge Legal Alert';
  const notificationOptions = {
    body: payload.notification?.body || 'Your case status has been updated.',
    icon: '/pwa-192x192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
