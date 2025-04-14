const { body } = require("express-validator");

const pushEndpointValidator = [
  body("endpoint").isURL().withMessage("Invalid endpoint URL"),
];

const pushSubscriptionDataValidator = [
  ...pushEndpointValidator,
  body("keys").isObject().withMessage("Keys must be an object"),
  body("keys.p256dh")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Missing 'p256dh' key"),
  body("keys.auth")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Missing 'auth' key"),
];

module.exports = {
  pushSubscriptionDataValidator,
  pushEndpointValidator,
};
