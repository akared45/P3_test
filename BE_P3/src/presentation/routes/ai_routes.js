const express = require('express');
const router = express.Router();
const { aiController } = require('../../infrastructure/config/dependencies');
    
router.post('/suggest', aiController.suggest);

module.exports = router;