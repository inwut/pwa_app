const express = require("express");

const catchAsyncHandler = require("../utils/catchAsyncHandler");
const { auth, optionalAuth, restrictByRole } = require("../middlewares/auth");
const imageValidator = require("../middlewares/imageValidator");
const {
  recipeDataValidator,
  recipesParamsValidator,
} = require("../middlewares/validators/recipeValidators");
const {
  idValidator,
  limitOffsetValidator,
  optionalLimitOffsetValidator,
} = require("../middlewares/validators/commonValidators");
const validationHandler = require("../middlewares/validationHandler");
const {
  createRecipe,
  getRecipeById,
  getRecipeByIdToEdit,
  getRecipes,
  deleteRecipe,
  likeRecipe,
  unlikeRecipe,
  getLikedRecipes,
  updateRecipe,
  getAllRecipesUniqueIngredients,
} = require("../controllers/recipeControllers");

const router = express.Router();

router.get(
  "/",
  optionalAuth,
  recipesParamsValidator,
  limitOffsetValidator,
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
  optionalLimitOffsetValidator,
  validationHandler,
  restrictByRole("user"),
  catchAsyncHandler(getLikedRecipes),
);

router.get("/ingredients", catchAsyncHandler(getAllRecipesUniqueIngredients));

router.get(
  "/edit/:id",
  auth,
  restrictByRole("user"),
  idValidator,
  catchAsyncHandler(getRecipeByIdToEdit),
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
