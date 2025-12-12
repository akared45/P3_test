const IMessageRepository = require('../../../../domain/repositories/IMessageRepository');
const MessageModel = require('../models/MessageModel');
const Message = require('../../../../domain/entities/Message');

class MongoMessageRepository extends IMessageRepository {

    _toDomain(doc) {
        if (!doc) return null;
        return new Message({
            id: doc._id.toString(),
            senderId: doc.senderId,
            appointmentId: doc.appointmentId,
            content: doc.content,
            type: doc.type,
            fileUrl: doc.fileUrl,
            isRead: doc.isRead,
            createdAt: doc.createdAt,
            aiAnalysis: doc.aiAnalysis
        });
    }

    async save(messageEntity) {
        const newMsg = await MessageModel.create({
            senderId: messageEntity.senderId,
            appointmentId: messageEntity.appointmentId,
            content: messageEntity.content,
            type: messageEntity.type,
            fileUrl: messageEntity.fileUrl,
            isRead: messageEntity.isRead,
            aiAnalysis: messageEntity.aiAnalysis ? { ...messageEntity.aiAnalysis } : null
        });
        return this._toDomain(newMsg);
    }

    async findByAppointmentId(appointmentId, limit = 50, offset = 0) {
        const docs = await MessageModel.find({ appointmentId })
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(limit)
            .lean();

        return docs.reverse().map(doc => this._toDomain(doc));
    }
}

module.exports = MongoMessageRepository;