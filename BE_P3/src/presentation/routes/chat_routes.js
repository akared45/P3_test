const express = require('express');
const router = express.Router();
const { chatController } = require('../../infrastructure/config/dependencies');
const { verifyToken } = require('../middleware/auth_middleware');
const { validateGetHistory, validateSendMessage } = require('../validators/chat_validator');

router.use(verifyToken);
router.get('/:appointmentId', validateGetHistory, chatController.getHistory);
router.post('/send', validateSendMessage, chatController.sendMessage);

module.exports = router;