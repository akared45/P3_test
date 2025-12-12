const MessageResponse = require('../../dtos/chat/MessageResponse');

class GetChatHistoryUseCase {
    constructor({ messageRepository }) {
        this.messageRepository = messageRepository;
    }

    async execute({ appointmentId, limit, offset }) {
        const messages = await this.messageRepository.findByAppointmentId(appointmentId, limit, offset);
        return messages.map(msg => new MessageResponse(msg));
    }
}

module.exports = GetChatHistoryUseCase;