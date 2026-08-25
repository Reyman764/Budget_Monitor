'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Household extends Model {
    static associate(models) {
      Household.belongsToMany(models.User, { through: 'HouseholdUsers' });
      Household.hasMany(models.Transaction, { foreignKey: 'householdId' });
      Household.hasMany(models.BudgetLimit, { foreignKey: 'householdId' });
      Household.hasMany(models.SavingsGoal, { foreignKey: 'householdId' });
    }
  }

  Household.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      currency: {
        type: DataTypes.STRING,
        defaultValue: 'NPR'
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      inviteCode: {
        type: DataTypes.STRING,
        unique: true
      }
    },
    {
      sequelize,
      modelName: 'Household'
    }
  );

  return Household;
};
