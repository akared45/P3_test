class UpdatePatientRequest {
    constructor(data) {
        this.currentUserId = data.currentUserId; 
        this.targetPatientId = data.targetPatientId;
        this.fullName = data.fullName;
        this.gender = data.gender;
        this.dateOfBirth = data.dateOfBirth;
        this.avatarUrl = data.avatarUrl;
        this.phone = data.phone; 
        this.address = data.address;
        this.medicalConditions = data.medicalConditions || [];
        this.allergies = data.allergies || [];
    }
}
module.exports = UpdatePatientRequest;