const { NotImplementedException } = require('../../domain/exceptions');

class ITokenService {
    generateToken(payload, expiresIn) {
        throw new NotImplementedException('ITokenService.generateToken');
    }

    generateRefreshToken(payload) {
        throw new NotImplementedException('ITokenService.generateRefreshToken');
    }

    verifyToken(token) {
        throw new NotImplementedException('ITokenService.verifyToken');
    }

    getAccessTokenExpiry() {
        throw new NotImplementedException('ITokenService.getAccessTokenExpiry');
    }

    getRefreshTokenExpiry() {
        throw new NotImplementedException('ITokenService.getRefreshTokenExpiry');
    }
}

module.exports = ITokenService;