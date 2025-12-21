// src/application/use_cases/payment/CreateVnPayUrlUseCase.js
class CreateVnPayUrlUseCase {
    constructor({ appointmentRepository, paymentService }) {
        this.appointmentRepository = appointmentRepository;
        this.paymentService = paymentService;
    }

    async execute(request) {
        const { appointmentId, userId, ipAddr } = request;

        console.log(`>>> UseCase: Finding appointment ${appointmentId} for user ${userId}`);

        const appointment = await this.appointmentRepository.findById(appointmentId);
        
        if (!appointment) {
            throw new Error("Lịch hẹn không tồn tại");
        }
        
        if (appointment.patientId.toString() !== userId.toString()) {
            throw new Error("Bạn không có quyền thanh toán cho lịch hẹn này");
        }

        // 4. Kiểm tra trạng thái thanh toán
        if (appointment.paymentStatus === 'PAID') {
            throw new Error("Lịch hẹn này đã được thanh toán");
        }

        // 5. Cấu hình các tham số cho VNPAY
        // Dùng số tiền từ Database thay vì fix cứng 50000
        const amount = appointment.amount || 50000; 
        const returnUrl = `${process.env.CLIENT_URL}/payment-result`;

        // QUAN TRỌNG: orderId GỬI SANG VNPAY PHẢI LÀ appointmentId 
        // Để khi VNPAY trả về vnp_TxnRef, ta dùng nó tìm lại đúng lịch hẹn trong DB
        const payUrl = await this.paymentService.createPaymentUrl({
            orderId: appointmentId, 
            amount: amount,
            ipAddr: ipAddr,
            returnUrl: returnUrl
        });

        // 6. Cập nhật URL thanh toán vào DB (nếu cần lưu vết)
        if (typeof appointment.updatePaymentUrl === 'function') {
            appointment.updatePaymentUrl(payUrl);
            await this.appointmentRepository.save(appointment);
        }

        return { payUrl };
    }
}

module.exports = CreateVnPayUrlUseCase;