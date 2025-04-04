const express = require('express');
const router = express.Router();
const authController = require('../controller/authControllerr');
const { authMiddleware,admninMiddleware} = require('../middleware/authMiddleware');


router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authMiddleware, authController.logout);

router.get('/admin-only', authMiddleware, admninMiddleware, (req, res) =>{
    res.status(200).json({ message: 'welcome to admin only route'});
})

// router.get('/me', authMiddleware, authController.getMe);
// router.get('/admin', authMiddleware, adminMiddleware, authController.adminRoute);
// router.get('/user', authMiddleware, authController.userRoute);

module.exports = router;