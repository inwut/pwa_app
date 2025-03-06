'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('like', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'recipe',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
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

    await queryInterface.addConstraint('like', {
      fields: ['userId', 'recipeId'],
      type: 'unique',
      name: 'unique_like'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('like');
  }
};