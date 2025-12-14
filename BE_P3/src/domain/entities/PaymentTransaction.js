class PaymentTransaction {
    constructor({
        id,
        appointmentId,
        amount,
        method,
        status,
        transactionId,
        rawResponse,
        createdAt = new Date()
    }) {
        this.id = id;
        this.appointmentId = appointmentId;
        this.amount = amount;
        this.method = method;
        this.status = status;
        this.transactionId = transactionId;
        this.rawResponse = rawResponse;
        this.createdAt = createdAt;
    }
}
module.exports = PaymentTransaction;