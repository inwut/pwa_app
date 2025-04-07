const { body } = require("express-validator");

const commentDataValidator = [
  body("content")
    .trim()
    .customSanitizer((value) => value.replace(/[<>]/g, ""))
    .notEmpty()
    .withMessage("Comment content is required"),
  body("recipeId").isInt({ min: 1 }).withMessage("Invalid recipe ID"),
  body("commentId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Invalid comment ID"),
];

module.exports = { commentDataValidator };
