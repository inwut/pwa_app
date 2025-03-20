const { body, query } = require("express-validator");

const subscriptionDataValidator = [
  body("userId").isInt({ min: 1 }).withMessage("Invalid user ID"),
];

const deleteSubscriptionValidator = [
  query("userId").isInt({ min: 1 }).withMessage("Invalid user ID"),
];

module.exports = { subscriptionDataValidator, deleteSubscriptionValidator };
