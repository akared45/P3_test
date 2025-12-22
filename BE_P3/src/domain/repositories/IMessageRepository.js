const { NotImplementedException } = require('../exceptions');

class IMessageRepository {
    async save(messageEntity) {
        throw new NotImplementedException();
    }

    async findByAppointmentId(appointmentId, limit, offset) {
        throw new NotImplementedException();
    }

    async markAllAsRead(appointmentId, userId) {
        throw new NotImplementedException();
    }
}

module.exports = IMessageRepository;