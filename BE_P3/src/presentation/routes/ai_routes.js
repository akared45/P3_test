const express = require('express');
const router = express.Router();
const { aiController } = require('../../infrastructure/config/dependencies');

router.post('/consult', (req, res, next) => aiController.consult(req, res, next));

module.exports = router;