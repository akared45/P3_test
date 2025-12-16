const { Server } = require("socket.io");
const ISocketService = require('../../application/interfaces/ISocketService');

class SocketService extends ISocketService {
    constructor() {
        super();
        this.io = null;
    }

    init(httpServer, { sendMessageUseCase, aiService } = {}) {
        this.io = new Server(httpServer, {
            cors: {
                origin: process.env.CLIENT_URL || "*",
                methods: ["GET", "POST"],
                credentials: true
            }
        });

        this.io.on('connection', (socket) => {
            console.log('🔌 Client connected:', socket.id);

            socket.on('join_user_room', (userId) => {
                if (userId) socket.join(userId.toString());
            });

            socket.on('join_chat_room', (roomId) => {
                socket.join(roomId);
            });

            socket.on('send_message', async (payload) => {
                try {
                    if (!sendMessageUseCase) {
                        console.error("CRITICAL: sendMessageUseCase missing in SocketService");
                        return;
                    }

                    const savedMessageDto = await sendMessageUseCase.execute({
                        appointmentId: payload.appointmentId,
                        senderId: payload.senderId,
                        content: payload.content,
                        type: payload.type || 'TEXT',
                        fileUrl: payload.fileUrl
                    });

                    this.sendMessageToRoom(payload.appointmentId, savedMessageDto);

                    if (aiService && payload.senderRole === 'patient' && payload.type === 'text') {
                        aiService.generateSmartReplies(payload.content)
                            .then(suggestions => {
                                if (suggestions && suggestions.length > 0) {
                                    this.io.to(payload.appointmentId).emit('receive_suggestions', {
                                        appointmentId: payload.appointmentId,
                                        suggestions: suggestions
                                    });
                                }
                            })
                            .catch(err => console.error("AI Reply Failed:", err));
                        }

                } catch (error) {
                    console.error("Socket Message Error:", error);
                    socket.emit('error_message', { message: "Gửi tin nhắn thất bại" });
                }
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected:', socket.id);
            });
        });
    }

    sendToUser(userId, eventName, data) {
        if (!this.io) {
            console.warn("[Socket] IO chưa khởi tạo!");
            return;
        }
        this.io.to(userId.toString()).emit(eventName, data);
        console.log(`Đã gửi sự kiện '${eventName}' tới user ${userId}`);
    }

    sendMessageToRoom(roomId, messageDto) {
        if (!this.io) return;
        this.io.to(roomId).emit('receive_message', messageDto);
    }
}

module.exports = SocketService;