class SocketService {
    constructor() {
        this.io = null;
    }

    setIO(ioInstance) {
        this.io = ioInstance;
    }

    sendMessageToRoom(roomId, messageDto) {
        if (!this.io) {
            console.warn("Socket.io chưa được khởi tạo!");
            return;
        }
        this.io.to(roomId).emit('receive_message', messageDto);
        console.log(`Sent socket message to room ${roomId}`);
    }

    sendNotification(userId, type, payload) {
        if (!this.io) return;
        this.io.to(userId).emit('notification', { type, data: payload });
    }
}

module.exports = SocketService;