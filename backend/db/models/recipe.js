"use strict";
const { DataTypes, col, literal } = require("sequelize");
const { sequelize } = require("../../config/database");
const User = require("../models/user");

const Recipe = sequelize.define(
  "recipe",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Name cannot be empty",
        },
      },
    },
    instructions: {
      allowNull: false,
      type: DataTypes.TEXT,
      validate: {
        notEmpty: {
          msg: "Instructions cannot be empty",
        },
      },
    },
    image: {
      type: DataTypes.STRING,
    },
    authorId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    updatedAt: false,
  },
);

User.hasMany(Recipe, {
  foreignKey: "authorId",
  as: "createdRecipes",
});

Recipe.belongsTo(User, {
  foreignKey: "authorId",
  as: "author",
});

User.belongsToMany(Recipe, {
  through: "like",
  foreignKey: "userId",
  otherKey: "recipeId",
  as: "likedRecipes",
  timestamps: false,
});

Recipe.belongsToMany(User, {
  through: "like",
  foreignKey: "recipeId",
  otherKey: "userId",
  as: "likes",
  timestamps: false,
});

Recipe.addScope("withAuthorAndLikesCount", {
  attributes: [
    "id",
    "name",
    "image",
    [
      literal(
        `(SELECT COUNT(*) FROM "like" WHERE "like"."recipeId" = "recipe"."id")`,
      ),
      "likesCount",
    ],
  ],
  include: [
    {
      model: User,
      as: "author",
      attributes: ["id", "username"],
    },
  ],
  order: [
    [col("likesCount"), "DESC"],
    ["id", "ASC"],
  ],
});

module.exports = Recipe;
