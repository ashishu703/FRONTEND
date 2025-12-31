importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

let firebaseInitialized = false;

self.addEventListener('message', async (event) => {
  if (event.data && event.data.type === 'INIT_FIREBASE') {
    try {
      const { vapidKey } = event.data;
      
      if (!vapidKey) {
        console.error('VAPID key not provided');
        return;
      }

      if (!firebaseInitialized) {
        const firebaseConfig = {
          apiKey: vapidKey,
          projectId: 'temp',
          messagingSenderId: 'temp',
          appId: 'temp'
        };
        
        firebase.initializeApp(firebaseConfig);
        firebaseInitialized = true;
      }

      const messaging = firebase.messaging();
      
      messaging.onBackgroundMessage((payload) => {
        const notificationTitle = payload.notification?.title || 'New Notification';
        const notificationOptions = {
          body: payload.notification?.body || '',
          icon: '/logo.png',
          badge: '/logo.png',
          data: payload.data || {},
          requireInteraction: false,
          tag: payload.data?.notificationId || 'notification'
        };
        
        return self.registration.showNotification(notificationTitle, notificationOptions);
      });
    } catch (error) {
      console.error('Firebase initialization error in service worker:', error);
    }
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

