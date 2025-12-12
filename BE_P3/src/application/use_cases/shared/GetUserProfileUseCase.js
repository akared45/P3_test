const { Action, Resource } = require('../../../domain/enums/Permission');
const { AuthorizationException, NotFoundException } = require('../../../domain/exceptions');

class GetUserProfileUseCase {
    constructor({ userRepository, authorizationService }) {
        this.userRepository = userRepository;
        this.authorizationService = authorizationService;
    }
    async execute(request) {
        const { currentUserId, targetUserId } = request;
        const actor = await this.userRepository.findById(currentUserId);
        if (!actor) {
            throw new AuthorizationException("User not found");
        }
        const targetUser = await this.userRepository.findById(targetUserId);
        if (!targetUser) {
            throw new NotFoundException("User profile");
        }
        const resource = targetUser.isDoctor() ? Resource.DOCTOR : Resource.PATIENT;

        const canView = this.authorizationService.can(
            actor,
            Action.READ,
            resource,
            targetUser
        );

        if (!canView) {
            throw new AuthorizationException("You do not have permission to view this profile.");
        }
        return targetUser;
    }
}

module.exports = GetUserProfileUseCase;