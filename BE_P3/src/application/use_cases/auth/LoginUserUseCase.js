const UserSession = require("../../../domain/entities/UserSession");
const LoginOutputDTO = require("../../dtos/auth/LoginResponse");
const { AuthorizationException, BusinessRuleException } = require("../../../domain/exceptions");
const { TokenType } = require("../../../domain/enums"); // [NEW]

class LoginUserUseCase {
    constructor({ userRepository, userSessionRepository, authenticationService, tokenService }) {
        this.userRepository = userRepository;
        this.userSessionRepository = userSessionRepository;
        this.authenticationService = authenticationService;
        this.tokenService = tokenService;
    }

    async execute(request) {
        const user = await this.userRepository.findByEmail(request.email);
        if (!user) {
            throw new AuthorizationException("Invalid credentials");
        }

        if (request.userType && user.userType !== request.userType) {
            throw new AuthorizationException("Invalid account role");
        }

        const isPasswordValid = await this.authenticationService.compare(
            request.password,
            user.passwordHash
        );
        if (!isPasswordValid) {
            throw new AuthorizationException("Invalid credentials");
        }

        if (!user.isEmailVerified) {
            throw new BusinessRuleException("Account not verified. Please check your email.");
        }

        if (!user.isActive) {
            throw new AuthorizationException("Account has been deactivated");
        }

        const tokenPayload = {
            sub: user.id.toString(),
            role: user.userType,
            type: TokenType.ACCESS
        };

        const accessToken = this.tokenService.generateToken(tokenPayload, '1h');

        const refreshPayload = { ...tokenPayload, type: TokenType.REFRESH };
        const refreshToken = this.tokenService.generateRefreshToken(refreshPayload);

        const sessionExpiry = this.tokenService.getRefreshTokenExpiry();

        const userSession = new UserSession({
            userId: user.id.toString(),
            refreshToken: refreshToken,
            expiresAt: sessionExpiry,
        });

        await this.userSessionRepository.save(userSession);

        return new LoginOutputDTO({
            user: user,
            accessToken: accessToken,
            refreshToken: refreshToken,
            expiresIn: this.tokenService.getAccessTokenExpiry()
        });
    }
}

module.exports = LoginUserUseCase;