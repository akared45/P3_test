const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth_middleware');
const { paymentController } = require('../../infrastructure/config/dependencies');

router.post('/momo/create-url', verifyToken,
    (req, res, next) => paymentController.createMomoUrl(req, res, next)
);

router.post('/momo/ipn',
    (req, res, next) => paymentController.handleMomoIpn(req, res, next)
);

module.exports = router;