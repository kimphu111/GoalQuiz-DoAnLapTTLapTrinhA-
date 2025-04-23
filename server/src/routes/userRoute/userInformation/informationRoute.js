const express = require('express');
const router = express.Router();
const { updateUserInformation, getUserInformation } = require('../../../controllers/userController'); // Sửa đường dẫn
const { authMiddleware } = require('../../../middlewares/auth'); // Sửa đường dẫn

router.route('/userInformation')
  .get(authMiddleware, getUserInformation)
  .post(authMiddleware, updateUserInformation);

module.exports = router;