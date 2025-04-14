const express = require("express");

const catchAsyncHandler = require("../utils/catchAsyncHandler");
const {
  getPublicKey,
  checkIfSubscribed,
  subscribeToPush,
  unsubscribeFromPush,
} = require("../controllers/pushSubscriptionControllers");
const { auth, restrictByRole } = require("../middlewares/auth");
const {
  pushSubscriptionDataValidator,
  pushEndpointValidator,
} = require("../middlewares/validators/pushSubscriptionValidators");
const validationHandler = require("../middlewares/validationHandler");

const router = express.Router();

router.get(
  "/",
  auth,
  restrictByRole("user"),
  catchAsyncHandler(checkIfSubscribed),
);

router.get(
  "/public-key",
  auth,
  restrictByRole("user"),
  catchAsyncHandler(getPublicKey),
);
router.post(
  "/",
  auth,
  restrictByRole("user"),
  pushSubscriptionDataValidator,
  validationHandler,
  catchAsyncHandler(subscribeToPush),
);
router.delete(
  "/",
  auth,
  restrictByRole("user"),
  pushEndpointValidator,
  validationHandler,
  catchAsyncHandler(unsubscribeFromPush),
);

module.exports = router;
