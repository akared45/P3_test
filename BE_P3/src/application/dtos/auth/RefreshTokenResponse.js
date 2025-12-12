class RefreshTokenResponse {
    constructor({ accessToken, refreshToken = null, expiresIn }) {
        this.accessToken = accessToken;
        this.expiresIn = expiresIn;
        this.refreshToken = refreshToken;
    }
}

module.exports = RefreshTokenResponse;