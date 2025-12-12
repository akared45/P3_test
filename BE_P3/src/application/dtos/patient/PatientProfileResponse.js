class PatientProfileResponse {
    constructor(patientEntity) {
        const getContactValue = (entity, type) => {
            if (!entity.contacts) return null;
            const contact = entity.contacts.find(c => c.type === type && c.isPrimary);
            return contact ? contact.value : null;
        };
        this.id = patientEntity.id.toString();
        this.email = patientEntity.email;
        this.username = patientEntity.username;
        this.userType = patientEntity.userType;
        const profile = patientEntity.profile;
        this.fullName = profile?.fullName || '';
        this.dateOfBirth = profile?.dateOfBirth || null;
        this.gender = profile?.gender || 'Other';
        this.avatarUrl = profile?.avatarUrl || null;
        this.phone = getContactValue(patientEntity, 'phone');
        this.address = getContactValue(patientEntity, 'address');
        this.medicalConditions = patientEntity.medicalConditions || [];
        this.allergies = patientEntity.allergies || [];
        this.isActive = patientEntity.isActive;
        this.isDeleted = patientEntity.isDeleted;
    }
}

module.exports = PatientProfileResponse;