const express = require("express");
const { getEasyQuiz,getMediumQuiz,getHardQuiz,getMixQuiz } = require("../../controllers/quizController");

const router = express.Router();
// public
router.route('/quiz/getEasyQuiz').get(getEasyQuiz);
router.route('/quiz/getMediumQuiz').get(getMediumQuiz);
router.route('/quiz/getHardQuiz').get(getHardQuiz);
router.route('/quiz/getMixQuiz').get(getMixQuiz);

module.exports = router;