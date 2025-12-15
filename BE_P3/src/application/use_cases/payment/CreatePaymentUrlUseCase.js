class CreatePaymentUrlUseCase {
    constructor({ appointmentRepository, momoPaymentService }) {
        this.appointmentRepository = appointmentRepository;
        this.momoPaymentService = momoPaymentService;
    }

    async execute(request) {
        const { appointmentId, userId } = request;

        const appointment = await this.appointmentRepository.findById(appointmentId);
        const orderId = `${appointmentId}_${new Date().getTime()}`;
        if (!appointment) {
            throw new Error("Lịch hẹn không tồn tại");
        }

        if (appointment.patientId.toString() !== userId.toString()) {
            throw new Error("Bạn không có quyền thanh toán cho lịch hẹn này");
        }

        if (appointment.status !== 'pending' && appointment.paymentStatus === 'PAID') {
            throw new Error("Lịch hẹn này đã được thanh toán hoặc không ở trạng thái chờ.");
        }

        const amount = 1000;
        const uniqueOrderId = `${appointmentId}_${new Date().getTime()}`;
        const notifyUrl = `${process.env.BACKEND_URL}/api/payment/momo/ipn`;
        const returnUrl = `${process.env.FRONTEND_URL}/payment-result`;
        const payUrl = await this.momoPaymentService.createPaymentUrl({
            orderId: uniqueOrderId,
            amount: amount,
            orderInfo: `Thanh toan lich hen ${appointmentId}`,
            returnUrl,
            notifyUrl
        });

        return { payUrl };
    }
}

module.exports = CreatePaymentUrlUseCase;