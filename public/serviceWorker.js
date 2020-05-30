console.log('Service Worker');

// eslint-disable-next-line no-restricted-globals
self.addEventListener('push', (e) => {
  const data = e.data.json();
  console.log(data);
  // eslint-disable-next-line no-restricted-globals
  self.registration.showNotification(data.title, {
    'body': data.message,
    'icon': 'https://kaizen-medical.s3.amazonaws.com/assets/kaizen-icon.png',
  });
});
