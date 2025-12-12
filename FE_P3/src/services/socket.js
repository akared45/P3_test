import { io } from "socket.io-client";

const URL = "http://localhost:3000";

export const socket = io(URL, {
  autoConnect: false,
  withCredentials: true,
  reconnection: true,
});

socket.on("connect", () => {
  console.log("Socket Connected! ID:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("Socket Connection Error:", err.message);
});

export const connectSocket = (token) => {
  if (token) {
    socket.io.opts.reconnection = true;
    socket.auth = { token };
    if (!socket.connected) {
      socket.connect();
    }
  } else {
    console.warn("Không tìm thấy Token ");
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.auth = null;
    socket.io.opts.reconnection = false;
    socket.disconnect();
    socket.removeAllListeners();
  }
};