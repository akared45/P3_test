class MarkNotificationReadRequest {
    constructor({ userId, notificationId }) {
        if (!userId) throw new Error("MarkNotificationReadRequest: Missing userId");
        if (!notificationId) throw new Error("MarkNotificationReadRequest: Missing notificationId");

        this.userId = userId;
        this.notificationId = notificationId;
    }
}

module.exports = MarkNotificationReadRequest;