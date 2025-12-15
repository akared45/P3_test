const MessageResponse = require('../../dtos/chat/MessageResponse');

class GetChatHistoryUseCase {
    constructor({ messageRepository }) {
        this.messageRepository = messageRepository;
    }

    async execute(appointmentId) {
        const messages = await this.messageRepository.findByAppointmentId(appointmentId);
        return messages.map(msg => MessageResponse.fromEntity(msg));
    }
}

module.exports = GetChatHistoryUseCase;