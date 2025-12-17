class DeleteNotificationUseCase {
    constructor({ notificationRepository }) {
        this.notificationRepository = notificationRepository;
    }

    async execute({ notificationId, userId }) {
        const notification = await this.notificationRepository.findById(notificationId);

        if (!notification) {
            throw new Error("Thông báo không tồn tại.");
        }

        if (notification.userId.toString() !== userId.toString()) {
            throw new Error("Bạn không có quyền xóa thông báo này.");
        }

        await this.notificationRepository.deleteById(notificationId);

        return { success: true, message: "Xóa thông báo thành công" };
    }
}

module.exports = DeleteNotificationUseCase;