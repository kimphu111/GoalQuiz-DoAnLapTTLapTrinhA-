require("dotenv").config();
// require('express-async-errors');
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const compression = require('compression');
const { default: helmet } = require('helmet');
const cookieParser = require('cookie-parser');
const router = require('../routes/authRoutes');
const { connectDB } = require('../database/database');
const errorHandler = require('../middleware/errorHandler');


//config
require('dotenv').config();



//init middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(compression());
app.use(helmet());
app.use(cookieParser());
app.use(express.json());

//init database
connectDB();

//init routes
app.use('/', router);
app.use('/api/auth', router);

//init handle error
app.use(errorHandler);

module.exports = app;