class NotificationResponse {
    constructor({ id, title, message, type, isRead, link, createdAt }) {
        this.id = id;
        this.title = title;
        this.message = message;
        this.type = type;
        this.isRead = isRead;
        this.link = link;
        this.createdAt = createdAt;
    }

    static fromEntity(entity) {
        return new NotificationResponse({
            id: entity.id,
            title: entity.title,
            message: entity.message,
            type: entity.type,
            isRead: entity.isRead,
            link: entity.link,
            createdAt: entity.createdAt
        });
    }

    static fromEntities(entities) {
        return entities.map(entity => NotificationResponse.fromEntity(entity));
    }
}

module.exports = NotificationResponse;