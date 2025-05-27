const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userDao = require("../dao/userDao");
const recipeDao = require("../dao/recipeDao");
const AppError = require("../utils/appError");

const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const signup = async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await userDao.createUser({
    username,
    email,
    password: hashedPassword,
  });

  const token = generateToken(newUser);

  res.cookie("token", token, {
    httpOnly: true,
    // secure: true,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    id: newUser.id,
    role: newUser.role,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await userDao.getUserByEmail(email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = generateToken(user);

  res.cookie("token", token, {
    httpOnly: true,
    // secure: true,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    id: user.id,
    role: user.role,
    pushNotificationsEnabled: user.pushNotificationsEnabled,
  });
};

const logout = async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};

const me = (req, res) => {
  const user = req.user;
  res.json({
    id: user.id,
    role: user.role,
    pushNotificationsEnabled: user.pushNotificationsEnabled,
  });
};

const enablePushNotifications = async (req, res) => {
  const user = req.user;
  await userDao.enablePushNotifications(user);
  res.status(200).json({ message: "Push notifications enabled successfully" });
};

const disablePushNotifications = async (req, res) => {
  const user = req.user;
  await userDao.disablePushNotifications(user);
  res.status(200).json({ message: "Push notifications disabled successfully" });
};

const getUsers = async (req, res) => {
  const { search, limit, offset } = req.query;

  const users = await userDao.getAllUsers(search, limit, offset);
  res.status(200).json(users);
};

const getUserById = async (req, res) => {
  const userId = req.params.id;
  const authUserId = req.user?.id;

  const user = await userDao.getUserById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const recipes = await recipeDao.getUserRecipes(userId, authUserId);
  const [followersCount, followingCount] = await Promise.all([
    userDao.countUserFollowers(user),
    userDao.countUserFollowing(user),
  ]);

  let responseData = {
    user: {
      id: user.id,
      username: user.username,
      pushNotificationsEnabled: user.pushNotificationsEnabled,
      recipes,
      recipeCount: recipes.length,
      followersCount,
      followingCount,
    },
  };

  if (authUserId) {
    responseData.user.isFollowed = await userDao.isUserFollowingUser(
      authUserId,
      user,
    );
  }

  res.status(200).json(responseData);
};

const getUserFollowing = async (req, res) => {
  const userId = req.params.id;
  const { search, limit, offset } = req.query;

  const user = await userDao.getUserById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const following = await userDao.getUserFollowing(user, search, limit, offset);
  res.status(200).json([...following]);
};

const getUserFollowers = async (req, res) => {
  const userId = req.params.id;
  const { search, limit, offset } = req.query;

  const user = await userDao.getUserById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const followers = await userDao.getUserFollowers(user, search, limit, offset);
  res.status(200).json([...followers]);
};

module.exports = {
  signup,
  login,
  logout,
  me,
  getUsers,
  getUserById,
  getUserFollowing,
  getUserFollowers,
  enablePushNotifications,
  disablePushNotifications,
};
