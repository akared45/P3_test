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

const scheduleSchema = Joi.object({
    day: Joi.string().valid("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday").required(),
    start: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
    end: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
    maxPatients: Joi.number().min(1).default(10)
});

const qualificationSchema = Joi.object({
    _id: Joi.any().strip(),
    degree: Joi.string().required(),
    institution: Joi.string().required(),
    year: Joi.number().integer().min(1900).max(new Date().getFullYear())
});

const workHistorySchema = Joi.object({
    _id: Joi.any().strip(),
    position: Joi.string().required(),
    place: Joi.string().required(),
    from: Joi.date().required(),
    to: Joi.date().allow(null)
});

const schemas = {
    createDoctor: Joi.object({
        username: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        fullName: Joi.string().required(),
        licenseNumber: Joi.string().required(),
        specCode: Joi.string().required(),
        qualifications: Joi.array().items(qualificationSchema).optional(),
        workHistory: Joi.array().items(workHistorySchema).optional(),
        schedules: Joi.array().items(scheduleSchema).optional(),
        avatarUrl: Joi.string().optional().allow(null, ''),
    }),

    updateDoctor: Joi.object({
        fullName: Joi.string().optional(),
        licenseNumber: Joi.string().optional(),
        specCode: Joi.string().optional(),
        isActive: Joi.boolean().optional(),
        bio: Joi.string().allow('', null),
        qualifications: Joi.array().items(
            Joi.object({
                _id: Joi.any().strip(),
                degree: Joi.string().required(),
                institution: Joi.string().required(),
                year: Joi.number().integer(),
                specialization: Joi.string().allow('', null)
            })
        ),
        specialization: Joi.string().allow('', null),
        workHistory: Joi.array().items(
            Joi.object({
                _id: Joi.any().strip(),
                position: Joi.string().required(),
                place: Joi.string().required(),
                from: Joi.date().required(),
                to: Joi.date().allow(null),
                department: Joi.string().allow('', null)
            })
        ),
        unavailableDates: Joi.array().items(
            Joi.object({
                _id: Joi.any().strip(),
                date: Joi.date().required(),
                start: Joi.date().allow(null),
                end: Joi.date().allow(null),
                reason: Joi.string().allow('', null),
                allDay: Joi.boolean().default(true),
                _id: Joi.any().strip()
            })
        ).optional(),
        schedules: Joi.array().items(
            Joi.object({
                _id: Joi.any().strip(),
                day: Joi.string().valid("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday").required(),
                start: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
                end: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
                maxPatients: Joi.number().min(1).default(10)
            })
        ).optional(),
        avatarUrl: Joi.string().optional().allow(null, ''),
    })
};

module.exports = {
    validateCreateDoctor: validate(schemas.createDoctor),
    validateUpdateDoctor: validate(schemas.updateDoctor)
};