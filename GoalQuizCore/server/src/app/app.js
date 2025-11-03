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

// test

// config
require('express-async-handler')

// init middlewares
app.use(cors({
    origin: ['http://localhost:3000','http://localhost:8000','http://localhost:4200','http://localhost:4000'],
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

//Phu code them cho phan frontend
app.use(express.static('public'));

// init databases
// init databases, cloud

mysqlConnect();

// init routes
app.use('/',router);

// init error handler
app.use(errorHandler);


module.exports = app;