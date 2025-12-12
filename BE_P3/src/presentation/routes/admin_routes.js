const express = require('express');
const router = express.Router();
const { adminController } = require('../../infrastructure/config/dependencies');
const { verifyToken, requireRole } = require('../middleware/auth_middleware');
const { validateCreateDoctor, validateUpdateDoctor } = require('../validators/admin_validator');

router.use(verifyToken, requireRole('admin'));
router.post('/doctors', validateCreateDoctor, adminController.createDoctor);
router.put('/doctors/:id', validateUpdateDoctor, adminController.updateDoctor);
router.delete('/users/:id', adminController.deleteUser);

module.exports = router;