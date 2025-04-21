const { DataTypes, UUIDV4 } = require('sequelize');
const { sequelize } = require('../databases/mysql/mysqlConnect');

const Quiz = sequelize.define('quizzes', {
    id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    level: {
        type: DataTypes.ENUM('easy', 'medium', 'hard'),
        allowNull: false,
    },
    question: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    answerA: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    answerB: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    answerC: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    answerD: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    correctAnswer: {
        type: DataTypes.ENUM('A', 'B', 'C', 'D'),
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    score: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    }
});

module.exports = Quiz;