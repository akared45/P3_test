const Doctor = require('../../../domain/entities/Doctor');
const { Action, Resource } = require('../../../domain/enums');
const { AuthorizationException, BusinessRuleException, NotFoundException } = require('../../../domain/exceptions');
const DoctorResponse = require('../../dtos/doctor/DoctorResponse');

class CreateDoctorUseCase {
    constructor({ userRepository, authenticationService, authorizationService }) {
        this.userRepository = userRepository;
        this.authenticationService = authenticationService;
        this.authorizationService = authorizationService;
    }

    async execute(request) {
        const actor = await this.userRepository.findById(request.currentUserId);
        if (!actor) {
            throw new AuthorizationException("User not found");
        }
        const canCreate = this.authorizationService.can(
            actor,
            Action.CREATE,
            Resource.DOCTOR,
            null
        );

        if (!canCreate) {
            throw new AuthorizationException("Only Admin can create new doctors.");
        }

        const existingUser = await this.userRepository.findByEmail(request.email);
        if (existingUser) {
            throw new BusinessRuleException("Email is already in use", "EMAIL_EXISTS");
        }

        const passwordHash = await this.authenticationService.hash(request.password);

        const newDoctor = new Doctor({
            username: request.username,
            email: request.email,
            passwordHash: passwordHash,
            profile: {
                fullName: request.fullName,
                avatarUrl: request.avatarUrl || null
            },
            licenseNumber: request.licenseNumber,
            specCode: request.specCode,
            schedules: request.schedules || [],
            unavailableDates: [],
            qualifications: request.qualifications,
            workHistory: request.workHistory
        });
        const savedDoctor = await this.userRepository.save(newDoctor);

        return new DoctorResponse(savedDoctor);
    }
}

module.exports = CreateDoctorUseCase;