class LoginResponse {
    constructor({ user, accessToken, refreshToken, expiresIn }) {
        this.user = {
            id: user.id.toString(),
            email: user.email,
            username: user.username,
            userType: user.userType,
            fullName: user.profile?.fullName || '',
            avatarUrl: user.profile?.avatarUrl || null
        };

        this.auth = {
            accessToken,
            refreshToken,
            expiresIn
        };
    }
}

module.exports = LoginResponse;