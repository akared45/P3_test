const PaymentTransaction = require('../../../domain/entities/PaymentTransaction');
const { PaymentMethod, PaymentStatus } = require('../../../domain/enums');
const { format } = require('date-fns');

class HandleVnPayCallbackUseCase {
    constructor({
        appointmentRepository,
        paymentRepository,
        paymentService,
        socketService,
        userRepository, 
        emailService
    }) {
        this.appointmentRepository = appointmentRepository;
        this.paymentRepository = paymentRepository;
        this.paymentService = paymentService;
        this.socketService = socketService;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    async execute(vnpayData) {
        const isValid = this.paymentService.verifySignature(vnpayData);
        if (!isValid) {
            console.error("VNPAY Signature Mismatch!");
            return { success: false, message: "Invalid Signature" };
        }

        const realAppointmentId = vnpayData.vnp_TxnRef.split('_')[0];
        const appointment = await this.appointmentRepository.findById(realAppointmentId);

        if (!appointment) {
            return { success: false, message: "Appointment not found" };
        }

        const isSuccess = vnpayData.vnp_ResponseCode === '00';
        
        const transaction = new PaymentTransaction({
            appointmentId: appointment.id,
            amount: Number(vnpayData.vnp_Amount) / 100,
            method: PaymentMethod.VNPAY,
            status: isSuccess ? PaymentStatus.PAID : PaymentStatus.FAILED,
            transactionId: vnpayData.vnp_TransactionNo,
            rawResponse: JSON.stringify(vnpayData)
        });
        await this.paymentRepository.save(transaction);

        if (isSuccess) {
            const paidAppointment = appointment.markAsPaid(PaymentMethod.VNPAY, vnpayData.vnp_TransactionNo);
            await this.appointmentRepository.save(paidAppointment);
            
            const patient = await this.userRepository.findById(paidAppointment.patientId);
            if (patient && patient.email) {
                await this.emailService.sendPaymentSuccessEmail({
                    to: patient.email,
                    name: patient.profile?.fullName || patient.username,
                    appointmentId: realAppointmentId,
                    amount: Number(vnpayData.vnp_Amount) / 100
                });
                console.log(`Đã gửi email xác nhận thành công tới: ${patient.email}`);
            }

            this.socketService.sendToUser(paidAppointment.patientId.toString(), 'payment_success', {
                realAppointmentId,
                status: 'PAID'
            });
        }

        return { success: isSuccess };
    }
}

module.exports = HandleVnPayCallbackUseCase;