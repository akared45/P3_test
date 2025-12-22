const {
  AuthorizationException,
  ValidationException,
} = require("../../../domain/exceptions");
const { TokenType } = require("../../../domain/enums");

class VerifyEmailUseCase {
  constructor({ userRepository, verificationTokenRepository }) {
    this.userRepository = userRepository;
    this.verificationTokenRepository = verificationTokenRepository;
  }

  async execute(request) {
    const { token } = request;

    const tokenEntity =
      await this.verificationTokenRepository.findByTokenAndType(
        token,
        TokenType.VERIFY_EMAIL
      );

    if (!tokenEntity || !tokenEntity.isValid()) {
      throw new ValidationException(
        "Invalid or expired verification token."
      );
    }

    const user = await this.userRepository.findById(tokenEntity.userId);
    if (!user) {
      throw new AuthorizationException("Account does not exist.");
    }

    const updatedUser = user.verifyEmail();
    await this.userRepository.save(updatedUser);
    await this.verificationTokenRepository.delete(token);

    return { success: true, message: "Email verification successful." };
  }
}

module.exports = VerifyEmailUseCase;
