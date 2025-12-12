const { Action, Resource } = require('../../../domain/enums');
const { AuthorizationException, NotFoundException } = require('../../../domain/exceptions');
const PatientProfileResponse = require('../../dtos/patient/PatientProfileResponse');

class GetPatientProfileUseCase {
    constructor({ userRepository, authorizationService }) {
        this.userRepository = userRepository;
        this.authorizationService = authorizationService;
    }

    async execute(request) {
        const { currentUserId, targetPatientId } = request;
        const actor = await this.userRepository.findById(currentUserId);
        if (!actor) {
            throw new AuthorizationException("User not found");
        }
        const targetPatient = await this.userRepository.findById(targetPatientId);

        if (!targetPatient || !targetPatient.isPatient()) {
            throw new NotFoundException("Patient profile");
        }
        const canView = this.authorizationService.can(
            actor,
            Action.READ,
            Resource.PATIENT,
            targetPatient
        );

        if (!canView) {
            throw new AuthorizationException("You do not have permission to view this profile.");
        }
        return new PatientProfileResponse(targetPatient);
    }
}

module.exports = GetPatientProfileUseCase;