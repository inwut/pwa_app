const pushSubscriptionDao = require("../dao/pushSubscriptionDao");

const getPublicKey = (req, res) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
};

const checkIfSubscribed = async (req, res) => {
  const userId = req.user.id;
  const subs = await pushSubscriptionDao.getSubscriptionsByUserId(userId);
  res.json({ isSubscribed: subs.length > 0 });
};

const subscribeToPush = async (req, res) => {
  const { endpoint, keys } = req.body;
  const userId = req.user.id;

  await pushSubscriptionDao.saveSubscription(userId, {
    endpoint,
    p256dh: keys.p256dh,
    auth: keys.auth,
  });
  res.status(201).json({ message: "Push subscription saved successfully." });
};

const unsubscribeFromPush = async (req, res) => {
  const { endpoint } = req.body;
  const userId = req.user.id;

  await pushSubscriptionDao.removeSubscription(userId, endpoint);
  res.status(200).json({ message: "Push subscription deleted successfully" });
};

module.exports = {
  getPublicKey,
  checkIfSubscribed,
  subscribeToPush,
  unsubscribeFromPush,
};
