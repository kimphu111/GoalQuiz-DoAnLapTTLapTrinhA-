const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');

const User = sequelize.define('User',{
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    role:{
        type: DataTypes.ENUM(
            'admin',
            'user',
        ),
        allowNull:false,
        defaultValue: 'user',
    }

})

module.exports = User;