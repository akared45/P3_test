const IMessageRepository = require('../../../../domain/repositories/IMessageRepository');
const MessageModel = require('../models/MessageModel');
const MessageMapper = require('../mappers/MessageMapper');

class MongoMessageRepository extends IMessageRepository {
    async save(messageEntity) {
        const data = MessageMapper.toPersistence(messageEntity);
        if (data._id) {
            delete data._id;
        } else {
            delete data._id;
            const newDoc = await MessageModel.create(data);
            return MessageMapper.toDomain(newDoc);
        }
    }

    async findByAppointmentId(appointmentId, limit = 50, offset = 0) {
        const docs = await MessageModel.find({ appointmentId })
            .sort({ createdAt: 1 })
            .skip(offset)
            .limit(limit)
            .lean();
        return docs.map(doc => MessageMapper.toDomain(doc));
    }

    async markAllAsRead(appointmentId, userId) {
        await MessageModel.updateMany(
            {
                appointmentId,
                senderId: { $ne: userId },
                isRead: false
            },
            { $set: { isRead: true } }
        );
    }
}

module.exports = MongoMessageRepository;