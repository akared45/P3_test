const express = require('express');
const router = express.Router();
const { specializationController } = require('../../infrastructure/config/dependencies');
const { verifyToken, requireRole } = require('../middleware/auth_middleware');
const { validateCreateSpec, validateUpdateSpec } = require('../validators/specialization_validator');

router.get('/', specializationController.getAll);
router.get('/:id', specializationController.getDetail);

router.use(verifyToken, requireRole('admin'));

router.post('/', validateCreateSpec, specializationController.create);
router.put('/:id', validateUpdateSpec, specializationController.update);
router.delete('/:id', specializationController.delete);

module.exports = router;