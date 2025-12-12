const { Action, Resource, UserType } = require('../../../domain/enums');
const { AuthorizationException } = require('../../../domain/exceptions');

class GetPatientListUseCase {
    constructor({ userRepository, authorizationService }) {
        this.userRepository = userRepository;
        this.authorizationService = authorizationService;
    }

    async execute(request) {
        const { currentUserId, options } = request;

        const actor = await this.userRepository.findById(currentUserId);
        if (!actor) {
            throw new AuthorizationException("User not found");
        }

        const canView = this.authorizationService.can(
            actor,
            Action.READ,
            Resource.PATIENT,
            null
        );

        if (!canView) {
            throw new AuthorizationException("You do not have permission to view patient list.");
        }

        const patients = await this.userRepository.findAllByUserType(UserType.PATIENT, options);

        return patients;
    }
}

module.exports = GetPatientListUseCase;