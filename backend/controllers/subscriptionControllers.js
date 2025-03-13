const Subscription = require("../db/models/subscription");
const callDbHandler = require("../utils/callDbHandler");
const User = require("../db/models/user");

const createSubscription = async (req, res) => {
  const subscriberId = req.user.id;
  const { userId } = req.body;

  console.log(subscriberId, userId);

  const subscription = await callDbHandler(() =>
    Subscription.create({ userId, subscriberId }),
  );

  const subscriber = callDbHandler(() =>
    User.findByPk(subscription.subscriberId, {
      attributes: ["username"],
    }),
  ); // для пушів

  res.status(201).json({ message: "Successfully followed" });
};

const deleteSubscription = async (req, res) => {
  const subscriberId = req.user.id;
  const { userId } = req.query;

  await callDbHandler(() =>
    Subscription.destroy({
      where: {
        userId,
        subscriberId,
      },
    }),
  );

  res.status(200).json({ message: "Successfully unfollowed" });
};

module.exports = { createSubscription, deleteSubscription };
