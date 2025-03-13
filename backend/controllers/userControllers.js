const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op, literal, col } = require("sequelize");

const User = require("../db/models/user");
const Recipe = require("../db/models/recipe");
const AppError = require("../utils/appError");
const callDbHandler = require("../utils/callDbHandler");

const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const signup = async (req, res) => {
  const { username, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await callDbHandler(() =>
    User.create({ username, email, password: hashedPassword }),
  );

  const token = generateToken(newUser);

  res.status(201).json({
    message: "Signed up successfully",
    token,
    id: newUser.id,
    role: newUser.role,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await callDbHandler(() => User.findOne({ where: { email } }));

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError("Invalid email or password", 400);
  }

  const token = generateToken(user);

  res.status(200).json({
    message: "Logged in successfully",
    token,
    id: user.id,
    role: user.role,
  });
};

const getUsers = async (req, res) => {
  const { search } = req.query;

  const users = await callDbHandler(() =>
    User.scope("withLikesAndFollowersCount").findAll({
      where: search ? { username: { [Op.iLike]: `%${search}%` } } : {},
      order: [[col("followersCount"), "DESC"]],
    }),
  );

  res.status(200).json(users);
};

const getUserById = async (req, res) => {
  const userId = req.params.id;
  const authUserId = req.user?.id;

  const user = await callDbHandler(() =>
    User.findByPk(userId, {
      attributes: ["id", "username"],
    }),
  );

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const recipes = await callDbHandler(() =>
    Recipe.scope("withAuthorAndLikesCount").findAll({
      attributes: [
        authUserId
          ? [
              literal(
                `EXISTS (SELECT 1 FROM "like" 
                  WHERE "like"."recipeId" = "recipe"."id" 
                  AND "like"."userId" = ${authUserId})`,
              ),
              "isLiked",
            ]
          : [literal("false"), "isLiked"],
      ],
      where: {
        authorId: userId,
      },
      order: [["createdAt", "DESC"]],
    }),
  );

  const [followersCount, followingCount] = await Promise.all([
    callDbHandler(() => user.countSubscribers()),
    callDbHandler(() => user.countSubscriptions()),
  ]);

  let responseData = {
    user: {
      ...user.toJSON(),
      recipes,
      followersCount,
      followingCount,
    },
  };

  if (authUserId) {
    responseData.user.isFollowed = await callDbHandler(() =>
      user.hasSubscription(authUserId),
    );
  }

  res.status(200).json(responseData);
};

const getUserFollowsQuery = (search) => {
  return {
    ...User.options.scopes.withLikesAndFollowersCount,
    joinTableAttributes: [],
    where: search ? { username: { [Op.iLike]: `%${search}%` } } : {},
    order: [[col("subscription.createdAt"), "DESC"]],
  };
};

const getUserFollowing = async (req, res) => {
  const userId = req.params.id;
  const { search } = req.query;

  const user = await callDbHandler(() => User.findByPk(userId));
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const following = await callDbHandler(() =>
    user.getSubscriptions(getUserFollowsQuery(search)),
  );
  res.status(200).json({ following });
};

const getUserFollowers = async (req, res) => {
  const userId = req.params.id;
  const { search } = req.query;

  const user = await callDbHandler(() => User.findByPk(userId));
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const followers = await callDbHandler(() =>
    user.getSubscribers(getUserFollowsQuery(search)),
  );
  res.status(200).json({ followers: followers });
};

module.exports = {
  signup,
  login,
  getUsers,
  getUserById,
  getUserFollowing,
  getUserFollowers,
};
