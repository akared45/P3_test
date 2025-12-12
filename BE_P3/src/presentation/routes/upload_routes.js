const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload_middleware');
const { uploadController } = require('../../infrastructure/config/dependencies');
const { verifyToken } = require('../middleware/auth_middleware');

router.post('/', verifyToken, upload.single('file'), uploadController.uploadImage);

module.exports = router;