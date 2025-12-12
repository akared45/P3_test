const Joi = require('joi');
const { ValidationException } = require('../../domain/exceptions');

const validate = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true
    });

    if (error) {
        const messages = error.details.map(d => d.message.replace(/"/g, ''));
        return next(new ValidationException('Dữ liệu cập nhật không hợp lệ', messages));
    }
    req.body = value;
    next();
};

const schemas = {
    updatePatientProfile: Joi.object({
        fullName: Joi.string().required().messages({
            'string.empty': 'Họ tên không được để trống',
            'any.required': 'Họ tên là bắt buộc'
        }),

        gender: Joi.string().valid('Male', 'Female', 'Other').default('Other'),

        dateOfBirth: Joi.date().iso().allow(null).optional().messages({
            'date.format': 'Ngày sinh phải đúng định dạng ISO'
        }),

        avatarUrl: Joi.string().allow('', null).optional(),

        email: Joi.string().email().optional(),
        phone: Joi.string().pattern(/^[0-9+]{9,15}$/).required().messages({
            'string.pattern.base': 'Số điện thoại không hợp lệ (9-15 số)',
            'any.required': 'Số điện thoại là bắt buộc'
        }),

        medicalConditions: Joi.array().items(
            Joi.object({
                name: Joi.string().required().messages({ 'any.required': 'Tên bệnh lý là bắt buộc' }),
                status: Joi.string().valid('active', 'chronic', 'cured').default('active'),
                diagnosedDate: Joi.date().allow(null).optional(),
                treatmentPlan: Joi.string().allow('', null).optional(),
                notes: Joi.string().allow('', null).optional()
            })
        ).default([]),

        allergies: Joi.array().items(
            Joi.object({
                name: Joi.string().required().messages({ 'any.required': 'Tên dị ứng là bắt buộc' }),
                severity: Joi.string().valid('low', 'medium', 'high').default('low'),
                reaction: Joi.string().allow('', null).optional(),
                notes: Joi.string().allow('', null).optional()
            })
        ).default([])
    })
};

module.exports = {
    validateUpdatePatient: validate(schemas.updatePatientProfile)
};