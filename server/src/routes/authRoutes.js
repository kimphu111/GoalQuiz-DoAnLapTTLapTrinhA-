const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const { authMiddleware,admninMiddleware} = require('../middleware/authMiddleware');


router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/logout', authMiddleware, userController.logout);

router.get('/profile', authMiddleware, userController.getUserProfile);
router.post('/refresh-token', userController.refreshToken);

router.get('/admin-only', authMiddleware, admninMiddleware, (req, res) =>{
    res.status(200).json({ message: 'welcome to admin only route'});
})

// router.get('/me', authMiddleware, authController.getMe);
// router.get('/admin', authMiddleware, adminMiddleware, authController.adminRoute);
// router.get('/user', authMiddleware, authController.userRoute);

module.exports = router;