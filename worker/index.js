/* eslint-disable no-undef */
import firebaseConfig from "./firebase-config";

importScripts("https://www.gstatic.com/firebasejs/7.14.6/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/7.14.6/firebase-messaging.js");

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler((payload) => {
  const { title, body, icon } = payload.notification;
  return self.registration.showNotification(title, { body, icon });
});

self.addEventListener("message", (event) => {
  const t = messaging.getToken().then((r) => {
    event.ports[0].postMessage(r);
  });
  event.waitUntil(t);
});

self.addEventListener("notificationclick", function (event) {
  const url = new URL("./", location);
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
        if (windowClient.url === url) {
          matchingClient = windowClient;
          break;
        }
      }
      if (matchingClient) {
        return matchingClient.focus();
      } else {
        return clients.openWindow(url);
      }
    });
  event.waitUntil(promiseChain);
});
