const express = require('express');
const userController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller');
const router = express.Router();

router.post('/', userController.createUser);
router.post('/login', userController.loginWithEmail);
router.post('/google', userController.loginWithGoogle);
router.get('/me', authController.authenticate, userController.getUser)
router.put('/info/:id', authController.authenticate, userController.addInfo)

router.post('/coupon', 
    authController.authenticate, 
    userController.useCoupon
);

router.post('/reward', 
    authController.authenticate, 
    userController.useReward
);

module.exports = router;