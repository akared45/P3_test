const jwt = require("jsonwebtoken");
const ITokenService = require("../../application/interfaces/ITokenService");
require("dotenv").config();

class JwtTokenService extends ITokenService {
    constructor() {
        super();
        this.secretKey = process.env.JWT_SECRET_KEY || "fallback_secret_dev";
        this.accessTokenExpiresIn = Number(process.env.JWT_ACCESS_EXPIRY) || 3600;
        this.refreshTokenExpiresIn = Number(process.env.JWT_REFRESH_EXPIRY) || 604800;
    }

    generateAccessToken(payload) {
        return jwt.sign(payload, this.secretKey, {
            expiresIn: this.accessTokenExpiresIn
        });
    }

    generateRefreshToken(payload) {
        const refreshPayload = { sub: payload.sub };
        return jwt.sign(refreshPayload, this.secretKey, {
            expiresIn: this.refreshTokenExpiresIn
        });
    }

    verifyToken(token) {
        try {
            return jwt.verify(token, this.secretKey);
        } catch (error) {
            return null;
        }
    }

    getAccessTokenExpiry() {
        return this.accessTokenExpiresIn;
    }

    getRefreshTokenExpiry() {
        return new Date(Date.now() + (this.refreshTokenExpiresIn * 1000));
    }
}

module.exports = JwtTokenService;