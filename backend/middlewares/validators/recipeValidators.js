const { body, query } = require("express-validator");

const AppError = require("../../utils/appError");

const recipeDataValidator = [
  body("name")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Recipe name is required"),
  body("instructions")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Instructions are required"),
  body("ingredients")
    .notEmpty()
    .withMessage("Ingredients are required")
    .isArray()
    .withMessage("Invalid ingredients format")
    .custom((value) => {
      if (value.length === 0 || value.some((ing) => !ing.name || !ing.amount)) {
        throw new AppError("Invalid ingredients format", 400);
      }
      value.forEach((ing) => {
        ing.name = ing.name.trim().replace(/[<>]/g, "");
        ing.amount = ing.amount.trim().replace(/[<>]/g, "");
      });
      return true;
    }),
];

const recipesParamsValidator = [
  query("onlyFollowing")
    .optional()
    .isBoolean()
    .withMessage("onlyFollowing must be a boolean"),
  query("ingredients")
    .optional()
    .trim()
    .matches(/^(\w+,)*\w+$/)
    .withMessage("Invalid ingredients format"),
];

module.exports = { recipeDataValidator, recipesParamsValidator };
