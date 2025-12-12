const Joi = require('joi');
const { ValidationException } = require('../../domain/exceptions');

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const messages = error.details.map(d => d.message);
        return next(new ValidationException('Invalid data', messages));
    }
    next();
};

const schemas = {
    create: Joi.object({
        code: Joi.string().required().uppercase().trim(),
        name: Joi.string().required().trim(),
        category: Joi.string().optional().default('OTHER')
    }),

    update: Joi.object({
        name: Joi.string().optional().trim(),
        category: Joi.string().optional().trim()
    })
};

module.exports = {
    validateCreateSpec: validate(schemas.create),
    validateUpdateSpec: validate(schemas.update)
};