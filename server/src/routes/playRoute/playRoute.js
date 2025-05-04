const express = require("express");
const { postPlayerResult, getTopUsersByLevel, review } = require("../../controllers/playerResultController");
const { validateAccessToken } = require("../../middlewares/validateAccessToken");
const { auth } = require("../../middlewares/auth");


const router = express.Router();
// public
router.route('/play/postPlayerResult').post(validateAccessToken,postPlayerResult);
router.route('/play/leaderboard/:level').get(getTopUsersByLevel);

// private
router.route('/play/review').get(validateAccessToken,auth(["user"]),review);



module.exports = router;