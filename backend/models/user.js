'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsToMany(models.Household, { through: 'HouseholdUsers' });
      User.hasMany(models.Transaction, { foreignKey: 'recordedBy' });
    }
  }

  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false
      },
      resetTokenHash: {
        type: DataTypes.STRING,
        allowNull: true
      },
      resetTokenExpiresAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'User'
    }
  );

  return User;
};
