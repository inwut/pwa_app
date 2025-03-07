'use strict';
const {  DataTypes} = require('sequelize');
const { sequelize } = require('../../config/database');
const user = require('../models/user');
const recipe = require('../models/recipe');

const comment = sequelize.define('comment', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  content: {
    allowNull: false,
    type: DataTypes.TEXT,
    validate: {
      notEmpty: {
        msg: 'Comment cannot be empty'
      }
    }
  },
  authorId: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  recipeId: {
    type: DataTypes.INTEGER,
  },
  commentId: {
    type: DataTypes.INTEGER,
  },
}, {
  freezeTableName: true,
  timestamps: true,
  updatedAt: false
});

comment.belongsTo(user, {
  foreignKey: 'authorId',
  as: 'author',
});

comment.belongsTo(recipe, {
  foreignKey: 'recipeId',
  as: 'recipe',
});

comment.belongsTo(comment, {
  foreignKey: 'commentId',
  as: 'responseToComment',
});

user.hasMany(comment, {
  foreignKey: 'authorId',
  as: 'comments',
});

recipe.hasMany(comment, {
  foreignKey: 'recipeId',
  as: 'comments'
});

comment.hasMany(comment, {
  foreignKey: 'commentId',
  as: 'responses'
});

module.exports = comment;