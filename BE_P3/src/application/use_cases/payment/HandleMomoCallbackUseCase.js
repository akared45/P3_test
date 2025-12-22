const PaymentTransaction = require("../../../domain/entities/PaymentTransaction");
const Notification = require("../../../domain/entities/Notification");
const NotificationType = require("../../../domain/enums/NotificationType");
const { PaymentMethod, PaymentStatus } = require("../../../domain/enums");
const { format } = require("date-fns");

class HandleMomoCallbackUseCase {
    constructor({
        appointmentRepository,
        paymentRepository,
        momoPaymentService,
        socketService,
        notificationRepository,
        userRepository,
        emailService,
    }) {
        this.appointmentRepository = appointmentRepository;
        this.paymentRepository = paymentRepository;
        this.momoPaymentService = momoPaymentService;
        this.socketService = socketService;
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    async execute(momoRequest) {
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
            signature: momoRequest.signature,
        });

        if (!isValidSignature) {
            console.error("Momo Signature Mismatch! Possible fraud detected.");
            return { success: false, message: "Invalid Signature" };
        }

        const realAppointmentId = momoRequest.orderId.split("_")[0];
        const appointment = await this.appointmentRepository.findById(realAppointmentId);

        if (!appointment) {
            console.error(`Appointment ID not found: ${realAppointmentId}`);
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
            rawResponse: JSON.stringify(momoRequest),
        });

        await this.paymentRepository.save(transaction);

        if (isSuccess) {
            const paidAppointment = appointment.markAsPaid(PaymentMethod.MOMO, momoRequest.transId);
            await this.appointmentRepository.save(paidAppointment);

            const patient = await this.userRepository.findById(paidAppointment.patientId);
            if (patient && patient.email) {
                const apptDate = new Date(paidAppointment.appointmentDate);
                const dateStr = format(apptDate, "dd/MM/yyyy");
                const timeStr = format(apptDate, "HH:mm");
                this.emailService.sendPaymentSuccessEmail({
                    to: patient.email,
                    name: patient.profile?.fullName || patient.username,
                    appointmentId: realAppointmentId,
                    doctorName: paidAppointment.doctorName,
                    date: dateStr,
                    time: timeStr,
                    amount: momoRequest.amount,
                    transactionId: momoRequest.transId,
                });
            }

            const patientIdStr = paidAppointment.patientId.toString();
            this.socketService.sendToUser(patientIdStr, "payment_success", {
                realAppointmentId,
                status: "PAID",
                message: "Payment successful! Appointment has been confirmed.",
            });

            const noti = new Notification({
                userId: patientIdStr,
                title: "Payment Successful",
                message: `Your appointment with Dr. ${paidAppointment.doctorName} has been confirmed.`,
                type: NotificationType.BOOKING_SUCCESS,
                link: `/appointments`,
            });
            await this.notificationRepository.save(noti);
            this.socketService.sendToUser(patientIdStr, "new_notification", noti);

            const doctorIdStr = paidAppointment.doctorId.toString();
            this.socketService.sendToUser(doctorIdStr, "new_notification", {
                title: "New appointment paid",
                message: `Patient ${paidAppointment.patientName} has paid and confirmed the appointment.`,
                link: `/doctor/appointments`,
            });
        }

        return { success: true };
    }
}

module.exports = HandleMomoCallbackUseCase;
