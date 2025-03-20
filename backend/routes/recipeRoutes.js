const express = require("express");

const catchAsyncHandler = require("../utils/catchAsyncHandler");
const { auth, optionalAuth, restrictByRole } = require("../middlewares/auth");
const imageValidator = require("../middlewares/imageValidator");
const {
  recipeDataValidator,
  recipesParamsValidator,
} = require("../middlewares/validators/recipeValidators");
const { idValidator } = require("../middlewares/validators/idValidator");
const validationHandler = require("../middlewares/validationHandler");
const {
  createRecipe,
  getRecipeById,
  getRecipes,
  deleteRecipe,
  likeRecipe,
  unlikeRecipe,
  getLikedRecipes,
  updateRecipe,
} = require("../controllers/recipeControllers");

const router = express.Router();

router.get(
  "/",
  optionalAuth,
  recipesParamsValidator,
  validationHandler,
  catchAsyncHandler(getRecipes),
);

router.post(
  "/",
  auth,
  restrictByRole("user"),
  recipeDataValidator,
  validationHandler,
  imageValidator,
  catchAsyncHandler(createRecipe),
);

router.get(
  "/liked",
  auth,
  restrictByRole("user"),
  catchAsyncHandler(getLikedRecipes),
);

router.get("/:id", optionalAuth, idValidator, catchAsyncHandler(getRecipeById));

router.delete("/:id", auth, idValidator, deleteRecipe);

router.put(
  "/:id",
  auth,
  restrictByRole("user"),
  idValidator,
  recipeDataValidator,
  validationHandler,
  imageValidator,
  catchAsyncHandler(updateRecipe),
);

router.post(
  "/:id/like",
  auth,
  restrictByRole("user"),
  idValidator,
  catchAsyncHandler(likeRecipe),
);

router.delete(
  "/:id/like",
  auth,
  restrictByRole("user"),
  idValidator,
  catchAsyncHandler(unlikeRecipe),
);

module.exports = router;
