const express = require("express");

const catchAsyncHandler = require("../utils/catchAsyncHandler");
const { auth, restrictByRole } = require("../middlewares/auth");
const {
  subscriptionDataValidator,
  deleteSubscriptionValidator,
} = require("../middlewares/validators/subscriptionValidators");
const validationHandler = require("../middlewares/validationHandler");
const {
  createSubscription,
  deleteSubscription,
} = require("../controllers/subscriptionControllers");

const router = express.Router();

router.post(
  "/",
  auth,
  restrictByRole("user"),
  subscriptionDataValidator,
  validationHandler,
  catchAsyncHandler(createSubscription),
);
router.delete(
  "/",
  auth,
  restrictByRole("user"),
  deleteSubscriptionValidator,
  validationHandler,
  catchAsyncHandler(deleteSubscription),
);

module.exports = router;
