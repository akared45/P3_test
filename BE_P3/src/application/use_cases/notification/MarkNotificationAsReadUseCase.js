class MarkNotificationAsReadUseCase {
    constructor({ notificationRepository }) {
        this.notificationRepository = notificationRepository;
    }

    async execute(request) {
        const { notificationId, userId } = request;

        if (notificationId === 'ALL') {
            await this.notificationRepository.markAllAsRead(userId);
        } else {
            await this.notificationRepository.markAsRead(notificationId, userId);
        }

        return { success: true };
    }
}

module.exports = MarkNotificationAsReadUseCase;