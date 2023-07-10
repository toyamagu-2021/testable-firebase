importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

firebase.initializeApp({
  apiKey: 'AIzaSyBi6HOtaFZ8D9YC_dPCXv-SDd6NNCMo2IU',
  authDomain: 'sample-chat-toyamagu-2021.firebaseapp.com',
  projectId: 'sample-chat-toyamagu-2021',
  storageBucket: 'sample-chat-toyamagu-2021.appspot.com',
  messagingSenderId: '856464471501',
  appId: '1:856464471501:web:660421c40813bd98f14084',
});

const messaging = firebase.messaging();
