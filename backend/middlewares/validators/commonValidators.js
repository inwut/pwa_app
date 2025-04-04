const { param, query } = require("express-validator");

const idValidator = [param("id").isInt({ min: 1 }).withMessage("Invalid ID")];

const limitOffsetValidator = [
  query("limit")
    .isInt({ min: 1 })
    .withMessage("Limit must be a positive integer"),
  query("offset")
    .isInt({ min: 0 })
    .withMessage("Offset must be a non-negative integer"),
];

const optionalLimitOffsetValidator = [
  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Limit must be a positive integer"),
  query("offset")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Offset must be a non-negative integer"),
];

module.exports = {
  idValidator,
  limitOffsetValidator,
  optionalLimitOffsetValidator,
};
