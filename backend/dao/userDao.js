const callDbHandler = require("../utils/callDbHandler");
const User = require("../db/models/user");
const Subscription = require("../db/models/subscription");
const { Op, col } = require("sequelize");

const createUser = async (userData) => {
  return await callDbHandler(() => User.create(userData));
};

const getUserById = async (id) => {
  return await callDbHandler(() =>
    User.findByPk(id, {
      attributes: ["id", "username", "role"],
      where: { role: "user" },
    }),
  );
};

const getUserByEmail = async (email) => {
  return await callDbHandler(() => User.findOne({ where: { email } }));
};

const getUserFollowingIds = async (userId) => {
  return await callDbHandler(() =>
    Subscription.findAll({
      attributes: ["userId"],
      where: { subscriberId: userId },
    }),
  );
};

const getAllUsers = async (search) => {
  return await callDbHandler(() =>
    User.scope("withLikesAndFollowersCount").findAll({
      where: {
        ...(search ? { username: { [Op.iLike]: `%${search}%` } } : {}),
        role: "user",
      },
      order: [[col("followersCount"), "DESC"]],
    }),
  );
};

const countUserFollowing = async (user) => {
  return await callDbHandler(() => user.countSubscriptions());
};

const countUserFollowers = async (user) => {
  return await callDbHandler(() => user.countSubscribers());
};

const isUserFollowingUser = async (followerId, user) => {
  return await callDbHandler(() => user.hasSubscriber(followerId));
};

const getUserFollowsQuery = (search) => {
  return {
    ...User.options.scopes.withLikesAndFollowersCount,
    joinTableAttributes: [],
    where: search ? { username: { [Op.iLike]: `%${search}%` } } : {},
    order: [[col("subscription.createdAt"), "DESC"]],
  };
};

const getUserFollowing = async (user, search) => {
  return await callDbHandler(() =>
    user.getSubscriptions(getUserFollowsQuery(search)),
  );
};

const getUserFollowers = async (user, search) => {
  return await callDbHandler(() =>
    user.getSubscribers(getUserFollowsQuery(search)),
  );
};

const followUser = async (userId, subscriberId) => {
  return await callDbHandler(() =>
    Subscription.create({ userId, subscriberId }),
  );
};

const unfollowUser = async (userId, subscriberId) => {
  await callDbHandler(() =>
    Subscription.destroy({
      where: {
        userId,
        subscriberId,
      },
    }),
  );
};

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  getUserFollowingIds,
  getUserFollowing,
  getUserFollowers,
  getAllUsers,
  countUserFollowing,
  countUserFollowers,
  isUserFollowingUser,
  followUser,
  unfollowUser,
};
