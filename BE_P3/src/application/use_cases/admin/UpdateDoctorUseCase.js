const { Action, Resource } = require('../../../domain/enums/Permission');
const { AuthorizationException, NotFoundException } = require('../../../domain/exceptions');

class UpdateDoctorUseCase {
    constructor({ userRepository, authorizationService }) {
        this.userRepository = userRepository;
        this.authorizationService = authorizationService;
    }

    async execute(request) {
        const { 
            currentUserId, targetDoctorId, 
            fullName, licenseNumber, specCode, isActive, 
            qualifications, workHistory, bio, schedules, avatarUrl
        } = request;

        const actor = await this.userRepository.findById(currentUserId);
        if (!actor) throw new AuthorizationException("User performing update not found");

        const targetDoctor = await this.userRepository.findById(targetDoctorId);
        if (!targetDoctor || !targetDoctor.isDoctor()) {
            throw new NotFoundException("Target doctor does not exist");
        }

        const canUpdate = this.authorizationService.can(
            actor, Action.UPDATE, Resource.DOCTOR, targetDoctor
        );
        if (!canUpdate) throw new AuthorizationException("Permission denied");

        const updatedDoctor = targetDoctor.updateDetails({
            fullName,
            licenseNumber,
            specCode,
            isActive,
            qualifications,
            workHistory,
            bio,
            schedules,
            avatarUrl
        });
        await this.userRepository.save(updatedDoctor);

        return {
            message: "Doctor updated successfully",
            id: updatedDoctor.id.toString()
        };
    }
}

module.exports = UpdateDoctorUseCase;