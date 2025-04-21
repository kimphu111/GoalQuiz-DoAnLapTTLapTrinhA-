const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const { authMiddleware,adminMiddleware} = require('../middleware/authMiddleware');
const UserInformation = require('../models/User');
const User = require('../models/User');


router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/logout', authMiddleware, userController.logout);

router.get('/profile', authMiddleware, userController.getUserProfile);
router.post('/profile', authMiddleware, userController.updateUserProfile);

router.post('/refresh-token', userController.refreshToken);

router.get('/admin-only', authMiddleware, adminMiddleware, (req, res) =>{
    res.status(200).json({ message: 'welcome to admin only route'});
})

// router.get('/me', authMiddleware, authController.getMe);
// router.get('/admin', authMiddleware, adminMiddleware, authController.adminRoute);
// router.get('/user', authMiddleware, authController.userRoute);

module.exports = router;