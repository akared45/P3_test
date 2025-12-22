class CreateVnPayUrlUseCase {
    constructor({ appointmentRepository, paymentService }) {
        this.appointmentRepository = appointmentRepository;
        this.paymentService = paymentService;
    }

    async execute(request) {
        const { appointmentId, userId, ipAddr } = request;

        const appointment = await this.appointmentRepository.findById(appointmentId);

        if (!appointment) {
            throw new Error("Appointment not found");
        }

        if (appointment.patientId.toString() !== userId.toString()) {
            throw new Error("You are not authorized to pay for this appointment");
        }

        if (appointment.paymentStatus === "PAID") {
            throw new Error("This appointment has already been paid");
        }

        const amount = appointment.amount || 50000;
        const returnUrl = `${process.env.CLIENT_URL}/payment-result`;

        const payUrl = await this.paymentService.createPaymentUrl({
            orderId: appointmentId,
            amount: amount,
            ipAddr: ipAddr,
            returnUrl: returnUrl
        });

        if (typeof appointment.updatePaymentUrl === 'function') {
            appointment.updatePaymentUrl(payUrl);
            await this.appointmentRepository.save(appointment);
        }

        return { payUrl };
    }
}

module.exports = CreateVnPayUrlUseCase;