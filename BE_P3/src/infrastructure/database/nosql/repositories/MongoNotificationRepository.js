const INotificationRepository = require('../../../../domain/repositories/INotificationRepository');
const NotificationModel = require('../models/NotificationModel');
const NotificationMapper = require('../mappers/NotificationMapper');

class MongoNotificationRepository extends INotificationRepository {
    async save(notificationEntity) {
        const data = NotificationMapper.toPersistence(notificationEntity);
        if (data._id) {
            const updatedDoc = await NotificationModel.findByIdAndUpdate(data._id, data, { new: true }).lean();
            return NotificationMapper.toDomain(updatedDoc);
        } else {
            delete data._id;
            const newDoc = await NotificationModel.create(data);
            return NotificationMapper.toDomain(newDoc);
        }
    }

    async findById(id) {
        const doc = await NotificationModel.findById(id).lean();
        if (!doc) return null;
        return NotificationMapper.toDomain(doc);
    }

    async findByUserId(userId, limit = 20, offset = 0) {
        const docs = await NotificationModel.find({ userId })
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(limit)
            .lean();
        return docs.map(doc => NotificationMapper.toDomain(doc));
    }

    async countUnread(userId) {
        return await NotificationModel.countDocuments({ userId, isRead: false });
    }

    async markAsRead(notificationId, userId) {
        await NotificationModel.findOneAndUpdate(
            { _id: notificationId, userId },
            { $set: { isRead: true } }
        );
    }

    async markAllAsRead(userId) {
        await NotificationModel.updateMany(
            { userId, isRead: false },
            { $set: { isRead: true } }
        );
    }

    async deleteById(id) {
        return await NotificationModel.findByIdAndDelete(id);
    }
}

module.exports = MongoNotificationRepository;