const Joi = require('joi');
const { ValidationException } = require('../../domain/exceptions');

const validate = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, allowUnknown: true });

    if (error) {
        return next(new ValidationException('Dữ liệu hồ sơ không hợp lệ', error.details.map(d => d.message)));
    }
    req.body = value;
    next();
};

const schemas = {
    updatePatientProfile: Joi.object({
        fullName: Joi.string().required().min(3).messages({ 'string.min': 'Tên phải có ít nhất 3 ký tự' }),
        gender: Joi.string().valid('Male', 'Female', 'Other').required(),
        dateOfBirth: Joi.date().iso().allow(null).optional().messages({ 'date.iso': 'Ngày sinh phải là định dạng ISO' }),
        avatarUrl: Joi.string().uri().allow('', null).optional(),
        phone: Joi.string().pattern(/^[0-9]{9,15}$/).required().messages({ 'string.pattern': 'Số điện thoại không hợp lệ' }),
        address: Joi.string().required(),
        medicalConditions: Joi.array().items(
            Joi.object({
                name: Joi.string().required(),
                status: Joi.string().valid('active', 'chronic', 'cured').optional().default('active'),
                diagnosedDate: Joi.date().iso().optional().allow(null),
                treatmentPlan: Joi.string().allow('', null).optional(),
                notes: Joi.string().allow('', null).optional(),
            })
        ).default([]),
        allergies: Joi.array().items(
            Joi.object({
                name: Joi.string().required(),
                severity: Joi.string().valid('low', 'medium', 'high').optional().default('low'),
                reaction: Joi.string().allow('', null).optional(),
                notes: Joi.string().allow('', null).optional(),
            })
        ).default([]),
        email: Joi.string().email().optional(),
    }).unknown(true)
};

module.exports = {
    validateUpdatePatient: validate(schemas.updatePatientProfile)
};