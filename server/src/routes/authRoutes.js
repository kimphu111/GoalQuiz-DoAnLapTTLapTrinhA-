const express = require('express');
const router = express.Router();
const userControllerr = require('../controller/userControllerr');
const { authMiddleware,admninMiddleware} = require('../middleware/authMiddleware');


router.post('/register', userControllerr.register);
router.post('/login', userControllerr.login);
router.get('/logout', authMiddleware, userControllerr.logout);

router.get('/admin-only', authMiddleware, admninMiddleware, (req, res) =>{
    res.status(200).json({ message: 'welcome to admin only route'});
})

// router.get('/me', authMiddleware, authController.getMe);
// router.get('/admin', authMiddleware, adminMiddleware, authController.adminRoute);
// router.get('/user', authMiddleware, authController.userRoute);

module.exports = router;