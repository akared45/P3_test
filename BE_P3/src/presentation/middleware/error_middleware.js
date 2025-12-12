const {
    DomainException,
    ValidationException,
    AuthorizationException,
    BusinessRuleException,
    NotFoundException
} = require('../../domain/exceptions');

const errorMiddleware = (err, req, res, next) => {
    console.error(`[ERROR] ${req.method} ${req.url}:`, err);
    
    if (err instanceof ValidationException) {
        return res.status(400).json({
            status: 'error',
            code: 'VALIDATION_ERROR',
            message: err.message,
            errors: err.errors
        });
    }

    if (err instanceof AuthorizationException) {
        return res.status(401).json({
            status: 'error',
            code: 'UNAUTHORIZED',
            message: err.message
        });
    }

    if (err instanceof BusinessRuleException) {
        return res.status(422).json({
            status: 'error',
            code: err.code || 'BUSINESS_RULE_VIOLATION',
            message: err.message
        });
    }

    if (err instanceof NotFoundException) {
        return res.status(404).json({
            status: 'error',
            code: 'NOT_FOUND',
            message: err.message
        });
    }

    if (err instanceof DomainException) {
        return res.status(err.statusCode || 400).json({
            status: 'error',
            code: err.code,
            message: err.message
        });
    }

    return res.status(500).json({
        status: 'error',
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong, please try again later.'
    });
};

module.exports = errorMiddleware;