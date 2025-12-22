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
        return next(new ValidationException('Invalid update data', messages));
    }
    req.body = value;
    next();
};

const schemas = {
    updatePatientProfile: Joi.object({
        fullName: Joi.string().required().messages({
            'string.empty': 'Full name cannot be blank',
            'any.required': 'Full name is required',
        }),

        gender: Joi.string().valid('Male', 'Female', 'Other').default('Other'),

        dateOfBirth: Joi.date().iso().allow(null).optional().messages({
            'date.format': 'Date of birth must be in ISO format'
        }),

        avatarUrl: Joi.string().allow('', null).optional(),
        contacts: Joi.array().items(
            Joi.object({
                type: Joi.string()
                    .valid('phone', 'email', 'facebook', 'zalo', 'address')
                    .required()
                    .messages({
                        'any.only': 'Invalid contact type'
                    }),

                value: Joi.string().required().when('type', {
                    is: 'phone',
                    then: Joi.string().pattern(/^[0-9+]{9,15}$/).messages({
                        'string.pattern.base': 'Invalid phone number (9-15 digits)',
                        'any.required': 'Any phone number is required'
                    }),
                    otherwise: Joi.string()
                }),
                isPrimary: Joi.boolean().optional()
            }).unknown(false)
        ).optional(),

        medicalConditions: Joi.array().items(
            Joi.object({
                name: Joi.string().required().messages({ 'any.required': 'The name of the disease is required' }),
                status: Joi.string().valid('active', 'chronic', 'cured').default('active'),
                diagnosedDate: Joi.date().iso().allow(null).optional(),
                treatmentPlan: Joi.string().allow('', null).optional(),
                notes: Joi.string().allow('', null).optional()
            }).unknown(false)
        ).optional(),

        allergies: Joi.array().items(
            Joi.object({
                name: Joi.string().required().messages({ 'any.required': 'Allergy names are required.' }),
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