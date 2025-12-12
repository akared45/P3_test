const express = require('express');
const router = express.Router();
const { patientController } = require('../../infrastructure/config/dependencies');
const { verifyToken } = require('../middleware/auth_middleware');
const { validateUpdatePatient } = require('../validators/patient_validator');

router.use(verifyToken);
router.get('/', patientController.getList);
router.put('/me', validateUpdatePatient, patientController.updateMe);

module.exports = router;