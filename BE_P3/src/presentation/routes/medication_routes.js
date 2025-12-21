const express = require('express');
const router = express.Router();
const { medicationController } = require('../../infrastructure/config/dependencies');
const { verifyToken, requireRole } = require('../middleware/auth_middleware');

router.use(verifyToken);

router.post('/appointments/:appointmentId/prescriptions', requireRole('doctor'), medicationController.addPrescription);

router.post('/', requireRole('admin'), medicationController.createMedication);

router.put('/:id', requireRole('admin'), medicationController.updateMedication);

router.delete('/:id', requireRole('admin'), medicationController.deleteMedication);

router.get('/', medicationController.getMedications);

module.exports = router;