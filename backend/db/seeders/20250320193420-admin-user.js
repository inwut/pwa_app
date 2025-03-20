"use strict";

const { hash } = require("bcrypt");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await hash(process.env.ADMIN_PASSWORD, 10);
    await queryInterface.bulkInsert("user", [
      {
        role: "admin",
        username: "admin",
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("user", { role: "admin" }, {});
  },
};
