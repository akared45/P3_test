const { Action, Resource } = require('../../../domain/enums');
const { AuthorizationException, NotFoundException } = require('../../../domain/exceptions');

class UpdatePatientProfileUseCase {
    constructor({ userRepository, authorizationService }) {
        this.userRepository = userRepository;
        this.authorizationService = authorizationService;
    }

    async execute(request) {
        const { 
            currentUserId, 
            targetPatientId, 
            fullName, 
            gender, 
            dateOfBirth, 
            avatarUrl, 
            contacts, 
            medicalConditions, 
            allergies 
        } = request;

        const actor = await this.userRepository.findById(currentUserId);
        const targetPatient = await this.userRepository.findById(targetPatientId);

        if (!targetPatient || targetPatient.userType !== 'patient') throw new NotFoundException("Patient not found");

        const canUpdate = this.authorizationService.can(
            actor,
            Action.UPDATE,
            Resource.PATIENT,
            targetPatient
        );

        if (!canUpdate) {
            throw new AuthorizationException("You cannot update this profile");
        }

        let updatedPatient = targetPatient;

        const profilePayload = {};
        if (fullName !== undefined) profilePayload.fullName = fullName;
        if (gender !== undefined) profilePayload.gender = gender;
        if (avatarUrl !== undefined) profilePayload.avatarUrl = avatarUrl;
        if (dateOfBirth !== undefined) profilePayload.dateOfBirth = dateOfBirth;
        if (contacts !== undefined) profilePayload.contacts = contacts; 
        if (Object.keys(profilePayload).length > 0) {
            updatedPatient = updatedPatient.updateProfile(profilePayload);
        }
        if (medicalConditions !== undefined || allergies !== undefined) {
            updatedPatient = updatedPatient.updateMedicalHistory(
                medicalConditions || updatedPatient.medicalConditions,
                allergies || updatedPatient.allergies
            );
        }

        await this.userRepository.save(updatedPatient);

        return updatedPatient;
    }
}
module.exports = UpdatePatientProfileUseCase;