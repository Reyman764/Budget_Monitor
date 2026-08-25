'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SavingsGoal extends Model {
    static associate(models) {
      SavingsGoal.belongsTo(models.Household, { foreignKey: 'householdId' });
    }
  }

  SavingsGoal.init(
    {
      householdId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      goalName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      targetAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      currentAmount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
      },
      deadline: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'SavingsGoal'
    }
  );

  return SavingsGoal;
};
