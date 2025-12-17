const CreatePaymentUrlRequest = require('../../application/dtos/payment/CreatePaymentUrlRequest');
const MomoIpnRequest = require('../../application/dtos/payment/MomoIpnRequest');

class PaymentController {
    constructor({ createPaymentUrlUseCase, handleMomoCallbackUseCase }) {
        this.createPaymentUrlUseCase = createPaymentUrlUseCase;
        this.handleMomoCallbackUseCase = handleMomoCallbackUseCase;
    }

    async createMomoUrl(req, res, next) {
        try {
            const { appointmentId } = req.body.appointmentId;
            const userId = req.user.id;
            const request = new CreatePaymentUrlRequest({
                userId,
                appointmentId,
                method: 'MOMO'
            });
            const result = await this.createPaymentUrlUseCase.execute(request);
            return res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async handleMomoIpn(req, res, next) {
        try {
            res.status(204).send();
            const ipnRequest = new MomoIpnRequest(req.body);
            this.handleMomoCallbackUseCase.execute(ipnRequest)
                .catch(err => console.error("❌ Lỗi xử lý IPN ngầm:", err));

        } catch (error) {
            console.error("Payment Controller Error:", error);
        }
    }

}

module.exports = PaymentController;