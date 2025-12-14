class GetNotificationsRequest {
    constructor({ userId, limit, offset }) {
        if (!userId) throw new Error("GetNotificationsRequest: Missing userId");

        this.userId = userId;
        this.limit = (limit && parseInt(limit) > 0) ? parseInt(limit) : 20;
        this.offset = (offset && parseInt(offset) >= 0) ? parseInt(offset) : 0;
    }
}

module.exports = GetNotificationsRequest;