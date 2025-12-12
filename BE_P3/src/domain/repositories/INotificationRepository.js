const { NotImplementedException } = require('../exceptions');

class INotificationRepository {
    async save(notification) {
        throw new NotImplementedException('INotificationRepository.save');
    }

    async findByUserId(userId, limit = 20, offset = 0) {
        throw new NotImplementedException('INotificationRepository.findByUserId');
    }

    async countUnread(userId) {
        throw new NotImplementedException('INotificationRepository.countUnread');
    }

    async markAsRead(id) {
        throw new NotImplementedException('INotificationRepository.markAsRead');
    }

    async markAllAsRead(userId) {
        throw new NotImplementedException('INotificationRepository.markAllAsRead');
    }
}

module.exports = INotificationRepository;