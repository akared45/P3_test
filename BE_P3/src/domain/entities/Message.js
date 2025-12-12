const { MessageType } = require('../enums');
const AIAnalysis = require('../value_objects/AIAnalysis');

class Message {
    constructor({
        id,
        senderId,
        appointmentId,
        content = '',
        type = MessageType.TEXT,
        fileUrl = null,
        isRead = false,
        aiAnalysis = null,
        createdAt = new Date()
    }) {
        if (!senderId) throw new Error("Message must have a senderId");
        if (!appointmentId) throw new Error("Message must belong to an appointmentId");
        if (type === MessageType.TEXT && !content && !fileUrl) {
            throw new Error("Message content is required for TEXT type");
        }

        this.id = id;
        this.senderId = senderId;
        this.appointmentId = appointmentId;
        this.type = Object.values(MessageType).includes(type) ? type : MessageType.TEXT;
        this.content = content ? content.trim() : '';
        this.fileUrl = fileUrl;
        this.isRead = Boolean(isRead);
        this.aiAnalysis = aiAnalysis ? new AIAnalysis(aiAnalysis) : null;
        this.createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt);
        Object.freeze(this);
    }
}

module.exports = Message;