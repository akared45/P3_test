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

        // 2. [SỬA]: Gom tất cả dữ liệu (bao gồm contacts) vào payload
        const profilePayload = {};
        if (fullName !== undefined) profilePayload.fullName = fullName;
        if (gender !== undefined) profilePayload.gender = gender;
        if (avatarUrl !== undefined) profilePayload.avatarUrl = avatarUrl;
        if (dateOfBirth !== undefined) profilePayload.dateOfBirth = dateOfBirth;
        
        // [QUAN TRỌNG]: Truyền contacts vào đây
        if (contacts !== undefined) profilePayload.contacts = contacts; 

        if (Object.keys(profilePayload).length > 0) {
            // Gọi updateProfile (nhớ là bạn đã sửa Entity Patient để xử lý contacts chưa?)
            updatedPatient = updatedPatient.updateProfile(profilePayload);
        }

        // [XÓA]: Đoạn code cũ dùng updateContactInfo(phone, address) vì giờ ta dùng mảng contacts rồi
        // if (phone !== undefined || address !== undefined) { ... } -> XÓA

        if (medicalConditions !== undefined || allergies !== undefined) {
            updatedPatient = updatedPatient.updateMedicalHistory(
                medicalConditions || updatedPatient.medicalConditions,
                allergies || updatedPatient.allergies
            );
        }

        // 3. [LƯU Ý]: Phải lưu updatedPatient (instance mới)
        await this.userRepository.save(updatedPatient);

        return updatedPatient;
    }
}
module.exports = UpdatePatientProfileUseCase;