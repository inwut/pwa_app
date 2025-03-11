"use strict";
const { sequelize } = require("../../config/database");

const AppError = require("../../utils/appError");

const Subscription = sequelize.define(
  "subscription",
  {},
  {
    freezeTableName: true,
    timestamps: true,
    updatedAt: false,
    validate: {
      userNotSameAsSubscriber() {
        if (this.userId === this.subscriberId) {
          throw new AppError("A user cannot subscribe to themselves", 400);
        }
      },
    },
  },
);

module.exports = Subscription;
