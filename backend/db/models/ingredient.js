'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const recipe = require('../models/recipe');

const ingredient = sequelize.define('ingredient', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING,
    validate: {
      notEmpty: {
        msg: 'Name cannot be empty'
      }
    }
  },
  amount: {
    allowNull: false,
    type: DataTypes.STRING,
    validate: {
      notEmpty: {
        msg: 'Name cannot be empty'
      }
    }
  },
  recipeId: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: recipe,
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  }
}, {
  freezeTableName: true,
  timestamps: false,
});

recipe.hasMany(ingredient, {
  foreignKey: 'recipeId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  as: 'ingredients'
});

ingredient.belongsTo(recipe, {
  foreignKey: 'recipeId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  as: 'recipe'
});

module.exports = ingredient;