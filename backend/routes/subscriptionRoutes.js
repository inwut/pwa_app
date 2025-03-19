const express = require("express");

const catchAsyncHandler = require("../utils/catchAsyncHandler");
const { auth, restrictByRole } = require("../middlewares/auth");
const {
  createSubscription,
  deleteSubscription,
} = require("../controllers/subscriptionControllers");

const router = express.Router();

router.post(
  "/",
  auth,
  restrictByRole("user"),
  catchAsyncHandler(createSubscription),
);
router.delete(
  "/",
  auth,
  restrictByRole("user"),
  catchAsyncHandler(deleteSubscription),
);

module.exports = router;
