class DoctorResponse {
    constructor(doctor) {
        this.id = doctor.id.toString();
        this.username = doctor.username;
        this.email = doctor.email;
        this.fullName = doctor.profile.fullName;
        this.avatarUrl = doctor.profile.avatarUrl;
        this.licenseNumber = doctor.licenseNumber;
        this.specCode = doctor.specCode;
        this.isActive = doctor.isActive; 
        this.isEmailVerified = doctor.isEmailVerified;
    }
}
module.exports = DoctorResponse;