const express = require('express');
const router = express.Router();
const { authController } = require('../../infrastructure/config/dependencies'); 
const { validateRegister, validateLogin, validateRefreshToken } = require('../validators/auth_validator');

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/refresh', validateRefreshToken, authController.refreshToken);
router.post('/logout', validateRefreshToken, authController.logout);

module.exports = router;