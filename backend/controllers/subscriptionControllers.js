const userDao = require("../dao/userDao");

const createSubscription = async (req, res) => {
  const subscriberId = req.user.id;
  const { userId } = req.body;

  const subscription = await userDao.followUser(userId, subscriberId);
  res.status(201).json({ message: "Successfully followed" });
};

const deleteSubscription = async (req, res) => {
  const subscriberId = req.user.id;
  const { userId } = req.query;

  await userDao.unfollowUser(userId, subscriberId);
  res.status(200).json({ message: "Successfully unfollowed" });
};

module.exports = { createSubscription, deleteSubscription };
