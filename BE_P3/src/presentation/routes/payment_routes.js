const express = require('express');
const router = express.Router();

// Import Middleware xác thực (JWT)
const { verifyToken } = require('../middleware/auth_middleware');

// Import Dependencies Container (đã inject Controller)
const { paymentController } = require('../../infrastructure/config/dependencies');

// 1. API Tạo Link (Cần đăng nhập)
router.post(
    '/momo/create-url', 
    verifyToken, // User phải login mới được tạo đơn
    (req, res, next) => paymentController.createMomoUrl(req, res, next)
);

// 2. API Nhận Webhook (IPN) từ MoMo
// [QUAN TRỌNG]: API này KHÔNG ĐƯỢC có verifyToken
// Vì MoMo server gọi vào, nó không có Token của user
router.post(
    '/momo/ipn',
    (req, res, next) => paymentController.handleMomoIpn(req, res, next)
);

module.exports = router;