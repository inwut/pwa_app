'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('comment', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      content: {
        allowNull: false,
        type: Sequelize.TEXT
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
      recipeId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'recipe',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      commentId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'comment',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addConstraint('comment', {
      fields: ['recipeId', 'commentId'],
      type: 'check',
      where: {
        [Sequelize.Op.or]: [
          { commentId: { [Sequelize.Op.is]: null } },
          { recipeId: { [Sequelize.Op.is]: null } }
        ]
      },
      name: 'check_recipe_or_response'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('comment');
  }
};