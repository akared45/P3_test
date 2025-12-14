const mongoose = require('mongoose');
const NotificationType = require('../../../../domain/enums/NotificationType');

const NotificationSchema = new mongoose.Schema({
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: Object.values(NotificationType), default: NotificationType.SYSTEM_ALERT },
    isRead: { type: Boolean, default: false },
    link: { type: String, default: null },
    createdAt: { type: Date, default: Date.now }
}, { 
    timestamps: false, 
    collection: 'notifications'
});

module.exports = mongoose.model('Notification', NotificationSchema);