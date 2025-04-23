const { DataTypes } = require('sequelize');
const { sequelize } = require('../databases/mysql/mysqlConnect');

const UserInformation = sequelize.define('UserInformation', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = UserInformation;