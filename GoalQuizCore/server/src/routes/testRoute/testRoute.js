const express = require("express");
const { validateAccessToken } = require("../../middlewares/validateAccessToken");
const { auth } = require("../../middlewares/auth");
const { authRoleTest } = require("../../controllers/testController");
const router = express.Router();
// const firstTestRoute = require('./firstTestRoute/firstTestRoute');
// const errorTestRoute = require('./errorTestRoute/errorTestRoute');
// const mongodbTestRoute = require('./mongodbTestRoute/mongodbTestRoute')
// const encryptionTestRoute = require('./encryptionTestRoute/encryptionTestRoute')

// router.use('/test',firstTestRoute);
// router.use('/test',errorTestRoute);
// router.use('/test',mongodbTestRoute);
// router.use('/test',encryptionTestRoute);

router.route('/test/testAuthRole').get(validateAccessToken,auth(["user","admin"]),authRoleTest);


module.exports = router;