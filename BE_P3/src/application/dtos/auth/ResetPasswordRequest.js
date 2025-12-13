class ResetPasswordRequest {
    constructor({ token, email, newPassword, confirmPassword }) {
        this.token = token;
        this.email = email;
        this.newPassword = newPassword;
        this.confirmPassword = confirmPassword;
    }
}
module.exports = ResetPasswordRequest;