class CreatePaymentUrlUseCase {
    constructor({ appointmentRepository, momoPaymentService }) {
        this.appointmentRepository = appointmentRepository;
        this.momoPaymentService = momoPaymentService;
    }

    async execute(request) {
        const { appointmentId, userId } = request;

        const appointment = await this.appointmentRepository.findById(appointmentId);

        if (!appointment) {
            throw new Error("Lịch hẹn không tồn tại");
        }
        const now = new Date();
        const appointmentTime = new Date(appointment.appointmentDate);

        if (now > appointmentTime) {
            throw new Error("Lịch hẹn đã quá hạn, không thể thanh toán.");
        }
        
        if (appointment.patientId.toString() !== userId.toString()) {
            throw new Error("Bạn không có quyền thanh toán cho lịch hẹn này");
        }

        if (appointment.paymentStatus === 'PAID') {
            throw new Error("Lịch hẹn này đã được thanh toán.");
        }

        const amount = 50000;
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
        const updatedAppointment = appointment.updatePaymentUrl(payUrl);

        await this.appointmentRepository.save(updatedAppointment);

        return { payUrl };
    }
}

module.exports = CreatePaymentUrlUseCase;