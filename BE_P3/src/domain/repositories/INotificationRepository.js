const { NotImplementedException } = require('../exceptions');

class INotificationRepository {
    async save(notificationEntity) {
        throw new NotImplementedException('INotificationRepository.save');
    }

    async findByUserId(userId, limit = 20, offset = 0) {
        throw new NotImplementedException('INotificationRepository.findByUserId');
    }

    async countUnread(userId) {
        throw new NotImplementedException('INotificationRepository.countUnread');
    }

    async markAllAsRead(userId) {
        throw new NotImplementedException('INotificationRepository.markAllAsRead');
    }

    async markAsRead(notificationId) {
        throw new NotImplementedException('INotificationRepository.markAsRead');
    }

    async findById(id) {
        throw new NotImplementedException('INotificationRepository.findById');
    }

    async deleteById(id) {
        throw new NotImplementedException('INotificationRepository.deleteById');
    }
}

module.exports = INotificationRepository;