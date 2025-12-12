class UpdateDoctorRequest {
    constructor(data) {
        this.currentUserId = data.currentUserId;
        this.targetDoctorId = data.targetDoctorId;
        this.bio = data.bio;
        this.avatarUrl = data.avatarUrl;
        this.isActive = data.isActive;
        this.qualifications = data.qualifications;
        this.workHistory = data.workHistory;
        this.licenseNumber = data.licenseNumber;
        this.qualifications = data.qualifications || [];
        this.workHistory = data.workHistory || [];
        this.schedules = data.schedules || [];
        this.avatarUrl = data.avatarUrl;
    }
}

module.exports = UpdateDoctorRequest;