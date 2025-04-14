import api from "../common/api.js";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

const deleteExistingSubscriptionFromBrowser = async () => {
  if (!("serviceWorker" in navigator)) return;

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();

  if (subscription) {
    await subscription.unsubscribe();
  }
};

export const createPushSubscription = async () => {
  await deleteExistingSubscriptionFromBrowser();

  const registration = await navigator.serviceWorker.ready;

  const response = await api.get("pushSubscriptions/public-key");
  const { publicKey } = await response.data;
  const convertedKey = urlBase64ToUint8Array(publicKey);

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: convertedKey,
  });

  const { endpoint, keys } = subscription.toJSON();

  await api.post("pushSubscriptions", {
    endpoint,
    keys,
  });

  return subscription;
};

export const deletePushSubscription = async () => {
  if (!("serviceWorker" in navigator)) return;

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();

  if (subscription) {
    await api.delete("pushSubscriptions", {
      data: { endpoint: subscription.endpoint },
    });

    await subscription.unsubscribe();
  }
};
