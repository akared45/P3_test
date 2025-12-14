const { NotImplementedException } = require('../exceptions');

class IPaymentRepository {
    async save(paymentTransaction) {
        throw new NotImplementedException();
    }

    async findByAppointmentId(appointmentId) {
        throw new NotImplementedException();
    }

    async findByTransactionId(transId) {
        throw new NotImplementedException();
    }
}

module.exports = IPaymentRepository;