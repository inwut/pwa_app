const express = require("express");

const catchAsyncHandler = require("../utils/catchAsyncHandler");
const { optionalAuth, auth, restrictByRole } = require("../middlewares/auth");
const {
  loginValidator,
  signupValidator,
} = require("../middlewares/validators/userValidators");
const {
  idValidator,
  limitOffsetValidator,
} = require("../middlewares/validators/commonValidators");
const validationHandler = require("../middlewares/validationHandler");
const {
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
} = require("../controllers/userControllers");

const router = express.Router();

router.get(
  "/",
  limitOffsetValidator,
  validationHandler,
  catchAsyncHandler(getUsers),
);

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

router.post("/logout", auth, catchAsyncHandler(logout));

router.get("/me", auth, catchAsyncHandler(me));

router.patch(
  "/enablePushNotifications",
  auth,
  restrictByRole("user"),
  catchAsyncHandler(enablePushNotifications),
);

router.patch(
  "/disablePushNotifications",
  auth,
  restrictByRole("user"),
  catchAsyncHandler(disablePushNotifications),
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
  limitOffsetValidator,
  validationHandler,
  catchAsyncHandler(getUserFollowing),
);

router.get(
  "/:id/followers",
  idValidator,
  limitOffsetValidator,
  validationHandler,
  catchAsyncHandler(getUserFollowers),
);

module.exports = router;
