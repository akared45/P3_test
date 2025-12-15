const NotificationResponse = require('../../dtos/notification/NotificationResponse');

class GetNotificationsUseCase {
    constructor({ notificationRepository }) {
        this.notificationRepository = notificationRepository;
    }

    async execute(request) {
        const { userId, limit, offset } = request;

        const notifications = await this.notificationRepository.findByUserId(userId, limit, offset);
        const unreadCount = await this.notificationRepository.countUnread(userId);

        return {
            notifications: NotificationResponse.fromEntities(notifications),
            unreadCount
        };
    }
}

module.exports = GetNotificationsUseCase;