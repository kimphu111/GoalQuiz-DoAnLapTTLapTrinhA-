const express = require("express");
const router = express.Router();
const testRoute = require('./testRoute/testRoute')
const userRoute = require('./userRoute/userRoute')
const quizRoute = require('./quizRoute/quizRoute')

router.use('/api',userRoute);
router.use('/api',testRoute);
router.use('/api',quizRoute);

module.exports = router;