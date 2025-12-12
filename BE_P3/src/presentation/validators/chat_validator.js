const Joi = require('joi');
const { ValidationException } = require('../../domain/exceptions');

const validate = (schema) => (req, res, next) => {
    const data = { ...req.body, ...req.query, ...req.params };

    const { error } = schema.validate(data, { abortEarly: false, allowUnknown: true });
    if (error) {
        const messages = error.details.map(d => d.message);
        return next(new ValidationException('Invalid data', messages));
    }
    next();
};

const schemas = {
    getHistory: Joi.object({
        appointmentId: Joi.string().required(),
        limit: Joi.number().integer().min(1).max(100).default(50),
        offset: Joi.number().integer().min(0).default(0)
    }),

    sendMessage: Joi.object({
        appointmentId: Joi.string().required(),
        content: Joi.string().allow('', null),
        type: Joi.string().valid('text', 'image', 'file').default('text'),
        fileUrl: Joi.string().uri().allow(null)
    }).or('content', 'fileUrl')
};

module.exports = {
    validateGetHistory: validate(schemas.getHistory),
    validateSendMessage: validate(schemas.sendMessage)
};