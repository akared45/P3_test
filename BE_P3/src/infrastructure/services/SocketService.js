const { Server } = require("socket.io");
const ISocketService = require('../../application/interfaces/ISocketService');

class SocketService extends ISocketService {
    constructor() {
        super();
        this.io = null;
        this.roomParticipants = new Map();
        this.socketInfo = new Map();
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
            console.log('Client connected:', socket.id);
            socket.on('join_user_room', (userId) => {
                if (userId) {
                    socket.join(userId.toString());
                    socket.userId = userId.toString();
                }
            });

            socket.on('join_chat_room', ({ roomId, userId }) => {
                if (!roomId || !userId) return;
                socket.join(roomId);
                if (!this.roomParticipants.has(roomId)) {
                    this.roomParticipants.set(roomId, new Set());
                }
                this.roomParticipants.get(roomId).add(userId.toString());
                this.socketInfo.set(socket.id, { roomId, userId: userId.toString() });
                this.broadcastOnlineList(roomId);

                console.log(`User ${userId} joined chat: ${roomId}`);
            });

            socket.on('send_message', async (payload) => {
                try {
                    if (!sendMessageUseCase) {
                        console.error("CRITICAL: sendMessageUseCase missing");
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
                                if (suggestions?.length > 0) {
                                    this.io.to(payload.appointmentId).emit('receive_suggestions', {
                                        appointmentId: payload.appointmentId,
                                        suggestions
                                    });
                                }
                            })
                            .catch(err => console.error("AI Reply Failed:", err));
                    }
                } catch (error) {
                    console.error("Socket Message Error:", error);
                    socket.emit('error_message', { message: "Failed to send message" });
                }
            });

            socket.on('disconnect', () => {
                const info = this.socketInfo.get(socket.id);
                if (info) {
                    const { roomId, userId } = info;
                    if (this.roomParticipants.has(roomId)) {
                        this.roomParticipants.get(roomId).delete(userId);
                        this.broadcastOnlineList(roomId);
                        if (this.roomParticipants.get(roomId).size === 0) {
                            this.roomParticipants.delete(roomId);
                        }
                    }
                    this.socketInfo.delete(socket.id);
                }
                console.log('🔌 Client disconnected:', socket.id);
            });
        });
    }

    broadcastOnlineList(roomId) {
        if (this.roomParticipants.has(roomId)) {
            const participants = Array.from(this.roomParticipants.get(roomId));
            this.io.to(roomId).emit('update_online_list', participants);
        }
    }

    sendToUser(userId, eventName, data) {
        if (!this.io) return;
        this.io.to(userId.toString()).emit(eventName, data);
    }

    sendMessageToRoom(roomId, messageDto) {
        if (!this.io) return;
        this.io.to(roomId).emit('receive_message', messageDto);
    }
}

module.exports = SocketService;