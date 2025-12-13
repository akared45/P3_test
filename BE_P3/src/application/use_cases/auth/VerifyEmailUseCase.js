const { AuthorizationException, ValidationException } = require('../../../domain/exceptions');
const { TokenType } = require('../../../domain/enums');

class VerifyEmailUseCase {
  constructor({ userRepository, verificationTokenRepository }) {
    this.userRepository = userRepository;
    this.verificationTokenRepository = verificationTokenRepository;
  }

  async execute(request) {
    const { token } = request;
    console.log(">>> RAW REQUEST VAO USECASE:", request); 
        console.log(">>> Type of Request:", typeof request);
    console.log("=== DEBUG USECASE ===");
        console.log("1. Token từ Request:", token);
        console.log("2. TokenType.VERIFY_EMAIL giá trị là:", TokenType.VERIFY_EMAIL);
    const tokenEntity = await this.verificationTokenRepository.findByTokenAndType(
      token,
      TokenType.VERIFY_EMAIL
    );

    if (!tokenEntity || !tokenEntity.isValid()) {
      throw new ValidationException("Token xác thực không hợp lệ hoặc đã hết hạn.");
    }

    const user = await this.userRepository.findById(tokenEntity.userId);
    if (!user) {
      throw new AuthorizationException("Tài khoản không tồn tại.");
    }

    const updatedUser = user.verifyEmail();
    await this.userRepository.save(updatedUser);
    await this.verificationTokenRepository.delete(token);

    return { success: true, message: "Xác thực email thành công." };
  }
}

module.exports = VerifyEmailUseCase;