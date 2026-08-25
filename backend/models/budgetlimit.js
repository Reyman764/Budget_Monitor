'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BudgetLimit extends Model {
    static associate(models) {
      BudgetLimit.belongsTo(models.Household, { foreignKey: 'householdId' });
    }
  }

  BudgetLimit.init(
    {
      householdId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false
      },
      limitAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      month: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'BudgetLimit'
    }
  );

  return BudgetLimit;
};
