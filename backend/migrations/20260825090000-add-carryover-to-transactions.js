'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Transactions', 'isCarryOver', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });
    await queryInterface.addIndex('Transactions', ['isCarryOver']);
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('Transactions', ['isCarryOver']);
    await queryInterface.removeColumn('Transactions', 'isCarryOver');
  }
};
