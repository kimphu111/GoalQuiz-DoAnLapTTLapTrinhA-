require("dotenv").config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const compression = require('compression');
const { default: helmet } = require('helmet');
const cookieParser = require('cookie-parser');
const router = require('../routes/mainRoute');
const { mysqlConnect } = require('../databases/mysql/mysqlConnect');
const errorHandler = require('../middlewares/errorHandler');

const informationRoute = require('../routes/userRoute/userInformation/informationRoute');

// config
require('express-async-handler')

// init middlewares
app.use(cors({
    origin: ['http://localhost:3000','http://localhost:8000','http://localhost:4200','http://localhost:4000','http://localhost:8000','http://localhost:5500'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(compression());
app.use(helmet());
app.use(cookieParser());

// init databases
mysqlConnect();

// init routes
app.use('/',router);
app.use('/api/users', informationRoute); // Đăng ký informationRoute với tiền tố /api/users

// init error handler
app.use(errorHandler);


module.exports = app;