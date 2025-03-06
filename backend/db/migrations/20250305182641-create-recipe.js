'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('recipe', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      instructions: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      image: {
        type: Sequelize.STRING
      },
      authorId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'user',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('recipe');
  }
};