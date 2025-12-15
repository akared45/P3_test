const { NotImplementedException } = require('../exceptions');

class IMomoPaymentService {
    async createPaymentUrl({ orderId, amount, orderInfo, returnUrl, notifyUrl }) {
        throw new NotImplementedException();
    }

    verifySignature(momoData) {
        throw new NotImplementedException();
    }
}

module.exports = IMomoPaymentService;