class CreateDoctorRequest {
    constructor(data) {
        this.currentUserId = data.currentUserId;
        this.email = data.email;
        this.username = data.username;
        this.password = data.password;
        this.fullName = data.fullName;
        this.licenseNumber = data.licenseNumber;
        this.specCode = data.specCode;
        this.qualifications = data.qualifications || [];
        this.workHistory = data.workHistory || [];
        this.schedules = data.schedules || [];
        this.avatarUrl = data.avatarUrl;
    }
}
module.exports = CreateDoctorRequest;