class DeleteUserRequest {
    constructor({ currentUserId, targetUserId }) {
        this.currentUserId = currentUserId;
        this.targetUserId = targetUserId;
    }
}

module.exports = DeleteUserRequest;