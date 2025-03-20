const express = require("express");

const catchAsyncHandler = require("../utils/catchAsyncHandler");
const { optionalAuth } = require("../middlewares/auth");
const {
  loginValidator,
  signupValidator,
} = require("../middlewares/validators/userValidators");
const { idValidator } = require("../middlewares/validators/idValidator");
const validationHandler = require("../middlewares/validationHandler");
const {
  signup,
  login,
  getUsers,
  getUserById,
  getUserFollowing,
  getUserFollowers,
} = require("../controllers/userControllers");

const router = express.Router();

router.get("/", catchAsyncHandler(getUsers));

router.post(
  "/signup",
  signupValidator,
  validationHandler,
  catchAsyncHandler(signup),
);

router.post(
  "/login",
  loginValidator,
  validationHandler,
  catchAsyncHandler(login),
);

router.get(
  "/:id",
  optionalAuth,
  idValidator,
  validationHandler,
  catchAsyncHandler(getUserById),
);

router.get(
  "/:id/following",
  idValidator,
  validationHandler,
  catchAsyncHandler(getUserFollowing),
);

router.get(
  "/:id/followers",
  idValidator,
  validationHandler,
  catchAsyncHandler(getUserFollowers),
);

module.exports = router;
