"use strict";
const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/database");
const Recipe = require("../models/recipe");

const Ingredient = sequelize.define(
  "ingredient",
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
    amount: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Name cannot be empty",
        },
      },
    },
    recipeId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  },
);

Recipe.hasMany(Ingredient, {
  foreignKey: "recipeId",
  as: "ingredients",
});

Ingredient.belongsTo(Recipe, {
  foreignKey: "recipeId",
  as: "recipe",
});

module.exports = Ingredient;
