const { TokenType } = require('../enums');

class VerificationToken {
    constructor({ userId, token, type, expiresAt, createdAt = new Date() }) {
        if (!userId) throw new Error("VerificationToken: userId is required");
        if (!token) throw new Error("VerificationToken: token is required");
        if (!type || !Object.values(TokenType).includes(type)) {
            throw new Error("VerificationToken: Invalid token type");
        }
        if (!expiresAt) throw new Error("VerificationToken: expiresAt is required");
        
        this.userId = userId;
        this.token = token;
        this.type = type;
        this.expiresAt = expiresAt instanceof Date ? expiresAt : new Date(expiresAt);
        this.createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt);

        Object.freeze(this);
    }

    isValid() {
        return new Date() < this.expiresAt;
    }

    isPasswordResetToken() {
        return this.type === TokenType.RESET_PASSWORD;
    }
}

module.exports = VerificationToken;