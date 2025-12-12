const { ValidationException } = require('../../../domain/exceptions');

class RefreshTokenRequest {
  constructor(data) {
    if (!data.refreshToken) {
      throw new ValidationException('Refresh token is required');
    }
    this.refreshToken = data.refreshToken;
  }
}

module.exports = RefreshTokenRequest;