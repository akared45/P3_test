const { ValidationException } = require('../../../domain/exceptions');

class VerifyEmailRequest {
    constructor(data) {
        if (!data.token) {
            throw new ValidationException('Verification token is required');
        }
        this.token = data.token;
    }
}

module.exports = VerifyEmailRequest;