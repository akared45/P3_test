class CreatePaymentUrlUseCase {
    constructor({ appointmentRepository, momoPaymentService }) {
        this.appointmentRepository = appointmentRepository;
        this.momoPaymentService = momoPaymentService;
    }

    async execute(request) {
        const { appointmentId, userId } = request;

        const appointment = await this.appointmentRepository.findById(appointmentId);

        if (!appointment) {
            throw new Error("Appointment not found");
        }

        const now = new Date();
        const appointmentTime = new Date(appointment.appointmentDate);

        if (now > appointmentTime) {
            throw new Error("Appointment has expired and cannot be paid for.");
        }

        if (appointment.patientId.toString() !== userId.toString()) {
            throw new Error("You are not authorized to pay for this appointment");
        }

        if (appointment.paymentStatus === "PAID") {
            throw new Error("This appointment has already been paid.");
        }

        const amount = 50000;
        const uniqueOrderId = `${appointmentId}_${new Date().getTime()}`;
        const notifyUrl = `${process.env.BACKEND_URL}/api/payment/momo/ipn`;
        const returnUrl = `${process.env.CLIENT_URL}/payment-result`;

        const payUrl = await this.momoPaymentService.createPaymentUrl({
            orderId: uniqueOrderId,
            amount: amount,
            orderInfo: `Payment for appointment ${appointmentId}`,
            returnUrl,
            notifyUrl,
        });

        const updatedAppointment = appointment.updatePaymentUrl(payUrl);
        await this.appointmentRepository.save(updatedAppointment);

        return { payUrl };
    }
}

module.exports = CreatePaymentUrlUseCase;
