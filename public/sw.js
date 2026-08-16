// Service worker — runs in the background, receives push events even
// when the site tab isn't open, and shows the OS-level notification.

self.addEventListener("push", (event) => {
  let data = { title: "Brainstorm Academy", body: "You have a new update." };
  try {
    data = event.data.json();
  } catch (e) {
    // fall back to default text above
  }

  const options = {
    body: data.body,
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    data: { url: data.url || "/" },
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(clients.openWindow(url));
});
