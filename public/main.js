const publicKey = 'BIGpGEIxbW_928p-DVbSsti7ak6YY6bNU-_tukxMnIdz2Mt1i85TclZqCbkuMd3_wbjamopzZzd9hvL5Rj2yLwE';

const urlBase64ToUint8Array = (base64String) => {

  // eslint-disable-next-line no-mixed-operators
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const subscription = async () => {

  // Service Worker
  const register = await navigator.serviceWorker.register('/serviceWorker.js', {
    scope: '/',
  });

  const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey),
  });

  await fetch('/api/v1/users/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

subscription();
