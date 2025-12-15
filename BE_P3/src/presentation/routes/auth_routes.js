const express = require('express');
const router = express.Router();
const { authController } = require('../../infrastructure/config/dependencies');
const { verifyToken } = require('../middleware/auth_middleware');
const { validateRegister, validateLogin, validateRefreshToken, validateVerifyEmail, validateForgotPassword, validateResetPassword } = require('../validators/auth_validator');

router.post('/register', validateRegister, authController.register);

router.post('/login', validateLogin, authController.login);

router.post('/refresh', validateRefreshToken, authController.refreshToken);

router.post('/verify-email', validateVerifyEmail, authController.verifyEmail);

router.post('/logout', verifyToken, authController.logout);

router.post('/forgot-password', validateForgotPassword, authController.forgotPassword);

router.post('/reset-password', validateResetPassword, authController.resetPassword);

module.exports = router;