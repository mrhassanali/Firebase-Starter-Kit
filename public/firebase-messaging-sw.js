// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  ); 
  const {data} = payload;
 if(data && data.title && data.body){
  const notificationTitle = data.title;
  const notificationOptions = {
    body: data.body,
    icon: '/favicon.ico',
    data:{
      jobUrl: `https://example.com//${data.category}/${data.jobId}`
    },
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
  }
});

self.addEventListener('notificationclick', function(event) {
  // console.log('[firebase-messaging-sw.js] Received notification click',event.notification);
  event.waitUntil(
    clients.openWindow(event.notification.data.jobUrl)
  );
  event.notification.close();
});

