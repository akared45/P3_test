const express = require('express');
const router = express.Router();
const { notificationController } = require('../../infrastructure/config/dependencies');
const { verifyToken } = require('../middleware/auth_middleware');

router.use(verifyToken);

router.get('/', (req, res, next) => notificationController.getNotifications(req, res, next));
router.patch('/:id/read', (req, res, next) => notificationController.markAsRead(req, res, next));

module.exports = router;