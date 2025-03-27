const { literal, Op, fn, col } = require("sequelize");

const callDbHandler = require("../utils/callDbHandler");
const Recipe = require("../db/models/recipe");
const Ingredient = require("../db/models/ingredient");
const User = require("../db/models/user");
const Comment = require("../db/models/comment");
const Like = require("../db/models/like");

const getRecipeById = async (id, transaction) => {
  return await callDbHandler(() => Recipe.findByPk(id, { transaction }));
};

const getRecipeByIdWithAuthorId = async (id) => {
  return await callDbHandler(() =>
    Recipe.findByPk(id, {
      attributes: ["id", "name", "image"],
      include: [{ model: User, as: "author", attributes: ["id"] }],
    }),
  );
};

const getRecipeByIdWithAuthorAndIngredients = async (id) => {
  return await callDbHandler(() =>
    Recipe.findByPk(id, {
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
};

const createRecipe = async (recipeData, transaction) => {
  return await callDbHandler(() => Recipe.create(recipeData, { transaction }));
};

const updateRecipe = async (recipe, recipeData, transaction) => {
  return await callDbHandler(() => recipe.update(recipeData, { transaction }));
};

const deleteRecipe = async (recipe) => {
  await callDbHandler(() => recipe.destroy());
};

const countRecipeLikes = async (recipe) => {
  return await callDbHandler(() => recipe.countLikes());
};

const getRecipeComments = async (recipeId) => {
  return await callDbHandler(() =>
    Comment.findAll({
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "username"],
        },
      ],
      where: { recipeId },
      order: [["createdAt", "DESC"]],
    }),
  );
};

const likeRecipe = async (recipe, user) => {
  await callDbHandler(() => recipe.addLike(user));
};

const unlikeRecipe = async (recipeId, userId) => {
  await callDbHandler(() =>
    Like.destroy({
      where: { recipeId, userId },
    }),
  );
};

const isRecipeLikedByUser = async (recipe, userId) => {
  return await callDbHandler(() => recipe.hasLike(userId));
};

const getAllRecipes = async (search, following, ingredients, authUserId) => {
  return await callDbHandler(() =>
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
          model: User,
          as: "author",
          where: following.length ? { id: { [Op.in]: following } } : {},
        },
      ],
      where: {
        ...(search && { name: { [Op.iLike]: `%${search}%` } }),
        ...(ingredients.length && {
          [Op.and]: ingredients.map((ingredient) =>
            literal(
              `"recipe"."id" IN (
                SELECT "recipeId" FROM "ingredient" 
                WHERE "ingredient"."name" = '${ingredient}'
              )`,
            ),
          ),
        }),
      },
    }),
  );
};

const getUserRecipes = async (userId, authUserId) => {
  return await callDbHandler(() =>
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
      where: {
        authorId: userId,
      },
      order: [["createdAt", "DESC"]],
    }),
  );
};

const getUserLikedRecipes = async (userId, user, search) => {
  return await callDbHandler(() =>
    user.getLikedRecipes({
      ...Recipe.options.scopes.withAuthorAndLikesCount,
      attributes: {
        include: [
          [literal("true"), "isLiked"],
          [
            literal(
              `(SELECT COUNT(*) FROM "like" WHERE "like"."recipeId" = "recipe"."id")`,
            ),
            "likesCount",
          ],
        ],
      },
      joinTableAttributes: [],
      where: search ? { name: { [Op.iLike]: `%${search}%` } } : {},
    }),
  );
};

const createRecipeIngredients = async (ingredientsData, transaction) => {
  await callDbHandler(() =>
    Ingredient.bulkCreate(ingredientsData, { transaction }),
  );
};

const deleteRecipeIngredients = async (recipeId, transaction) => {
  await callDbHandler(() =>
    Ingredient.destroy({ where: { recipeId }, transaction }),
  );
};

const getAllRecipesUniqueIngredients = async () => {
  return await callDbHandler(() =>
    Ingredient.findAll({
      attributes: [[fn("DISTINCT", col("name")), "name"]],
      order: [["name", "ASC"]],
      raw: true,
    }),
  );
};

module.exports = {
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipeById,
  getRecipeByIdWithAuthorId,
  getRecipeByIdWithAuthorAndIngredients,
  countRecipeLikes,
  getRecipeComments,
  likeRecipe,
  unlikeRecipe,
  isRecipeLikedByUser,
  getAllRecipes,
  getUserRecipes,
  getUserLikedRecipes,
  createRecipeIngredients,
  deleteRecipeIngredients,
  getAllRecipesUniqueIngredients,
};
