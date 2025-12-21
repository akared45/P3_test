const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth_middleware');
const { paymentController } = require('../../infrastructure/config/dependencies');

router.post('/vnpay/create_payment_url', verifyToken, 
    (req, res, next) => paymentController.createVnPayUrl(req, res, next)
);

router.get('/vnpay/ipn', 
    (req, res, next) => paymentController.handleVnPayIpn(req, res, next)
);

router.get('/vnpay/vnpay_return', (req, res, next) => {
    return paymentController.handleVnPayReturn(req, res, next);
});

module.exports = router;