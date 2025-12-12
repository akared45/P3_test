const Patient = require("../../../domain/entities/Patient");
const { UserType } = require("../../../domain/enums");
const RegisterOutputDTO = require("../../dtos/auth/RegisterResponse");
const { BusinessRuleException } = require("../../../domain/exceptions");

class RegisterPatientUseCase {
  constructor({ userRepository, authenticationService }) {
    this.userRepository = userRepository;
    this.authenticationService = authenticationService;
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
      allergies: []
    });
    await this.userRepository.save(newPatient);
    return new RegisterOutputDTO(newPatient);
  }
}

module.exports = RegisterPatientUseCase;