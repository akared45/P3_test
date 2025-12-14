const Message = require('../../../domain/entities/Message');
const MessageResponse = require('../../dtos/chat/MessageResponse');

class SendMessageUseCase {
    constructor({ messageRepository, appointmentRepository, socketService }) {
        this.messageRepository = messageRepository;
        this.appointmentRepository = appointmentRepository;
        this.socketService = socketService;
    }

    async execute(request) {
        const { senderId, appointmentId, content, type, fileUrl } = request;

        const appointment = await this.appointmentRepository.findById(appointmentId);
        if (!appointment) throw new Error("Appointment not found");

        const newMessage = new Message({
            senderId,
            appointmentId,
            content,
            type,
            fileUrl,
            isRead: false,
            createdAt: new Date()
        });

        const savedMessage = await this.messageRepository.save(newMessage);
        const responseDto = MessageResponse.fromEntity(savedMessage);
        this.socketService.sendMessageToRoom(appointmentId, responseDto);

        return responseDto;
    }
}

module.exports = SendMessageUseCase;