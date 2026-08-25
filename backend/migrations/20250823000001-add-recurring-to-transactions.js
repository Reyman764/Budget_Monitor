'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Transactions', 'isRecurring', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });

    // Day of month the bill is typically due (1-31). Null for non-recurring.
    await queryInterface.addColumn('Transactions', 'recurringDay', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Transactions', 'recurringDay');
    await queryInterface.removeColumn('Transactions', 'isRecurring');
  }
};
