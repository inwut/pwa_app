"use strict";
const { DataTypes, literal } = require("sequelize");
const { sequelize } = require("../../config/database");
const Subscription = require("../models/subscription");

const User = sequelize.define(
  "user",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    role: {
      allowNull: false,
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
    },
    username: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Username cannot be empty",
        },
      },
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: {
          msg: "Incorrect email address",
        },
      },
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  },
);

User.belongsToMany(User, {
  through: Subscription,
  foreignKey: "userId",
  otherKey: "subscriberId",
  as: "subscribers",
});

User.belongsToMany(User, {
  through: Subscription,
  foreignKey: "subscriberId",
  otherKey: "userId",
  as: "subscriptions",
});

User.addScope("withLikesAndFollowersCount", {
  attributes: [
    "id",
    "username",
    [
      literal(
        `(SELECT COUNT(*) FROM "recipe" WHERE "recipe"."authorId" = "user"."id")`,
      ),
      "recipeCount",
    ],
    [
      literal(
        `(SELECT COUNT(*) FROM "subscription" WHERE "subscription"."userId" = "user"."id")`,
      ),
      "followersCount",
    ],
  ],
});

module.exports = User;
