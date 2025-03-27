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
    .customSanitizer((value) => {
      let ingredients;
      try {
        ingredients = JSON.parse(value);
      } catch (error) {
        throw new AppError("Invalid ingredients format", 400);
      }
      return ingredients;
    })
    .custom((value) => {
      if (
        !Array.isArray(value) ||
        value.length === 0 ||
        value.some((ing) => !ing.name || !ing.amount)
      ) {
        throw new AppError("Invalid ingredients format", 400);
      }
      return true;
    })
    .customSanitizer((value) => {
      return value.map((ing) => {
        return {
          name: ing.name.trim().replace(/[<>]/g, ""),
          amount: ing.amount.trim().replace(/[<>]/g, ""),
        };
      });
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
