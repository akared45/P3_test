import { useState, useEffect, useCallback, useContext } from "react";
import { socket, connectSocket } from "../services/socket";
import { chatApi } from "../services/api";
import { AuthContext } from "../providers/AuthProvider";

export const useChat = (appointmentId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    if (!appointmentId) return;

    if (!socket.connected) {
      const storedToken = localStorage.getItem("accessToken") || token;
      if (storedToken) connectSocket(storedToken);
    }

    const joinRoom = () => {
      console.log("🔄 Joining chat room:", appointmentId);
      socket.emit("join_chat_room", appointmentId);
    };

    joinRoom();
    socket.on("connect", joinRoom);
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await chatApi.getHistory(appointmentId);
        setMessages(res.data.data || []);
      } catch (err) {
        console.error("Lỗi tải lịch sử chat:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();

    return () => {
      socket.off("connect", joinRoom);
    };
  }, [appointmentId, token]);

  useEffect(() => {
    if (!appointmentId) return;

    const handleNewMessage = (newMessage) => {
      if (String(newMessage.appointmentId) === String(appointmentId)) {
        setMessages((prev) => {
          const msgId = newMessage.id || newMessage._id;
          if (prev.some((m) => (m.id || m._id) === msgId)) return prev;

          return [...prev, newMessage];
        });
      }
    };

    socket.on("receive_message", handleNewMessage);
    return () => socket.off("receive_message", handleNewMessage);
  }, [appointmentId]);

  const sendMessage = useCallback(
    (content) => {
      if (!appointmentId || !content.trim()) return;
      if (!user || !user.id) {
        console.error("Chưa đăng nhập, không thể gửi tin");
        return;
      }

      const payload = {
        appointmentId,
        content,
        type: "text",
        senderId: user.id,
      };

      socket.emit("send_message", payload);

    // setMessages(prev => [...prev, {
    //     ...payload,
    //     id: Date.now(), 
    //     createdAt: new Date(),
    //     isRead: false
    // }]);
    
    },
    [appointmentId, user]
  );

  return { messages, sendMessage, loading };
};
