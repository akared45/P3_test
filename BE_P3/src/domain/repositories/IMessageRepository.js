const { NotImplementedException } = require('../exceptions');

class IMessageRepository {
    async save(messageEntity) {
        throw new NotImplementedException();
    }

    async findByAppointmentId(appointmentId, limit = 50, offset = 0) {
        throw new NotImplementedException();
    }

    async markAsRead(appointmentId, readerId) {
        throw new NotImplementedException();
    }
}

module.exports = IMessageRepository;