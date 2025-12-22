const Patient = require("../../../domain/entities/Patient");
const VerificationToken = require("../../../domain/entities/VerificationToken");
const { TokenType } = require("../../../domain/enums");
const RegisterOutputDTO = require("../../dtos/auth/RegisterResponse");
const { BusinessRuleException } = require("../../../domain/exceptions");

class RegisterPatientUseCase {
  constructor({ userRepository, authenticationService, emailService, tokenService, verificationTokenRepository }) {
    this.userRepository = userRepository;
    this.authenticationService = authenticationService;
    this.emailService = emailService;
    this.tokenService = tokenService;
    this.verificationTokenRepository = verificationTokenRepository;
  }

  async execute(request) {
    const existingUser = await this.userRepository.findByEmail(request.email);
    if (existingUser) {
      throw new BusinessRuleException("Email is already in use", "EMAIL_EXISTS");
    }

    const passwordHash = await this.authenticationService.hash(request.password);

    const newPatient = new Patient({
      username: request.username,
      email: request.email,
      passwordHash: passwordHash,
      profile: request.profile,
      contacts: [],
      medicalConditions: [],
      allergies: [],
      isEmailVerified: false
    });

    const savedUser = await this.userRepository.save(newPatient);
    const tokenString = this.tokenService.generateVerificationToken
      ? this.tokenService.generateVerificationToken()
      : require('crypto').randomBytes(32).toString('hex');

    const tokenEntity = new VerificationToken({
      userId: savedUser.id.toString(),
      token: tokenString,
      type: TokenType.VERIFY_EMAIL || 'EMAIL_VERIFICATION',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

    await this.verificationTokenRepository.save(tokenEntity);
    const frontendUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const verificationLink = `${frontendUrl}/verify-email?token=${tokenString}`;

    await this.emailService.sendVerificationEmail(savedUser.email, verificationLink);

    return new RegisterOutputDTO(
      savedUser,
      "Registration successful. Please check your email to activate your account."
    );
  }
}

module.exports = RegisterPatientUseCase;