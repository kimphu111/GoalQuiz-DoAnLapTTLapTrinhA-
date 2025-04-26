const express = require("express");
const { postPlayerResult, getTopUsersByLevel } = require("../../controllers/playerResultController");
const { validateAccessToken } = require("../../middlewares/validateAccessToken");


const router = express.Router();
// private
router.route('/play/postPlayerResult').post(validateAccessToken,postPlayerResult);
router.route('/play/leaderboard/:level').get(getTopUsersByLevel);




module.exports = router;