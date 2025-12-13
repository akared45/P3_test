const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const ITokenService = require("../../application/interfaces/ITokenService");
require("dotenv").config();

class JwtTokenService extends ITokenService {
    constructor() {
        super();
        this.secretKey = process.env.JWT_SECRET_KEY || "fallback_secret_dev";
        this.accessTokenExpiresIn = process.env.JWT_ACCESS_EXPIRY || '1h';
        this.refreshTokenExpiresIn = process.env.JWT_REFRESH_EXPIRY || '7d';
    }

    generateToken(payload) {
        return this.generateAccessToken(payload);
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

    generateVerificationToken() {
        return crypto.randomBytes(32).toString('hex');
    }
    _parseDuration(duration) {
        if (typeof duration === 'number') return duration;

        const unit = duration.slice(-1);
        const value = parseInt(duration.slice(0, -1));

        if (isNaN(value)) return 3600; 

        switch (unit) {
            case 's': return value;          
            case 'm': return value * 60;      
            case 'h': return value * 60 * 60; 
            case 'd': return value * 24 * 60 * 60; 
            default: return value;
        }
    }
    verifyToken(token) {
        try {
            return jwt.verify(token, this.secretKey);
        } catch (error) {
            return null;
        }
    }

    getAccessTokenExpiry() {
        return this._parseDuration(this.accessTokenExpiresIn);
    }

    getRefreshTokenExpiry() {
        const seconds = this._parseDuration(this.refreshTokenExpiresIn);
        return new Date(Date.now() + (seconds * 1000));
    }
}

module.exports = JwtTokenService;