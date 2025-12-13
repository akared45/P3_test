const Joi = require('joi');
const { ValidationException } = require('../../domain/exceptions');

const schemas = {
    register: Joi.object({
        username: Joi.string().alphanum().min(3).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        profile: Joi.object({
            fullName: Joi.string().required(),
            dateOfBirth: Joi.date().iso().less('now').optional(),
            gender: Joi.string().valid('Male', 'Female', 'Other').optional(),
            avatarUrl: Joi.string().uri().optional().allow(null, '')
        }).required()
    }),

    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }),

    refreshToken: Joi.object({
        refreshToken: Joi.string().required()
    }),

    verifyEmail: Joi.object({
        token: Joi.string().required().messages({
            'string.empty': 'Token không được để trống',
            'any.required': 'Vui lòng cung cấp token xác thực'
        })
    }),

    forgotPassword: Joi.object({
        email: Joi.string().email().required().trim()
    }),

    resetPassword: Joi.object({
        token: Joi.string().required(),
        email: Joi.string().email().required().trim(),
        newPassword: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required()
            .messages({ 'any.only': 'Mật khẩu xác nhận không khớp' })
    })
};

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessages = error.details.map((detail) => detail.message);
        return next(new ValidationException('Dữ liệu không hợp lệ', errorMessages));
    }

    next();
};

module.exports = {
    validateRegister: validate(schemas.register),
    validateLogin: validate(schemas.login),
    validateRefreshToken: validate(schemas.refreshToken),
    validateVerifyEmail: validate(schemas.verifyEmail),
    validateForgotPassword: validate(schemas.forgotPassword),
    validateResetPassword: validate(schemas.resetPassword)
};