/* eslint-disable no-undef */
import firebaseConfig from "./firebase-config";

importScripts("https://www.gstatic.com/firebasejs/7.14.6/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/7.14.6/firebase-messaging.js");

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler((payload) => {
  const { title, body, icon, click_action } = payload.notification;
  return self.registration.showNotification(title, { body, icon, click_action });
});

self.addEventListener("message", (event) => {
  const t = messaging.getToken().then((r) => {
    event.ports[0].postMessage(r);
  });
  event.waitUntil(t);
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  const promiseChain = clients
    .matchAll({
      type: "window",
      includeUncontrolled: true
    })
    .then((windowClients) => {
      let matchingClient = null;
      for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];
        if (windowClient.url === feClickAction) {
          matchingClient = windowClient;
          break;
        }
      }
      if (matchingClient) {
        return matchingClient.focus();
      } else {
        return clients.openWindow(feClickAction);
      }
    });
  event.waitUntil(promiseChain);
});
