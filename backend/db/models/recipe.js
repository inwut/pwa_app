'use strict';
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');
const user = require('../models/user');

const recipe = sequelize.define('recipe', {
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
  instructions: {
    allowNull: false,
    type: DataTypes.TEXT,
    validate: {
      notEmpty: {
        msg: 'Instructions cannot be empty'
      }
    }
  },
  image: {
    type: DataTypes.STRING
  },
  authorId: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
}, {
  freezeTableName: true,
  timestamps: true,
  updatedAt: false
});

user.hasMany(recipe, {
  foreignKey: 'authorId',
  as: 'recipes',
});
recipe.belongsTo(user, {
  foreignKey: 'authorId',
  as: 'author'
});

user.belongsToMany(recipe, {
  through: 'like',
  foreignKey: 'userId',
  otherKey: 'recipeId',
  as: 'likedRecipes',
  timestamps: false,
});

recipe.belongsToMany(user, {
  through: 'like',
  foreignKey: 'recipeId',
  otherKey: 'userId',
  as: 'likes',
  timestamps: false,
});

module.exports = recipe;