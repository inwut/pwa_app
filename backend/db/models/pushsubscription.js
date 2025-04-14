"use strict";
const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/database");
const User = require("../models/user");

const PushSubscription = sequelize.define(
  "pushSubscription",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    endpoint: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    p256dh: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    auth: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  },
);

PushSubscription.belongsTo(User, {
  foreignKey: "userId",
});

module.exports = PushSubscription;
