(function () {
  const controls = document.getElementById('push-notification-controls');
  const enableButton = document.getElementById('enable-notifications');
  const status = document.getElementById('notification-status');

  const isInstalled = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

  if (!isInstalled || !('serviceWorker' in navigator) || !('PushManager' in window)) {
    return;
  }

  controls.hidden = false;

  function setStatus(message) {
    status.textContent = message;
  }

  function urlBase64ToUint8Array(value) {
    const padding = '='.repeat((4 - value.length % 4) % 4);
    const base64 = (value + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from(rawData, character => character.charCodeAt(0));
  }

  async function saveSubscription(subscription) {
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription.toJSON())
    });

    if (!response.ok) {
      throw new Error('Subscription could not be saved.');
    }
  }

  async function enableNotifications() {
    if (Notification.permission === 'denied') {
      setStatus('Notifications are blocked. Please allow them in your browser or app settings.');
      return;
    }

    enableButton.disabled = true;
    setStatus('Setting up notifications…');

    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setStatus('Notifications were not enabled.');
        return;
      }

      const registration = await navigator.serviceWorker.register('/service-worker.js');
      const existingSubscription = await registration.pushManager.getSubscription();
      let subscription = existingSubscription;

      if (!subscription) {
        const keyResponse = await fetch('/api/vapid-public-key');
        if (!keyResponse.ok) {
          throw new Error('Notification configuration is not ready.');
        }

        const { publicKey } = await keyResponse.json();
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey)
        });
      }

      await saveSubscription(subscription);
      setStatus('Notifications are enabled. You will receive new Engineer Vault updates here.');
    } catch (error) {
      setStatus('Could not enable notifications right now. Please try again later.');
    } finally {
      enableButton.disabled = false;
    }
  }

  enableButton.addEventListener('click', enableNotifications);
}());
