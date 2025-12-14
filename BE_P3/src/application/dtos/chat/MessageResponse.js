class MessageResponse {
    constructor({ id, senderId, appointmentId, content, type, fileUrl, isRead, createdAt }) {
        this.id = id;
        this.senderId = senderId;
        this.appointmentId = appointmentId;
        this.content = content;
        this.type = type;
        this.fileUrl = fileUrl;
        this.isRead = isRead;
        this.createdAt = createdAt;
    }

    static fromEntity(entity) {
        return new MessageResponse({
            id: entity.id,
            senderId: entity.senderId,
            appointmentId: entity.appointmentId,
            content: entity.content,
            type: entity.type,
            fileUrl: entity.fileUrl,
            isRead: entity.isRead,
            createdAt: entity.createdAt
        });
    }
}

module.exports = MessageResponse;