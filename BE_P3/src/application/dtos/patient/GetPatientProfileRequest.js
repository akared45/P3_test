class GetPatientProfileRequest {
    constructor({ currentUserId, targetPatientId }) {
        this.currentUserId = currentUserId;
        this.targetPatientId = targetPatientId;
    }
}

module.exports = GetPatientProfileRequest;