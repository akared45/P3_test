const Notification = require('../../../../domain/entities/Notification');

class NotificationMapper {
    static toPersistence(entity) {
        return {
            _id: entity.id,
            userId: entity.userId,
            title: entity.title,
            message: entity.message,
            type: entity.type,
            isRead: entity.isRead,
            link: entity.link,
            createdAt: entity.createdAt
        };
    }

    static toDomain(doc) {
        if (!doc) return null;
        const data = doc.toObject ? doc.toObject() : doc;

        return new Notification({
            id: data._id.toString(),
            userId: data.userId,
            title: data.title,
            message: data.message,
            type: data.type,
            isRead: data.isRead,
            link: data.link,
            createdAt: data.createdAt
        });
    }
}

module.exports = NotificationMapper;