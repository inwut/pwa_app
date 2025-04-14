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
const sendPushNotification = require("../utils/sendPushNotification");

const createRecipe = async (req, res) => {
  const { name, instructions, ingredients } = req.body;
  const userId = req.user.id;
  const imageFile = req.files?.image;

  await sequelize.transaction(async (t) => {
    const imagePath = imageFile ? generateUniqueImageName(imageFile) : null;

    const recipe = await recipeDao.createRecipe(
      { name, instructions, image: imagePath, authorId: userId },
      t,
    );

    const ingredientsData = ingredients.map((ingredient) => ({
      name: ingredient.name,
      amount: ingredient.amount,
      recipeId: recipe.id,
    }));

    await recipeDao.createRecipeIngredients(ingredientsData, t);

    if (imageFile) {
      await saveImage(imageFile, imagePath);
    }

    res.status(201).json({
      message: "Recipe created successfully",
      recipe,
    });
  });
};

const updateRecipe = async (req, res) => {
  const { name, instructions, ingredients, image } = req.body;
  const recipeId = req.params.id;
  const userId = req.user.id;
  const imageFile = req.files?.image;

  await sequelize.transaction(async (t) => {
    const recipe = await recipeDao.getRecipeById(recipeId, t);

    if (!recipe) {
      throw new AppError("Recipe not found", 404);
    }

    if (recipe.authorId !== userId) {
      throw new AppError(
        "You don't have permission to update this recipe",
        403,
      );
    }

    const oldImagePath = recipe.image;
    let imagePath = null;

    if (imageFile) {
      if (oldImagePath) {
        imagePath = recipe.image;
      } else {
        imagePath = generateUniqueImageName(imageFile);
      }
    }

    const updatedRecipe = await recipeDao.updateRecipe(
      recipe,
      {
        name,
        instructions,
        image: image ? image : imagePath,
      },
      t,
    );

    await recipeDao.deleteRecipeIngredients(recipeId, t);

    const ingredientsData = ingredients.map((ing) => ({
      name: ing.name,
      amount: ing.amount,
      recipeId,
    }));

    await recipeDao.createRecipeIngredients(ingredientsData, t);

    if (imageFile) {
      await saveImage(imageFile, imagePath);
    } else if (!image && oldImagePath) {
      deleteImage(path.join(__dirname, "..", "uploads", oldImagePath));
    }

    res.status(200).json({
      message: "Recipe updated successfully",
      recipe: updatedRecipe,
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

  return responseData.map(({ commentId, recipeId, responses, ...rest }) => ({
    ...rest,
    responses: responses
      .map(({ commentId, recipeId, responses, ...rest }) => ({ ...rest }))
      .sort((a, b) => a.id - b.id),
  }));
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
      image: recipe.image ? recipe.image : null,
      likesCount,
      commentsCount: comments.length,
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

const getRecipeByIdToEdit = async (req, res) => {
  const recipeId = req.params.id;
  const authUserId = req.user.id;

  const recipe =
    await recipeDao.getRecipeByIdWithAuthorAndIngredients(recipeId);

  if (!recipe) {
    throw new AppError("Recipe not found", 404);
  }

  if (recipe.author.id !== authUserId) {
    throw new AppError("You don't have permission to update this recipe", 403);
  }

  let responseData = {
    recipe: {
      ...recipe.toJSON(),
      image: recipe.image ? recipe.image : null,
    },
  };

  res.status(200).json(responseData);
};

const getRecipes = async (req, res) => {
  const { search, onlyFollowing, ingredients, limit, offset } = req.query;
  const authUserId = req.user?.id;

  const ingredientsArray = ingredients ? ingredients.split(",") : [];

  let followedUsersIds = [];
  if (onlyFollowing === "true" && authUserId) {
    const subscriptions = await userDao.getUserFollowingIds(authUserId);
    followedUsersIds = subscriptions.map((sub) => sub.userId);

    if (followedUsersIds.length === 0) {
      return res.status(200).json([]);
    }
  }

  const recipes = await recipeDao.getAllRecipes(
    search,
    followedUsersIds,
    ingredientsArray,
    limit,
    offset,
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
  if (imagePath) {
    deleteImage(path.join(__dirname, "..", "uploads", imagePath));
  }

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

  if (recipe.author.id !== user.id) {
    await sendPushNotification(recipe.author.id, {
      title: "Someone liked your recipe",
      body: `@${user.username} liked your recipe "${recipe.name}"`,
      data: {
        url: `/recipes/${recipe.id}`,
      },
    });
  }

  res.status(201).json({ message: "Recipe liked successfully" });
};

const unlikeRecipe = async (req, res) => {
  const recipeId = req.params.id;
  const authUserId = req.user?.id;

  const recipe = await recipeDao.getRecipeByIdWithAuthorId(recipeId);
  if (!recipe) {
    throw new AppError("Recipe not found", 404);
  }

  await recipeDao.unlikeRecipe(recipeId, authUserId);
  res.status(200).json({ message: "Recipe unliked successfully" });
};

const getLikedRecipes = async (req, res) => {
  const { search, limit, offset } = req.query;
  const authUserId = req.user?.id;

  const recipes = await recipeDao.getUserLikedRecipes(
    authUserId,
    req.user,
    search,
    limit,
    offset,
  );
  res.status(200).json(recipes);
};

const getAllRecipesUniqueIngredients = async (req, res) => {
  const ingredients = await recipeDao.getAllRecipesUniqueIngredients();
  res.status(200).json(ingredients);
};

module.exports = {
  createRecipe,
  updateRecipe,
  getRecipeById,
  getRecipeByIdToEdit,
  getRecipes,
  deleteRecipe,
  likeRecipe,
  unlikeRecipe,
  getLikedRecipes,
  getAllRecipesUniqueIngredients,
};
