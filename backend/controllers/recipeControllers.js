const path = require("path");

const AppError = require("../utils/appError");
const { sequelize } = require("../config/database");
const recipeDao = require("../dao/recipeDao");
const userDao = require("../dao/userDao");
const {
  generateUniqueImageName,
  saveImage,
  deleteImage,
} = require("../utils/fileUpload");

const createRecipe = async (req, res) => {
  const { name, instructions, ingredients } = req.body;
  const userId = req.user.id;
  const image = req.files?.image;

  const ingredientsArray = JSON.parse(ingredients);
  if (
    !Array.isArray(ingredientsArray) ||
    ingredientsArray.length === 0 ||
    ingredientsArray.some((ing) => !ing.name || !ing.amount)
  ) {
    throw new AppError("Invalid ingredients format", 400);
  }

  await sequelize.transaction(async (t) => {
    const imagePath = image ? generateUniqueImageName(image) : null;

    const recipe = await recipeDao.createRecipe(
      { name, instructions, image: imagePath, authorId: userId },
      t,
    );

    const ingredientsData = ingredientsArray.map((ingredient) => ({
      name: ingredient.name,
      amount: ingredient.amount,
      recipeId: recipe.id,
    }));

    await recipeDao.createRecipeIngredients(ingredientsData, t);

    if (image) {
      await saveImage(image, imagePath);
    }

    res.status(201).json({
      message: "Recipe created successfully",
      recipe,
    });
  });
};

const updateRecipe = async (req, res) => {
  const { name, instructions, ingredients } = req.body;
  const recipeId = req.params.id;
  const userId = req.user.id;
  const image = req.files?.image;

  const ingredientsArray = ingredients ? JSON.parse(ingredients) : [];
  if (
    !Array.isArray(ingredientsArray) ||
    (ingredientsArray.length &&
      ingredientsArray.some((ing) => !ing.name || !ing.amount))
  ) {
    throw new AppError("Invalid ingredients format", 400);
  }

  await sequelize.transaction(async (t) => {
    const recipe = await recipeDao.getRecipeById(recipeId, t);

    if (!recipe) {
      throw new AppError("Recipe not found", 404);
    }
    if (recipe.author.id !== userId) {
      throw new AppError(
        "You don't have permission to update this recipe",
        403,
      );
    }

    const oldImagePath = recipe.image;
    let imagePath = null;

    if (image) {
      if (oldImagePath) {
        imagePath = recipe.image;
      } else {
        imagePath = generateUniqueImageName(image);
      }
    }

    await recipeDao.updateRecipe(
      recipe,
      {
        name,
        instructions,
        image: imagePath,
      },
      t,
    );

    if (ingredientsArray.length) {
      await recipeDao.deleteRecipeIngredients(recipeId, t);

      const ingredientsData = ingredientsArray.map((ing) => ({
        name: ing.name,
        amount: ing.amount,
        recipeId,
      }));

      await recipeDao.createRecipeIngredients(ingredientsData, t);
    }

    if (imagePath) {
      await saveImage(image, imagePath);
    } else {
      if (oldImagePath) {
        deleteImage(path.join(__dirname, "..", "uploads", oldImagePath));
      }
    }

    res.status(200).json({
      message: "Recipe updated successfully",
      recipe,
    });
  });
};

const formatComments = (comments) => {
  const plainComments = comments.map((c) => c.toJSON());
  if (!plainComments.length) return [];

  const commentMap = new Map();
  const responseData = [];

  plainComments.forEach((comment) => {
    comment.responses = [];
    commentMap.set(comment.id, comment);
    if (!comment.commentId) {
      responseData.push(comment);
    }
  });

  plainComments.forEach((comment) => {
    if (comment.commentId) {
      let parent = commentMap.get(comment.commentId);
      while (parent && parent.commentId) {
        parent = commentMap.get(parent.commentId);
      }
      if (parent) {
        comment.to = commentMap.get(comment.commentId)?.author;
        parent.responses.push(comment);
      }
    }
  });

  const cleanCommentsData = (comments) =>
    comments.map(({ commentId, recipeId, responses, ...rest }) => ({
      ...rest,
      responses: responses
        .map(({ commentId, recipeId, responses, ...rest }) => ({ ...rest }))
        .sort((a, b) => a.id - b.id),
    }));

  return cleanCommentsData(responseData);
};

const getRecipeById = async (req, res) => {
  const recipeId = req.params.id;
  const authUserId = req.user?.id;

  const recipe =
    await recipeDao.getRecipeByIdWithAuthorAndIngredients(recipeId);

  if (!recipe) {
    throw new AppError("Recipe not found", 404);
  }

  const likesCount = await recipeDao.countRecipeLikes(recipe);
  const comments = await recipeDao.getRecipeComments(recipeId);
  const formattedComments = formatComments(comments);

  let responseData = {
    recipe: {
      ...recipe.toJSON(),
      image: recipe.image ? `/uploads/${recipe.image}` : null,
      likesCount,
      comments: formattedComments,
    },
  };

  if (authUserId) {
    responseData.recipe.isLiked = await recipeDao.isRecipeLikedByUser(
      recipe,
      authUserId,
    );
  }

  res.status(200).json(responseData);
};

const getRecipes = async (req, res) => {
  const { search, onlyFollowing, ingredients } = req.query;
  const authUserId = req.user?.id;

  const ingredientsArray = ingredients ? ingredients.split(",") : [];

  let followedUsersIds = [];
  if (onlyFollowing === "true" && authUserId) {
    const subscriptions = userDao.getUserFollowingIds(authUserId);
    followedUsersIds = subscriptions.map((sub) => sub.userId);
  }

  const recipes = await recipeDao.getAllRecipes(
    search,
    followedUsersIds,
    ingredientsArray,
    authUserId,
  );

  res.status(200).json(recipes);
};

const deleteRecipe = async (req, res) => {
  const recipeId = req.params.id;
  const authUserId = req.user.id;
  const isAdmin = req.user.role === "admin";

  const recipe = await recipeDao.getRecipeByIdWithAuthorId(recipeId);

  if (!recipe) {
    throw new AppError("Recipe not found", 404);
  }

  if (recipe.author.id !== authUserId && !isAdmin) {
    throw new AppError("You don't have permission to delete this recipe", 403);
  }

  const imagePath = recipe.image;
  await recipeDao.deleteRecipe(recipe);
  deleteImage(path.join(__dirname, "..", "uploads", imagePath));

  res.status(200).json({ message: "Recipe deleted successfully" });
};

const likeRecipe = async (req, res) => {
  const recipeId = req.params.id;
  const user = req.user;

  const recipe = await recipeDao.getRecipeByIdWithAuthorId(recipeId);
  if (!recipe) {
    throw new AppError("Recipe not found", 404);
  }

  await recipeDao.likeRecipe(recipe, user);
  await res.status(201).json({ message: "Recipe liked successfully" });
};

const unlikeRecipe = async (req, res) => {
  const recipeId = req.params.id;
  const authUserId = req.user?.id;

  await recipeDao.unlikeRecipe(recipeId, authUserId);
  res.status(201).json({ message: "Recipe unliked successfully" });
};

const getLikedRecipes = async (req, res) => {
  const { search } = req.query;
  const authUserId = req.user?.id;

  const recipes = await recipeDao.getUserLikedRecipes(authUserId, search);
  res.status(200).json(recipes);
};

module.exports = {
  createRecipe,
  updateRecipe,
  getRecipeById,
  getRecipes,
  deleteRecipe,
  likeRecipe,
  unlikeRecipe,
  getLikedRecipes,
};
