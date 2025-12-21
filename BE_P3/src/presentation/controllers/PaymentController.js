const CreatePaymentUrlRequest = require('../../application/dtos/payment/CreatePaymentUrlRequest');
const VnPayIpnRequest = require('../../application/dtos/payment/VnPayIpnRequest');
const AppointmentModel = require('../../infrastructure/database/nosql/models/AppointmentModel');

class PaymentController {
    constructor({ createVnPayUrlUseCase, handleVnPayCallbackUseCase, vnPayPaymentService }) {
        this.createVnPayUrlUseCase = createVnPayUrlUseCase;
        this.handleVnPayCallbackUseCase = handleVnPayCallbackUseCase;
        this.vnPayPaymentService = vnPayPaymentService;
    }

    createVnPayUrl = async (req, res, next) => {
        try {
            const { appointmentId } = req.body;
            const userId = req.user.id;

            const ipAddr = req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;

            if (!appointmentId) {
                return res.status(400).json({ message: "appointmentId là bắt buộc" });
            }

            const result = await this.createVnPayUrlUseCase.execute({
                appointmentId,
                userId, // Bây giờ userId đã có giá trị
                ipAddr
            });

            return res.json(result);
        } catch (error) {
            console.error(">>> Controller Error:", error.message);
            next(error);
        }
    }

    handleVnPayIpn = async (req, res) => {
        try {
            const vnpayRequest = new VnPayIpnRequest(req.query);
            const result = await this.handleVnPayCallbackUseCase.execute(vnpayRequest);
            if (result.success) {
                res.status(200).json({ RspCode: '00', Message: 'Confirm Success' });
            } else {
                res.status(200).json({ RspCode: '99', Message: 'Unknow Error' });
            }
        } catch (error) {
            console.error("VNPAY IPN Controller Error:", error.message);
            res.status(200).json({ RspCode: '97', Message: 'Checksum failed' });
        }
    }

    handleVnPayReturn = async (req, res, next) => {
        try {
            const vnp_Params = req.query;
            const isVerified = this.vnPayPaymentService.verifyReturn(vnp_Params);

            if (!isVerified) {
                return res.status(400).json({ message: "Chữ ký không hợp lệ (Checksum failed)" });
            }

            if (vnp_Params['vnp_ResponseCode'] !== '00') {
                return res.status(400).json({ message: "Giao dịch thất bại tại VNPAY" });
            }

            const appointmentId = vnp_Params['vnp_TxnRef'];
            const transactionNo = vnp_Params['vnp_TransactionNo'];

            const appointment = await AppointmentModel.findOne({ _id: appointmentId });

            if (!appointment) {
                return res.status(404).json({ message: "Không tìm thấy lịch hẹn" });
            }

            if (appointment.paymentStatus === 'PAID') {
                return res.status(200).json({ message: "Giao dịch đã được xử lý trước đó", data: appointment });
            }

            appointment.paymentStatus = 'PAID';
            appointment.paymentMethod = 'VNPAY';
            appointment.status = 'confirmed';
            appointment.transactionId = transactionNo;

            await appointment.save();

            console.log(`>>> UPDATE SUCCESS: Appointment ${appointmentId} is giờ đã PAID.`);

            return res.status(200).json({
                message: "Xác nhận thanh toán thành công",
                data: appointment
            });

        } catch (error) {
            console.error("Lỗi xử lý VNPAY Return:", error);
            next(error);
        }
    }
}

module.exports = PaymentController;