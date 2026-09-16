// sw-push.js — Service Worker do FalconBot, só pra Web Push.
// Não faz cache nem funciona offline: a única razão dele existir é poder
// receber um evento "push" mesmo com a aba/navegador fechados e mostrar
// uma notificação do sistema operacional.

self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { title: 'FalconBot', body: event.data ? event.data.text() : '' };
  }

  const title = data.title || 'FalconBot';
  const options = {
    body: data.body || '',
    icon: data.icon || './assets/marca-falcao.png',
    badge: data.icon || './assets/marca-falcao.png',
    tag: data.tag || 'falconbot-venda',
    data: { url: data.url || './' },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || './';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((lista) => {
      for (const c of lista) {
        if ('focus' in c) return c.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
