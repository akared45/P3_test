const { AuthorizationException, ValidationException } = require('../../../domain/exceptions');
const TokenType = require('../../../domain/enums/TokenType');

class ResetPasswordUseCase {
    constructor({
        userRepository,
        verificationTokenRepository,
        authenticationService
    }) {
        this.userRepository = userRepository;
        this.verificationTokenRepository = verificationTokenRepository;
        this.authenticationService = authenticationService;
    }

    async execute(request) {
        const { token, email, newPassword, confirmPassword } = request;

        if (newPassword !== confirmPassword) {
            throw new ValidationException("Mật khẩu xác nhận không khớp.");
        }

        const tokenEntity = await this.verificationTokenRepository.findByTokenAndType(
            token,
            TokenType.RESET_PASSWORD
        );

        if (!tokenEntity || !tokenEntity.isValid()) {
            throw new AuthorizationException("Token không hợp lệ hoặc đã hết hạn.");
        }

        const user = await this.userRepository.findByEmail(email);
        if (!user || user.id.toString() !== tokenEntity.userId) {
            await this.verificationTokenRepository.delete(token);
            throw new AuthorizationException("Token không thuộc về tài khoản này.");
        }

        const newPasswordHash = await this.authenticationService.hash(newPassword);
        const updatedUser = user.updatePasswordHash(newPasswordHash);
        await this.userRepository.save(updatedUser);
        await this.verificationTokenRepository.delete(token);

        return { success: true, message: "Đặt lại mật khẩu thành công." };
    }
}

module.exports = ResetPasswordUseCase;