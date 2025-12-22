const MessageResponse = require("../../dtos/chat/MessageResponse");

class GetChatHistoryUseCase {
    constructor({ messageRepository, appointmentRepository }) {
        this.messageRepository = messageRepository;
        this.appointmentRepository = appointmentRepository;
    }

    async execute(appointmentId, userId) {
        const appointment =
            await this.appointmentRepository.findById(appointmentId);

        if (!appointment) {
            throw new Error("Appointment not found");
        }

        if (
            appointment.patientId !== userId &&
            appointment.doctorId !== userId
        ) {
            throw new Error("You are not authorized to access this conversation");
        }

        if (
            appointment.status === "pending" ||
            appointment.status === "cancelled"
        ) {
            throw new Error("The appointment is not ready or has been cancelled");
        }

        const sessionCheck = appointment.isSessionActive();

        if (!sessionCheck.allowed && sessionCheck.code === "TOO_EARLY") {
            throw new Error(sessionCheck.message);
        }

        const messages =
            await this.messageRepository.findByAppointmentId(appointmentId);

        return messages.map((msg) => MessageResponse.fromEntity(msg));
    }
}

module.exports = GetChatHistoryUseCase;
