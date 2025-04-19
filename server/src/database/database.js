const { Sequelize } = require('sequelize');
require('dotenv').config();
const { User, UserInformation } = require('../models/User');
// console.log('DB_NAME:', process.env.DB_NAME);
// console.log('DB_USER:', process.env.DB_USER);
// console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
// console.log('DB_HOST:', process.env.DB_HOST);

// Kiểm tra các biến môi trường trước khi kết nối
if (!process.env.DB_NAME || !process.env.DB_USER || !process.env.DB_HOST) {
  console.error('Lỗi: Thiếu các biến môi trường DB_NAME, DB_USER hoặc DB_HOST');
  process.exit(1);
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
  }
);


const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Kết nối MySQL thành công!');
    await sequelize.sync({ alter: false });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB, User, UserInformation };