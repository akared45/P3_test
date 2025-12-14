const PaymentTransaction = require('../../../../domain/entities/PaymentTransaction');

class PaymentTransactionMapper {
    static toDomain(doc) {
        if (!doc) return null;
        const data = doc.toObject ? doc.toObject() : doc;

        return new PaymentTransaction({
            id: data._id.toString(),
            appointmentId: data.appointmentId,
            amount: data.amount,
            method: data.method,
            status: data.status,
            transactionId: data.transactionId,
            rawResponse: data.rawResponse,
            createdAt: data.createdAt
        });
    }

    static toPersistence(entity) {
        return {
            _id: entity.id, 
            appointmentId: entity.appointmentId,
            amount: entity.amount,
            method: entity.method,
            status: entity.status,
            transactionId: entity.transactionId,
            rawResponse: entity.rawResponse,
            createdAt: entity.createdAt
        };
    }
}

module.exports = PaymentTransactionMapper;