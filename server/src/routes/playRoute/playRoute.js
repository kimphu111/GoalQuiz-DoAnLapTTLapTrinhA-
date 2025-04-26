const express = require("express");
const { postPlayerResult } = require("../../controllers/playerResultController");
const { validateAccessToken } = require("../../middlewares/validateAccessToken");


const router = express.Router();
// private
router.route('/play/postPlayerResult').post(validateAccessToken,postPlayerResult);




module.exports = router;