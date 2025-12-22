class DeleteNotificationUseCase {
    constructor({ notificationRepository }) {
        this.notificationRepository = notificationRepository;
    }

    async execute({ notificationId, userId }) {
        const notification = await this.notificationRepository.findById(notificationId);

        if (!notification) {
            throw new Error("Notification not found.");
        }

        if (notification.userId.toString() !== userId.toString()) {
            throw new Error("You are not authorized to delete this notification.");
        }

        await this.notificationRepository.deleteById(notificationId);

        return { success: true, message: "Notification deleted successfully" };
    }
}

module.exports = DeleteNotificationUseCase;
