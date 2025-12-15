const express = require('express');
const router = express.Router();

const { appointmentController } = require('../../infrastructure/config/dependencies');
const { verifyToken, requireRole } = require('../middleware/auth_middleware');
const { validateBooking } = require('../validators/appointment_validator');

router.use(verifyToken);

router.post('/', requireRole('patient'), validateBooking, appointmentController.bookAppointment);

router.get('/', appointmentController.getMyAppointments);

router.get('/busy-slots/:doctorId', appointmentController.getBusySlots);

router.use(verifyToken, requireRole('doctor'));

router.post('/:id/complete', (req, res, next) => appointmentController.complete(req, res, next));

module.exports = router;