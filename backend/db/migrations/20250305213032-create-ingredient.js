'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ingredient', {
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
      amount: {
        allowNull: false,
        type: Sequelize.STRING
      },
      recipeId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'recipe',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      }
    });
    await queryInterface.addIndex('ingredient', ['name']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ingredient');
  }
};