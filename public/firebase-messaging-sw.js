// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
// Replace 10.13.2 with latest version of the Firebase JS SDK.
importScripts("https://www.gstatic.com/firebasejs/11.0.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.0.1/firebase-messaging-compat.js");

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyCqstMMXg-HAXTTSkrmIs4vQ-Lt2ZOHaBY",
  authDomain: "messenger-app-45b9b.firebaseapp.com",
  projectId: "messenger-app-45b9b",
  storageBucket: "messenger-app-45b9b.firebasestorage.app",
  messagingSenderId: "745679100528",
  appId: "1:745679100528:web:4db8f6a81ce7d31ff532b5",
  measurementId: "G-measurement-id",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message ", payload);
  // Customize notification here
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: "./resources/img/messenger-icon-4.jpg",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
