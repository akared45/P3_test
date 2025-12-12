const RefreshTokenResponse = require("../../dtos/auth/RefreshTokenResponse");
const { AuthorizationException } = require("../../../domain/exceptions");
const UserSession = require("../../../domain/entities/UserSession");

class RefreshTokenUseCase {
  constructor({ userSessionRepository, userRepository, tokenService }) {
    this.userSessionRepository = userSessionRepository;
    this.userRepository = userRepository;
    this.tokenService = tokenService;
  }
  async execute(request) {

    const { refreshToken: oldRefreshToken } = request;

    const session = await this.userSessionRepository.findByRefreshToken(oldRefreshToken);

    if (!session || !session.isValid()) {
      if (session) {
        await this.userSessionRepository.deleteByRefreshToken(oldRefreshToken);
      }
      throw new AuthorizationException("Invalid, expired, or revoked refresh token");
    }

    const decoded = this.tokenService.verifyToken(oldRefreshToken);
    if (!decoded) {
      await this.userSessionRepository.deleteByRefreshToken(oldRefreshToken);
      throw new AuthorizationException("Invalid token signature");
    }

    const user = await this.userRepository.findById(session.userId);

    if (!user || !user.isActive) {
      await this.userSessionRepository.deleteByRefreshToken(oldRefreshToken);
      throw new AuthorizationException("User not found or inactive");
    }
    const payload = {
      sub: user.id.toString(),
      role: user.userType
    };

    const newAccessToken = this.tokenService.generateAccessToken(payload);
    const newRefreshToken = this.tokenService.generateRefreshToken(payload);

    const sessionExpiry = this.tokenService.getRefreshTokenExpiry();
    const newSession = new UserSession({
      userId: user.id.toString(),
      refreshToken: newRefreshToken,
      expiresAt: sessionExpiry
    });
    await this.userSessionRepository.save(newSession);
    await this.userSessionRepository.deleteByRefreshToken(oldRefreshToken);

    return new RefreshTokenResponse({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn: this.tokenService.getAccessTokenExpiry()
    });
  }
}

module.exports = RefreshTokenUseCase;