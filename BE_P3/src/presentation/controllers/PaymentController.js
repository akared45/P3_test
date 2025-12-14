const CreatePaymentUrlRequest = require('../../application/dtos/payment/CreatePaymentUrlRequest');
const MomoIpnRequest = require('../../application/dtos/payment/MomoIpnRequest');

class PaymentController {
    constructor({ createPaymentUrlUseCase, handleMomoCallbackUseCase }) {
        this.createPaymentUrlUseCase = createPaymentUrlUseCase;
        this.handleMomoCallbackUseCase = handleMomoCallbackUseCase;
    }

    // [API] POST /api/payment/momo/create-url
    // Frontend gọi cái này khi user bấm "Thanh toán bằng MoMo"
    async createMomoUrl(req, res, next) {
        try {
            const { appointmentId } = req.body;
            const userId = req.user.id; // Lấy từ Token (đã qua AuthMiddleware)

            // 1. Tạo DTO Request
            const request = new CreatePaymentUrlRequest({
                userId,
                appointmentId,
                method: 'MOMO'
            });

            // 2. Gọi UseCase
            const result = await this.createPaymentUrlUseCase.execute(request);

            // 3. Trả về link cho Frontend redirect
            return res.json(result); // { payUrl: 'https://test-payment.momo.vn/...' }
        } catch (error) {
            next(error);
        }
    }

    // [API] POST /api/payment/momo/ipn
    // MoMo Server tự động gọi cái này (Webhook)
    async handleMomoIpn(req, res, next) {
        try {
            // [QUAN TRỌNG] MoMo yêu cầu phản hồi cực nhanh (< 2s)
            // Nếu không MoMo sẽ coi là timeout và gọi lại nhiều lần -> Duplicate giao dịch
            // Nên ta trả về 204 (No Content) ngay lập tức.
            res.status(204).send();

            console.log("📨 Nhận Webhook từ MoMo:", req.body);

            // 1. Map body sang DTO
            const ipnRequest = new MomoIpnRequest(req.body);

            // 2. Xử lý logic nghiệp vụ ngầm (Background)
            // Không cần await để tránh block request, nhưng nên catch lỗi để log
            this.handleMomoCallbackUseCase.execute(ipnRequest)
                .catch(err => console.error("❌ Lỗi xử lý IPN ngầm:", err));

        } catch (error) {
            // Lỗi ở tầng Controller thì log ra thôi, không return error cho MoMo
            console.error("Payment Controller Error:", error);
        }
    }
}

module.exports = PaymentController;