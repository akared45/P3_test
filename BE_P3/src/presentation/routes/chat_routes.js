const express = require('express');
const router = express.Router();
const { chatController } = require('../../infrastructure/config/dependencies');
const { verifyToken } = require('../middleware/auth_middleware');

router.use(verifyToken);

router.get(
    '/history/:appointmentId', 
    verifyToken,
    (req, res, next) => chatController.getHistory(req, res, next)
);

module.exports = router;