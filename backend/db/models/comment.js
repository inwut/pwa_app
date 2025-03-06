'use strict';
const {  DataTypes} = require('sequelize');
const sequelize = require('../../config/database');
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
    references: {
      model: 'user',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  recipeId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'recipe',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  commentId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'comment',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
}, {
  freezeTableName: true,
  timestamps: true,
  updatedAt: false
});

comment.belongsTo(user, {
  foreignKey: 'authorId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  as: 'author',
});

comment.belongsTo(recipe, {
  foreignKey: 'recipeId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  as: 'recipe',
});

comment.belongsTo(comment, {
  foreignKey: 'commentId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  as: 'responseToComment',
});

user.hasMany(comment, {
  foreignKey: 'authorId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  as: 'comments',
});

recipe.hasMany(comment, {
  foreignKey: 'recipeId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  as: 'comments'
});

comment.hasMany(comment, {
  foreignKey: 'commentId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  as: 'responses'
});

module.exports = comment;