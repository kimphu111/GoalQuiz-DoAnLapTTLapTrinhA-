const express = require("express");
const { validateAccessToken } = require("../../../middlewares/validateAccessToken");
const { postUserInformation } = require("../../../controllers/userController");
const upload = require("../../../middlewares/uploadAvatar");


const router = express.Router();

router.route('/userInformation').post(validateAccessToken,upload.single('avatar'),postUserInformation);




module.exports = router;