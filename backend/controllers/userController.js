const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../db/models/user");
const Recipe = require("../db/models/recipe");
const Subscription = require("../db/models/subscription");
const AppError = require("../utils/appError");
const callDbHandler = require("../utils/callDbHandler");
const { Op, literal, fn, col } = require("sequelize");

const signup = async (req, res) => {
  const { username, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await callDbHandler(() =>
    User.create({ username, email, password: hashedPassword }),
  );

  const token = jwt.sign(
    { id: newUser.id, role: newUser.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN },
  );
  res.status(201).json({
    message: "User signed up successfully",
    token,
    id: newUser.id,
    role: newUser.role,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await callDbHandler(() => User.findOne({ where: { email } }));
  if (!user) {
    throw new AppError("Invalid email or password", 400);
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 400);
  }
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN },
  );

  res.status(200).json({
    message: "User logged in successfully",
    token,
    id: user.id,
    role: user.role,
  });
};

const getUsers = async (req, res) => {
  const { search } = req.query;

  const users = await User.findAll({
    attributes: [
      "id",
      "username",
      [fn("COUNT", col("createdRecipes.id")), "recipeCount"],
      [fn("COUNT", col("subscribers.id")), "followersCount"],
    ],
    include: [
      {
        model: Recipe,
        as: "createdRecipes",
        attributes: [],
      },
      {
        model: User,
        as: "subscribers",
        attributes: [],
        through: { attributes: [] },
      },
    ],
    where: search ? { username: { [Op.iLike]: `%${search}%` } } : {},
    group: ["user.id"],
    order: [["followersCount", "DESC"]],
  });

  res.status(200).json(users);
};

const getUserById = async (req, res) => {
  const userId = req.params.id;
  const authUserId = req.user?.id;

  const user = await User.findByPk(userId, {
    attributes: ["id", "username"],
    include: [
      {
        model: Recipe,
        as: "createdRecipes",
        attributes: [
          "id",
          "name",
          "image",
          [fn("COUNT", col("createdRecipes->likes.id")), "likesCount"],
        ],
        include: [
          {
            model: User,
            as: "likes",
            attributes: [],
            through: { attributes: [] },
          },
        ],
      },
    ],
    group: ["user.id", "createdRecipes.id"],
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const followers = await user.countSubscribers();
  const following = await user.countSubscriptions();

  let responseData = {
    user: {
      id: user.id,
      username: user.username,
      recipes: user.createdRecipes,
      followers,
      following,
    },
  };

  if (authUserId) {
    const subscription = await Subscription.findOne({
      where: { userId, subscriberId: authUserId },
    });
    responseData.user.isFollowed = !!subscription;
  }

  res.status(200).json(responseData);
};

const getFollowsQueryConfig = (search) => {
  return {
    attributes: [
      "id",
      "username",
      [
        literal(`(
        SELECT COUNT(*) 
        FROM "recipe" 
        WHERE "recipe"."authorId" = "user"."id"
      )`),
        "recipesCount",
      ],
      [
        literal(`(
        SELECT COUNT(*) 
        FROM "subscription" 
        WHERE "subscription"."userId" = "user"."id"
      )`),
        "followersCount",
      ],
    ],
    joinTableAttributes: [],
    where: search ? { username: { [Op.iLike]: `%${search}%` } } : {},
    order: [[col("subscription.createdAt"), "DESC"]],
  };
};

const getUserFollowing = async (req, res) => {
  const userId = req.params.id;
  const { search } = req.query;

  const user = await User.findByPk(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const following = await user.getSubscriptions(getFollowsQueryConfig(search));
  res.status(200).json({ following });
};

const getUserFollowers = async (req, res) => {
  const userId = req.params.id;
  const { search } = req.query;

  const user = await User.findByPk(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const followers = await user.getSubscribers(getFollowsQueryConfig(search));
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
