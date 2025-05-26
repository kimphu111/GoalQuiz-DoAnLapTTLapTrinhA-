const express = require("express");
const { postPlayerResult, getTopUsersByLevel, review, getAllPlayerResult, queryPlayerQuiz } = require("../../controllers/playerResultController");
const { validateAccessToken } = require("../../middlewares/validateAccessToken");
const { auth } = require("../../middlewares/auth");


const router = express.Router();
// public
router.route('/play/postPlayerResult').post(validateAccessToken,postPlayerResult);
router.route('/play/leaderboard/:level').get(getTopUsersByLevel);

// private
router.route('/play/review').get(validateAccessToken,auth(["user"]),review);
router.route('/play/getAllPlayerResult').get(validateAccessToken,auth(["admin"]),getAllPlayerResult);
router.route('/play/queryPlayerQuiz').post(validateAccessToken,auth(["admin"]),queryPlayerQuiz);



module.exports = router;