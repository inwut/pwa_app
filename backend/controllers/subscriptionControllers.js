const userDao = require("../dao/userDao");
const sendPushNotification = require("../utils/sendPushNotification");

const createSubscription = async (req, res) => {
  const subscriber = req.user;
  const { userId } = req.body;

  const subscription = await userDao.followUser(userId, subscriber.id);

  await sendPushNotification(subscription.userId, {
    title: "New follower!",
    body: `@${subscriber.username} is now following you`,
    data: {
      url: `/profile/${subscriber.id}`,
    },
  });

  res.status(201).json({ message: "Successfully followed" });
};

const deleteSubscription = async (req, res) => {
  const subscriberId = req.user.id;
  const { userId } = req.query;

  await userDao.unfollowUser(userId, subscriberId);
  res.status(200).json({ message: "Successfully unfollowed" });
};

module.exports = { createSubscription, deleteSubscription };
