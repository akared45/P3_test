import { useState, useEffect, useCallback, useContext } from "react";
import { socket, connectSocket } from "../services/socket";
import { chatApi } from "../services/api";
import { AuthContext } from "../providers/AuthProvider";

export const useChat = (appointmentId) => {
  const [messages, setMessages] = useState([]);
  const [suggestions, setSuggestions] = useState([]); // [MỚI] State chứa gợi ý AI
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

    // [MỚI] Lắng nghe gợi ý từ AI
    const handleSuggestions = (data) => {
      if (String(data.appointmentId) === String(appointmentId)) {
        console.log("🤖 AI Suggestions:", data.suggestions);
        setSuggestions(data.suggestions);
      }
    };
    socket.on("receive_suggestions", handleSuggestions);

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
      socket.off("receive_suggestions", handleSuggestions); // [MỚI] Cleanup
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

        // [MỚI] Nếu tin nhắn mới là của chính mình (Bác sĩ) -> Xóa gợi ý đi
        if (user && newMessage.senderId === user.id) {
            setSuggestions([]); 
        }
      }
    };

    socket.on("receive_message", handleNewMessage);
    return () => socket.off("receive_message", handleNewMessage);
  }, [appointmentId, user]);

  const sendMessage = useCallback(
    (content) => {
      if (!appointmentId || !content.trim()) return;
      if (!user || !user.id) {
        console.error("Chưa đăng nhập, không thể gửi tin");
        return;
      }
      console.log(user);
      const payload = {
        appointmentId,
        content,
        type: "text",
        senderId: user.id,
        senderRole: user.userType || (user.id.includes('DOC') ? 'doctor' : 'patient')
      };

      console.log("📤 Sending message payload:", payload); 

      socket.emit("send_message", payload);
      setSuggestions([]);
    },
    [appointmentId, user]
  );

  return { messages, sendMessage, loading, suggestions, setSuggestions };
};