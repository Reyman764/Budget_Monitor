'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
      Transaction.belongsTo(models.Household, { foreignKey: 'householdId' });
      Transaction.belongsTo(models.User, { foreignKey: 'recordedBy' });
    }
  }

  Transaction.init(
    {
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      type: {
        type: DataTypes.ENUM('income', 'expense'),
        allowNull: false
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Other'
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      recordedBy: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      householdId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('pending', 'confirmed'),
        defaultValue: 'confirmed'
      },
      isRecurring: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      recurringDay: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      // True only for the auto-generated "Remaining of previous month" entry
      // created on the 1st of each month — lets us find/avoid duplicating it
      // without relying on matching description text.
      isCarryOver: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    },
    {
      sequelize,
      modelName: 'Transaction',
      indexes: [
        { fields: ['householdId'] },
        { fields: ['date'] },
        { fields: ['type'] },
        { fields: ['category'] },
        { fields: ['isCarryOver'] }
      ]
    }
  );

  return Transaction;
};
