class CreatePaymentUrlRequest {
    constructor({ userId, appointmentId, method }) {
        if (!userId) throw new Error("Missing userId");
        if (!appointmentId) throw new Error("Missing appointmentId");
        this.userId = userId;
        this.appointmentId = appointmentId;
        this.method = method || 'VNPAY'; 
    }
}

module.exports = CreatePaymentUrlRequest;