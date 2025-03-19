"use strict";
const { DataTypes } = require("sequelize");

const { sequelize } = require("../../config/database");
const User = require("../models/user");
const Recipe = require("../models/recipe");

const Comment = sequelize.define(
  "comment",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    content: {
      allowNull: false,
      type: DataTypes.TEXT,
      validate: {
        notEmpty: {
          msg: "Comment cannot be empty",
        },
      },
    },
    authorId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    recipeId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    commentId: {
      type: DataTypes.INTEGER,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    updatedAt: false,
  },
);

Comment.belongsTo(User, {
  foreignKey: "authorId",
  as: "author",
});

Comment.belongsTo(Recipe, {
  foreignKey: "recipeId",
  as: "recipe",
});

Comment.belongsTo(Comment, {
  foreignKey: "commentId",
  as: "parent",
});

User.hasMany(Comment, {
  foreignKey: "authorId",
  as: "comments",
});

Recipe.hasMany(Comment, {
  foreignKey: "recipeId",
  as: "comments",
});

Comment.hasMany(Comment, {
  foreignKey: "commentId",
  as: "responses",
});

module.exports = Comment;
