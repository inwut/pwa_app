const express = require("express");

const catchAsyncHandler = require("../utils/catchAsyncHandler");
const { auth, optionalAuth, restrictByRole } = require("../middleware/auth");
const {
  getRecipeById,
  getRecipes,
  deleteRecipe,
  likeRecipe,
  unlikeRecipe,
  getLikedRecipes,
} = require("../controllers/recipeControllers");

const router = express.Router();

router.get("/", optionalAuth, catchAsyncHandler(getRecipes));

router.post("/", auth, restrictByRole("user"), (req, res) => {});

router.get(
  "/liked",
  auth,
  restrictByRole("user"),
  catchAsyncHandler(getLikedRecipes),
);

router.get("/:id", optionalAuth, catchAsyncHandler(getRecipeById));

router.delete("/:id", auth, catchAsyncHandler(deleteRecipe));

router.put("/:id", auth, restrictByRole("user"), (req, res) => {});

router.post(
  "/:id/like",
  auth,
  restrictByRole("user"),
  catchAsyncHandler(likeRecipe),
);

router.delete(
  "/:id/like",
  auth,
  restrictByRole("user"),
  catchAsyncHandler(unlikeRecipe),
);

module.exports = router;
