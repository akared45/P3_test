import { io } from "socket.io-client";
const URL = "http://localhost:3000";

export const socket = io(URL, {
  autoConnect: false,
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

socket.on("connect", () => {
  console.log("🟢 Socket Connected! ID:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("🔴 Socket Disconnected! Reason:", reason);
});

socket.on("connect_error", (err) => {
  console.error("⚠️ Socket Connection Error:", err.message);
});

export const connectSocket = (token) => {
  if (token) {
    if (socket.connected) return;
    socket.auth = { token };
    socket.connect();
  } else {
    console.warn("Socket: Không tìm thấy Token để kết nối.");
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};