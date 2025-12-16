const MessageResponse = require('../../dtos/chat/MessageResponse');

class GetChatHistoryUseCase {
    constructor({ messageRepository, appointmentRepository }) {
        this.messageRepository = messageRepository;
        this.appointmentRepository = appointmentRepository;
    }

    async execute(appointmentId, userId) {
        const appointment = await this.appointmentRepository.findById(appointmentId);

        if (!appointment) {
            throw new Error("Lịch hẹn không tồn tại");
        }

        if (appointment.patientId !== userId && appointment.doctorId !== userId) {
            throw new Error("Bạn không có quyền truy cập cuộc hội thoại này");
        }

        if (appointment.status === 'pending' || appointment.status === 'cancelled') {
            throw new Error("Cuộc hẹn chưa sẵn sàng hoặc đã bị hủy.");
        }

        const sessionCheck = appointment.isSessionActive();

        if (!sessionCheck.allowed && sessionCheck.code === 'TOO_EARLY') {
            throw new Error(sessionCheck.message);
        }

        const messages = await this.messageRepository.findByAppointmentId(appointmentId);

        return messages.map(msg => MessageResponse.fromEntity(msg));
    }
}

module.exports = GetChatHistoryUseCase;