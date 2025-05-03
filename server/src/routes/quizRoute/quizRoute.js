const express = require("express");
const { getEasyQuiz,getMediumQuiz,getHardQuiz,getMixQuiz,searchQuizByQuestionAndAnswer, postQuiz, getAllQuiz, updateQuiz, deleteQuiz } = require("../../controllers/quizController");
const { auth } = require("../../middlewares/auth");
const { validateAccessToken } = require("../../middlewares/validateAccessToken");
const upload = require("../../middlewares/uploadImage");

const router = express.Router();
// public
router.route('/quiz/getEasyQuiz').get(getEasyQuiz);
router.route('/quiz/getMediumQuiz').get(getMediumQuiz);
router.route('/quiz/getHardQuiz').get(getHardQuiz);
router.route('/quiz/getMixQuiz').get(getMixQuiz);

// private admin
router.route('/quiz/searchQuizByQuestionAndAnswer').get(validateAccessToken,auth(["admin"]),searchQuizByQuestionAndAnswer);
router.route('/quiz/postQuiz').post(validateAccessToken,auth(["admin"]),upload.single('quiz_image'),postQuiz);
router.route('/quiz/getAllQuiz').get(validateAccessToken,auth(["admin"]),getAllQuiz);
router.route('/quiz/updateQuiz').put(validateAccessToken,auth(["admin"]),upload.single('quiz_image'),updateQuiz);
router.route('/quiz/deleteQuiz/:id').delete(validateAccessToken,auth(["admin"]),deleteQuiz);



module.exports = router;