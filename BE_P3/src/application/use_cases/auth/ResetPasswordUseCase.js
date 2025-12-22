const {
    AuthorizationException,
    ValidationException,
} = require("../../../domain/exceptions");
const TokenType = require("../../../domain/enums/TokenType");

class ResetPasswordUseCase {
    constructor({
        userRepository,
        verificationTokenRepository,
        authenticationService,
    }) {
        this.userRepository = userRepository;
        this.verificationTokenRepository = verificationTokenRepository;
        this.authenticationService = authenticationService;
    }

    async execute(request) {
        const { token, email, newPassword, confirmPassword } = request;

        if (newPassword !== confirmPassword) {
            throw new ValidationException("Password confirmation does not match.");
        }

        const tokenEntity =
            await this.verificationTokenRepository.findByTokenAndType(
                token,
                TokenType.RESET_PASSWORD
            );

        if (!tokenEntity || !tokenEntity.isValid()) {
            throw new AuthorizationException("Invalid or expired token.");
        }

        const user = await this.userRepository.findByEmail(email);
        if (!user || user.id.toString() !== tokenEntity.userId) {
            await this.verificationTokenRepository.delete(token);
            throw new AuthorizationException(
                "The token does not belong to this account."
            );
        }

        const newPasswordHash = await this.authenticationService.hash(newPassword);
        const updatedUser = user.updatePasswordHash(newPasswordHash);
        await this.userRepository.save(updatedUser);
        await this.verificationTokenRepository.delete(token);

        return { success: true, message: "Password reset successful." };
    }
}

module.exports = ResetPasswordUseCase;
