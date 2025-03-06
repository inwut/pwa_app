'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
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
    references: {
      model: user,
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
}, {
  freezeTableName: true,
  timestamps: true,
  updatedAt: false
});

user.hasMany(recipe, {foreignKey: 'authorId', onDelete: 'CASCADE', onUpdate: 'CASCADE'});
recipe.belongsTo(user, {foreignKey: 'authorId', onDelete: 'CASCADE', onUpdate: 'CASCADE'});

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