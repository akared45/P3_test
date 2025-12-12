const { Server } = require("socket.io");
const socketAuthMiddleWare = require("./socket_middleware");

let io;
const initializeSocket = (httpServer, { sendMessageUseCase }) => {

    io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.use(socketAuthMiddleWare);

    io.on("connection", (socket) => {
        const user = socket.data.user;
        console.log(`User ${user.id} connected via Socket`);

        socket.on("join_appointment", (appointmentId) => {
            socket.join(appointmentId);
            console.log(`User ${user.id} joined room ${appointmentId}`);
        });
        socket.on("leave_appointment", (appointmentId) => {
            socket.leave(appointmentId);
            console.log(`User ${user.id} LEFT room ${appointmentId}`);
        });
        socket.on("send_message", async (data) => {
            try {
                const savedMessage = await sendMessageUseCase.execute({
                    senderId: user.id,
                    appointmentId: data.appointmentId,
                    content: data.content,
                    type: data.type || 'text',
                    fileUrl: data.fileUrl
                });

                io.to(data.appointmentId).emit("receive_message", savedMessage);

                console.log(`Sent socket message to room ${data.appointmentId}`);

            } catch (error) {
                console.error("Chat Error:", error.message);
                socket.emit("error_message", { message: error.message });
            }
        });

        socket.on("disconnect", () => {
            console.log(`User ${user.id} disconnected`);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) throw new Error("Socket.io not initialized!");
    return io;
};

module.exports = { initializeSocket, getIO };