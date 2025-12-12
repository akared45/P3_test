const Joi = require('joi');
const { ValidationException } = require('../../domain/exceptions');

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const messages = error.details.map(d => d.message);
        return next(new ValidationException('Dữ liệu không hợp lệ', messages));
    }
    next();
};

const schemas = {
    bookAppointment: Joi.object({
        doctorId: Joi.string().required(),
        appointmentDate: Joi.date().iso().greater('now').required().messages({
            'date.greater': 'Thời gian đặt lịch phải ở tương lai',
            'date.format': 'Định dạng ngày giờ không hợp lệ (ISO 8601)'
        }),
        symptoms: Joi.string().required().min(5),
        // Thêm type
        type: Joi.string().valid('VIDEO', 'VOICE', 'CHAT', 'in_person').default('VIDEO'),
        notes: Joi.string().allow('', null)
    })
};

module.exports = {
    validateBooking: validate(schemas.bookAppointment)
};