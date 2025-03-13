"use strict";
const { sequelize } = require("../../config/database");

const Like = sequelize.define(
  "like",
  {},
  {
    freezeTableName: true,
    timestamps: false,
  },
);

module.exports = Like;
