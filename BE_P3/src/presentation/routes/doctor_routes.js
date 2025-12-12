const express = require('express');
const router = express.Router();
const { doctorController } = require('../../infrastructure/config/dependencies');

router.get('/', doctorController.getList);
router.get('/:id', doctorController.getDetail);
router.get('/:id/slots', doctorController.getSlots);

module.exports = router;