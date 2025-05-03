const { DataTypes, UUIDV4 } = require('sequelize');
const { sequelize } = require('../databases/mysql/mysqlConnect');
const User = require('./userModel');


const PlayerResult = sequelize.define('PlayerResult', {
  id: {
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
  },
  idQuestion: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  idUser: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  chooseAnswer: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  result: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  dateDoQuiz: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quizLevel: {
    type: DataTypes.ENUM('easy', 'medium', 'hard','mix'),
    allowNull: false,
  }
}, {
  tableName: 'playerresult',
  timestamps: true,
});

PlayerResult.belongsTo(User, { foreignKey: 'idUser', targetKey: 'id' });


module.exports = PlayerResult;