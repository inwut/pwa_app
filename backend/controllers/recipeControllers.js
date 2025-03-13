const AppError = require("../utils/appError");
const callDbHandler = require("../utils/callDbHandler");
const Recipe = require("../db/models/recipe");
const Ingredient = require("../db/models/ingredient");
const User = require("../db/models/user");
const Comment = require("../db/models/comment");
const Subscription = require("../db/models/subscription");
const Like = require("../db/models/like");
const { literal, Op } = require("sequelize");

const getCommentsByRecipeId = async (recipeId) => {
  const comments = await callDbHandler(() =>
    Comment.scope("withAuthor").findAll({
      attributes: ["commentId", "recipeId"],
      where: { recipeId },
    }),
  );

  const plainComments = comments.map((c) => c.toJSON());
  if (!plainComments.length) return [];

  const commentMap = new Map();
  const topLevelComments = [];

  plainComments.forEach((comment) => {
    comment.responses = [];
    commentMap.set(comment.id, comment);
    if (!comment.commentId) {
      topLevelComments.push(comment);
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

  const cleanData = (comments) =>
    comments.map(({ commentId, recipeId, responses, ...rest }) => ({
      ...rest,
      responses: cleanData(responses),
    }));

  return cleanData(topLevelComments);
};

const getRecipeById = async (req, res) => {
  const recipeId = req.params.id;
  const authUserId = req.user?.id;

  const recipe = await callDbHandler(() =>
    Recipe.findByPk(recipeId, {
      attributes: ["id", "name", "instructions", "image", "createdAt"],
      include: [
        {
          model: Ingredient,
          as: "ingredients",
          attributes: ["id", "name", "amount"],
        },
        {
          model: User,
          as: "author",
          attributes: ["id", "username"],
        },
      ],
    }),
  );

  if (!recipe) {
    throw new AppError("Recipe not found", 404);
  }

  const likesCount = await callDbHandler(() => recipe.countLikes());
  const commentsWithResponses = await getCommentsByRecipeId(recipeId);

  let responseData = {
    recipe: {
      ...recipe.toJSON(),
      likesCount,
      comments: commentsWithResponses,
    },
  };

  if (authUserId) {
    responseData.recipe.isLiked = await callDbHandler(() =>
      recipe.hasLike(authUserId),
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
    const subscriptions = await callDbHandler(() =>
      Subscription.findAll({
        attributes: ["userId"],
        where: { subscriberId: authUserId },
      }),
    );
    followedUsersIds = subscriptions.map((sub) => sub.userId);
    if (followedUsersIds.length === 0) {
      return res.status(200).json([]);
    }
  }

  const recipes = await callDbHandler(() =>
    Recipe.scope("withAuthorAndLikesCount").findAll({
      attributes: [
        authUserId
          ? [
              literal(
                `EXISTS (SELECT 1 FROM "like" 
                  WHERE "like"."recipeId" = "recipe"."id" 
                  AND "like"."userId" = ${authUserId})`,
              ),
              "isLiked",
            ]
          : [literal("false"), "isLiked"],
      ],
      include: [
        {
          model: Ingredient,
          as: "ingredients",
          attributes: [],
          where: ingredientsArray.length
            ? { name: { [Op.in]: ingredientsArray } }
            : {},
          required: ingredientsArray.length > 0,
        },
        {
          model: User,
          as: "author",
          where: followedUsersIds.length
            ? { id: { [Op.in]: followedUsersIds } }
            : {},
        },
      ],
      where: search ? { name: { [Op.iLike]: `%${search}%` } } : {},
    }),
  );

  res.status(200).json(recipes);
};

const deleteRecipe = async (req, res) => {
  const recipeId = req.params.id;
  const authUserId = req.user?.id;
  const isAdmin = req.user?.role === "admin";

  const recipe = await callDbHandler(() =>
    Recipe.findByPk(recipeId, {
      include: [{ model: User, as: "author", attributes: ["id"] }],
    }),
  );

  if (!recipe) {
    throw new AppError("Recipe not found", 404);
  }

  if (recipe.author.id !== authUserId && !isAdmin) {
    throw new AppError("You don't have permission to delete this recipe", 403);
  }

  await callDbHandler(() => recipe.destroy());

  res.status(200).json({ message: "Recipe deleted successfully" });
};

const likeRecipe = async (req, res) => {
  const recipeId = req.params.id;
  const user = req.user;

  const recipe = await callDbHandler(() =>
    Recipe.findByPk(recipeId, {
      include: {
        model: User,
        as: "author",
        attributes: ["id", "username"], // для пушів
      },
    }),
  );

  if (!recipe) {
    throw new AppError("Recipe not found", 404);
  }

  await callDbHandler(() => recipe.addLike(user));

  await res.status(201).json({ message: "Recipe liked successfully" });
};

const unlikeRecipe = async (req, res) => {
  const recipeId = req.params.id;
  const authUserId = req.user?.id;

  await callDbHandler(() =>
    Like.destroy({
      where: { recipeId, userId: authUserId },
    }),
  );

  res.status(201).json({ message: "Recipe unliked successfully" });
};

const getLikedRecipes = async (req, res) => {
  const { search } = req.query;
  const authUserId = req.user?.id;

  const recipes = await callDbHandler(() =>
    Recipe.scope("withAuthorAndLikesCount").findAll({
      include: [
        {
          model: User,
          as: "likes",
          where: { id: authUserId },
        },
      ],
      where: search ? { name: { [Op.iLike]: `%${search}%` } } : {},
    }),
  );

  res.status(200).json(recipes);
};

module.exports = {
  getRecipeById,
  getRecipes,
  deleteRecipe,
  likeRecipe,
  unlikeRecipe,
  getLikedRecipes,
};
