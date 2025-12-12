const { NotImplementedException } = require('../exceptions');

class IAppointmentRepository {
    async save(appointmentEntity) {
        throw new NotImplementedException();
    }

    async findById(id) {
        throw new NotImplementedException();
    }

    async update(appointmentEntity) {
        throw new NotImplementedException();
    }

    async findOverlapping(doctorId, startTime, endTime) {
        throw new NotImplementedException();
    }

    async findBusySlots(doctorId, date) {
        throw new Error("ERR_METHOD_NOT_IMPLEMENTED");
    }

    async getBookedSlots(doctorId, startTime, endTime) {
        throw new NotImplementedException();
    }
}

module.exports = IAppointmentRepository;