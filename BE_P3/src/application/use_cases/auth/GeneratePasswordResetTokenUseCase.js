const { VerificationToken } = require('../../../domain/entities');
const TokenType = require('../../../domain/enums/TokenType');

class GeneratePasswordResetTokenUseCase {
    constructor({
        userRepository,
        verificationTokenRepository,
        emailService,
        securityService
    }) {
        this.userRepository = userRepository;
        this.verificationTokenRepository = verificationTokenRepository;
        this.emailService = emailService;
        this.securityService = securityService;
    }

    async execute(request) {
        const { email } = request;

        const user = await this.userRepository.findByEmail(email);

        if (!user || !user.isAvailable()) {
            console.warn(
                `[ForgotPass] Email does not exist or is locked: ${email}`
            );
            return {
                message:
                    "If the email exists, password reset instructions have been sent."
            };
        }

        const tokenString = this.securityService.generateSecureRandomToken();
        const expiresAt = new Date(Date.now() + 3600000);

        const tokenEntity = new VerificationToken({
            userId: user.id.toString(),
            token: tokenString,
            type: TokenType.RESET_PASSWORD,
            expiresAt: expiresAt
        });
        await this.verificationTokenRepository.save(tokenEntity);
        const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${tokenString}&email=${email}`;

        await this.emailService.sendPasswordResetEmail(
            user.email,
            resetLink,
            user.profile.fullName
        );

        return { message: "If the email exists, password reset instructions have been sent." };
    }
}

module.exports = GeneratePasswordResetTokenUseCase;