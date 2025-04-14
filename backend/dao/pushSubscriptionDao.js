const callDbHandler = require("../utils/callDbHandler");
const PushSubscription = require("../db/models/pushsubscription");

const saveSubscription = async (userId, { endpoint, p256dh, auth }) => {
  return await callDbHandler(async () => {
    const [sub, created] = await PushSubscription.findOrCreate({
      where: { userId, endpoint },
      defaults: { p256dh, auth },
    });

    if (!created) {
      await sub.update({ p256dh, auth });
    }

    return sub;
  });
};

const removeSubscription = async (userId, endpoint) => {
  await callDbHandler(() =>
    PushSubscription.destroy({
      where: { userId, endpoint },
    }),
  );
};

const removeAllSubscriptions = async (userId) => {
  await callDbHandler(() =>
    PushSubscription.destroy({
      where: { userId },
    }),
  );
};

const getSubscriptionsByUserId = async (userId) => {
  return await callDbHandler(() =>
    PushSubscription.findAll({ where: { userId } }),
  );
};

module.exports = {
  saveSubscription,
  removeSubscription,
  getSubscriptionsByUserId,
  removeAllSubscriptions,
};
