const { ValidationException } = require('../../../domain/exceptions');

class LoginRequest {
    constructor(data) {
        if (!data.email || !data.password) {
            throw new ValidationException('Email and password are required');
        }

        this.email = data.email.trim().toLowerCase();
        this.password = data.password;
    }
}

module.exports = LoginRequest;