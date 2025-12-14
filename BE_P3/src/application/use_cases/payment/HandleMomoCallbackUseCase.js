const PaymentTransaction = require('../../../domain/entities/PaymentTransaction');
const Notification = require('../../../domain/entities/Notification');
const NotificationType = require('../../../domain/enums/NotificationType');
const { PaymentMethod, PaymentStatus } = require('../../../domain/enums');

class HandleMomoCallbackUseCase {
    constructor({
        appointmentRepository,
        paymentRepository,
        momoPaymentService,
        socketService,
        notificationRepository
    }) {
        this.appointmentRepository = appointmentRepository;
        this.paymentRepository = paymentRepository;
        this.momoPaymentService = momoPaymentService;
        this.socketService = socketService;
        this.notificationRepository = notificationRepository;
    }

    async execute(momoRequest) {
        console.log("Đang xử lý Momo IPN cho Order:", momoRequest.orderId);
        const isValidSignature = this.momoPaymentService.verifySignature({
            partnerCode: momoRequest.partnerCode,
            orderId: momoRequest.orderId,
            requestId: momoRequest.requestId,
            amount: momoRequest.amount,
            orderInfo: momoRequest.orderInfo,
            orderType: momoRequest.orderType,
            transId: momoRequest.transId,
            resultCode: momoRequest.resultCode,
            message: momoRequest.message,
            payType: momoRequest.payType,
            responseTime: momoRequest.responseTime,
            extraData: momoRequest.extraData,
            signature: momoRequest.signature
        });

        if (!isValidSignature) {
            console.error("Momo Signature Mismatch! Có thể là giả mạo.");
            return { success: false, message: "Invalid Signature" };
        }

        const appointmentId = momoRequest.orderId;
        const appointment = await this.appointmentRepository.findById(appointmentId);

        if (!appointment) {
            console.error(`Không tìm thấy Appointment ID: ${appointmentId}`);
            return { success: false, message: "Appointment not found" };
        }

        const isSuccess = momoRequest.resultCode === 0;
        const transactionStatus = isSuccess ? PaymentStatus.PAID : PaymentStatus.FAILED;

        const transaction = new PaymentTransaction({
            appointmentId: appointment.id,
            amount: momoRequest.amount,
            method: PaymentMethod.MOMO,
            status: transactionStatus,
            transactionId: momoRequest.transId,
            rawResponse: JSON.stringify(momoRequest)
        });
        await this.paymentRepository.save(transaction);

        if (isSuccess) {
            const paidAppointment = appointment.markAsPaid(PaymentMethod.MOMO, momoRequest.transId);

            await this.appointmentRepository.save(paidAppointment);
            console.log(`Appointment ${appointmentId} đã được xác nhận thanh toán.`);

            const patientIdStr = paidAppointment.patientId.toString();
            this.socketService.sendToUser(patientIdStr, 'payment_success', {
                appointmentId,
                status: 'PAID',
                message: "Thanh toán thành công! Lịch hẹn đã được xác nhận."
            });

            const noti = new Notification({
                userId: patientIdStr,
                title: "Thanh toán thành công",
                message: `Lịch hẹn với BS ${paidAppointment.doctorName} đã được xác nhận.`,
                type: NotificationType.BOOKING_SUCCESS,
                link: `/appointments`
            });
            await this.notificationRepository.save(noti);
            this.socketService.sendToUser(patientIdStr, 'new_notification', noti);

            const doctorIdStr = paidAppointment.doctorId.toString();
            this.socketService.sendToUser(doctorIdStr, 'new_notification', {
                title: "Lịch hẹn mới đã thanh toán",
                message: `Bệnh nhân ${paidAppointment.patientName} đã thanh toán và xác nhận lịch.`,
                link: `/doctor/appointments`
            });
        } else {
            console.log(`Thanh toán thất bại cho Appointment ${appointmentId}. Lý do: ${momoRequest.message}`);
        }

        return { success: true };
    }
}

module.exports = HandleMomoCallbackUseCase;