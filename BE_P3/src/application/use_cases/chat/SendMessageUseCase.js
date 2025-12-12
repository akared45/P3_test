const Message = require('../../../domain/entities/Message');
const MessageResponse = require('../../dtos/chat/MessageResponse');
const { NotFoundException, AuthorizationException } = require('../../../domain/exceptions'); // Giả sử bạn có file exception

class SendMessageUseCase {
    constructor({ messageRepository, appointmentRepository, socketService }) {
        this.messageRepository = messageRepository;
        this.appointmentRepository = appointmentRepository; 
        this.socketService = socketService;
    }

    async execute(request) {
        const { senderId, appointmentId, content, type, fileUrl } = request;
        const appointment = await this.appointmentRepository.findById(appointmentId);

        if (!appointment) {
            throw new Error(`Appointment (Room) ${appointmentId} not found`);
        }
        if (!appointment.hasParticipant(senderId)) {
            throw new Error("User is not a participant in this appointment");
        }
        if (appointment.status === 'cancelled' || appointment.status === 'pending') {
            throw new Error("Cannot chat in this appointment status");
        }

        const messageEntity = new Message({
            senderId,
            appointmentId,
            content,
            type,
            fileUrl
        });

        const savedMessage = await this.messageRepository.save(messageEntity);
        const response = new MessageResponse(savedMessage);

        if (this.socketService) {
            this.socketService.sendMessageToRoom(appointmentId, response);
        }

        return response;
    }
}

module.exports = SendMessageUseCase;