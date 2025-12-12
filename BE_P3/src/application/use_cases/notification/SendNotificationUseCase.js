const { NotificationType } = require('../../../domain/enums');

class SendNotificationUseCase {
    constructor({ socketService, notificationRepository }) {
        this.socketService = socketService;
        this.notificationRepository = notificationRepository;
    }

    async execute({ userId, title, message, type = NotificationType.SYSTEM }) {
        const notification = {
            userId,
            type,
            title,
            message,
            read: false,
            createdAt: new Date()
        };
        const savedNoti = await this.notificationRepository.save(notification);
        this.socketService.emitToUser(userId, 'new_notification', savedNoti);
    }
}

module.exports = SendNotificationUseCase;