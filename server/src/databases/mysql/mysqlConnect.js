const { Sequelize } = require('sequelize');

// console.log(process.env.MYSQL_NAME,process.env.MYSQL_USER,process.env.MYSQL_PASSWORD);


const sequelize = new Sequelize(
    process.env.MYSQL_NAME,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    {
      host: process.env.MYSQL_HOST,
      dialect: 'mysql',
      logging: false,
    }
);

const mysqlConnect = async () => {
    try {
      await sequelize.authenticate();
      console.log('mysql connected');
      await sequelize.sync({ alter: false, force: false  });
    } catch (error) {
      console.error('Unable to connect to the database:', error);
      process.exit(1);
    }
};

module.exports = {sequelize, mysqlConnect}