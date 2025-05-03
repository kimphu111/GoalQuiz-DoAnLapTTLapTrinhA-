const express = require("express");
const { getEasyQuiz,getMediumQuiz,getHardQuiz,getMixQuiz,searchQuizByQuestionAndAnswer } = require("../../controllers/quizController");
const { auth } = require("../../middlewares/auth");
const { validateAccessToken } = require("../../middlewares/validateAccessToken");

const router = express.Router();
// public
router.route('/quiz/getEasyQuiz').get(getEasyQuiz);
router.route('/quiz/getMediumQuiz').get(getMediumQuiz);
router.route('/quiz/getHardQuiz').get(getHardQuiz);
router.route('/quiz/getMixQuiz').get(getMixQuiz);

// private
router.route('/quiz/searchQuizByQuestionAndAnswer').get(validateAccessToken,auth(["admin"]),searchQuizByQuestionAndAnswer);



module.exports = router;