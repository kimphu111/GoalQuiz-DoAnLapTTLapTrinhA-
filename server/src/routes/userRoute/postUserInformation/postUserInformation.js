const express = require("express");
const { validateAccessToken } = require("../../../middlewares/validateAccessToken");
const { postUserInformation } = require("../../../controllers/userController");


const router = express.Router();

router.route('/postUserInformation').post(validateAccessToken,postUserInformation);




module.exports = router;