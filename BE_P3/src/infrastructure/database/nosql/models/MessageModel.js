const mongoose = require('mongoose');
const MessageType = require('../../../../domain/enums/MessageType');

const MessageSchema = new mongoose.Schema({
    senderId: {
        type: String,
        required: true
    },
    appointmentId: {
        type: String,
        required: true,
        index: true
    },
    content: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        enum: Object.values(MessageType),
        default: MessageType.TEXT
    },
    fileUrl: {
        type: String,
        default: null
    },
    isRead: {
        type: Boolean,
        default: false
    },
    aiAnalysis: {
        suggestedSpecialty: String,
        reasoning: String,
        confidence: Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'messages',
    versionKey: false
});

module.exports = mongoose.model('Message', MessageSchema);