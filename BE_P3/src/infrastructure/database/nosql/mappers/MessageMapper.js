const Message = require('../../../../domain/entities/Message');

class MessageMapper {
    static toPersistence(entity) {
        return {
            _id: entity.id,
            senderId: entity.senderId,
            appointmentId: entity.appointmentId,
            content: entity.content,
            type: entity.type,
            fileUrl: entity.fileUrl,
            isRead: entity.isRead,
            aiAnalysis: entity.aiAnalysis ? { ...entity.aiAnalysis } : null,
            createdAt: entity.createdAt
        };
    }

    static toDomain(doc) {
        if (!doc) return null;
        const data = doc.toObject ? doc.toObject() : doc;
        
        return new Message({
            id: data._id.toString(),
            senderId: data.senderId,
            appointmentId: data.appointmentId,
            content: data.content,
            type: data.type,
            fileUrl: data.fileUrl,
            isRead: data.isRead,
            aiAnalysis: data.aiAnalysis,
            createdAt: data.createdAt
        });
    }
}

module.exports = MessageMapper;