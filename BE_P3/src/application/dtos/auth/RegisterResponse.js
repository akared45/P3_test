class RegisterResponse {
    constructor(user) {
        this.id = user.id.toString();
        this.email = user.email;
        this.username = user.username;
        this.userType = user.userType;
        this.fullName = user.profile?.fullName || '';
        this.createdAt = user.createdAt;
    }
}

module.exports = RegisterResponse;