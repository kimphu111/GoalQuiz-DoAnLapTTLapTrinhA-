// server/src/models/Quiz.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');

const Quiz = sequelize.define('Quiz', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users', // Liên kết với table Users
      key: 'id',
    },
  },
});

module.exports = Quiz;