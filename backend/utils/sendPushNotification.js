const webpush = require("web-push");
const pushSubscriptionDao = require("../dao/pushSubscriptionDao");

const sendPushNotification = async (userId, payload) => {
  const subs = await pushSubscriptionDao.getSubscriptionsByUserId(userId);

  for (const sub of subs) {
    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: {
            auth: sub.auth,
            p256dh: sub.p256dh,
          },
        },
        JSON.stringify(payload),
      );
    } catch (err) {
      console.error("Push error:", err);
    }
  }
};

module.exports = sendPushNotification;
