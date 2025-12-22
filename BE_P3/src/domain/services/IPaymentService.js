class IPaymentService {
    async createPaymentUrl(params) {
        throw new Error("Method 'createPaymentUrl' must be implemented");
    }

    verifySignature(responseData) {
        throw new Error("Method 'verifySignature' must be implemented");
    }
}

module.exports = IPaymentService;