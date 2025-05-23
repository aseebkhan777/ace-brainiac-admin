// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Firebase configuration - must match your app config
const firebaseConfig = {
    apiKey: "AIzaSyC3r-0JnH7LoPsl1tPjzpRLNPTiz9tafu8",
    authDomain: "ace-brainiac.firebaseapp.com",
    projectId: "ace-brainiac",
    storageBucket: "ace-brainiac.firebasestorage.app",
    messagingSenderId: "935961889255",
    appId: "1:935961889255:web:dccad130da2cc5fedd1542",
    measurementId: "G-05MYNT3HC3"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Retrieve Firebase Messaging instance
const messaging = firebase.messaging();

// Log when the service worker is installed
self.addEventListener('install', event => {
  console.log('Service Worker installing.');
  // Force activation without waiting
  self.skipWaiting();
});

// Log when the service worker is activated
self.addEventListener('activate', event => {
  console.log('Service Worker activated.');
  // Claim any clients immediately
  event.waitUntil(clients.claim());
});

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification.body || '',
    icon: '/favicon.ico'
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});