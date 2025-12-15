const IPaymentRepository = require('../../../../domain/repositories/IPaymentRepository');
const PaymentTransactionModel = require('../models/PaymentTransactionModel');
const PaymentTransactionMapper = require('../mappers/PaymentTransactionMapper');

class MongoPaymentRepository extends IPaymentRepository {
    
    async save(paymentTransaction) {
        const data = PaymentTransactionMapper.toPersistence(paymentTransaction);
        
        const newTransaction = await PaymentTransactionModel.create(data);
        return PaymentTransactionMapper.toDomain(newTransaction);
    }

    async findByAppointmentId(appointmentId) {
        const docs = await PaymentTransactionModel.find({ appointmentId }).sort({ createdAt: -1 });
        return docs.map(doc => PaymentTransactionMapper.toDomain(doc));
    }

    async findByTransactionId(transId) {
        const doc = await PaymentTransactionModel.findOne({ transactionId: transId });
        return PaymentTransactionMapper.toDomain(doc);
    }
}

module.exports = MongoPaymentRepository;