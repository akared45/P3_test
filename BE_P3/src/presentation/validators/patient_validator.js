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
            'any.required': 'Họ tên là bắt buộc',
        }),

        gender: Joi.string().valid('Male', 'Female', 'Other').default('Other'),

        dateOfBirth: Joi.date().iso().allow(null).optional().messages({
            'date.format': 'Ngày sinh phải đúng định dạng ISO'
        }),

        avatarUrl: Joi.string().allow('', null).optional(),
        contacts: Joi.array().items(
            Joi.object({
                type: Joi.string()
                    .valid('phone', 'email', 'facebook', 'zalo', 'address')
                    .required()
                    .messages({
                        'any.only': 'Loại liên hệ không hợp lệ'
                    }),

                value: Joi.string().required().when('type', {
                    is: 'phone',
                    then: Joi.string().pattern(/^[0-9+]{9,15}$/).messages({
                        'string.pattern.base': 'Số điện thoại không hợp lệ (9-15 số)',
                        'any.required': 'Số điện thoại là bắt buộc'
                    }),
                    otherwise: Joi.string()
                }),
                isPrimary: Joi.boolean().optional()
            }).unknown(false)
        ).optional(),

        medicalConditions: Joi.array().items(
            Joi.object({
                name: Joi.string().required().messages({ 'any.required': 'Tên bệnh lý là bắt buộc' }),
                status: Joi.string().valid('active', 'chronic', 'cured').default('active'),
                diagnosedDate: Joi.date().iso().allow(null).optional(),
                treatmentPlan: Joi.string().allow('', null).optional(),
                notes: Joi.string().allow('', null).optional()
            }).unknown(false)
        ).optional(),

        allergies: Joi.array().items(
            Joi.object({
                name: Joi.string().required().messages({ 'any.required': 'Tên dị ứng là bắt buộc' }),
                severity: Joi.string().valid('low', 'medium', 'high').default('low'),
                reaction: Joi.string().allow('', null).optional(),
                notes: Joi.string().allow('', null).optional()
            }).unknown(false)
        ).optional()
    }).unknown(false)
};

module.exports = {
    validateUpdatePatient: validate(schemas.updatePatientProfile)
};