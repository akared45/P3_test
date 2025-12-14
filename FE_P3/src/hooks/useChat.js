import { useState, useEffect, useCallback, useContext } from "react";
// Import các helper từ socket service
import { socket, connectSocket } from "../services/socket"; 
import { chatApi } from "../services/api";
// Import AuthContext để lấy thông tin User (senderId)
import { AuthContext } from "../providers/AuthProvider"; 

export const useChat = (appointmentId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // [QUAN TRỌNG] Lấy user từ Context để biết ai đang chat
  const { user, token } = useContext(AuthContext); 

  // 1. Join Room & Load History
  useEffect(() => {
    if (!appointmentId) return;

    // A. Đảm bảo Socket đã kết nối (Fallback nếu F5 trang)
    if (!socket.connected) {
       // Nếu AuthProvider chưa kịp connect thì ta gọi lại cho chắc
       // (Thường thì AuthProvider đã làm rồi)
       const storedToken = localStorage.getItem("accessToken") || token; 
       if(storedToken) connectSocket(storedToken);
    }

    // B. Join Room
    const joinRoom = () => {
        // [SỬA 1] Tên sự kiện phải khớp Backend: 'join_chat_room'
        console.log("🔄 Joining chat room:", appointmentId);
        socket.emit("join_chat_room", appointmentId); 
    };

    // Gọi ngay lần đầu mount
    joinRoom();

    // Lắng nghe sự kiện connect lại (nếu rớt mạng)
    socket.on("connect", joinRoom);

    // C. Tải lịch sử chat từ API (HTTP)
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await chatApi.getHistory(appointmentId);
        // Đảo ngược hoặc giữ nguyên tùy vào UI của bạn (Backend sort cũ -> mới)
        setMessages(res.data || []); 
      } catch (err) {
        console.error("Lỗi tải lịch sử chat:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();

    // Cleanup
    return () => {
      socket.off("connect", joinRoom);
      // Optional: Rời phòng khi unmount component
      // socket.emit("leave_chat_room", appointmentId); 
    };
  }, [appointmentId, token]);

  // 2. Lắng nghe tin nhắn mới (Real-time)
  useEffect(() => {
    if (!appointmentId) return;

    const handleNewMessage = (newMessage) => {
      // Chỉ nhận tin của phòng này
      if (String(newMessage.appointmentId) === String(appointmentId)) {
        setMessages((prev) => {
          // Chống trùng lặp tin nhắn
          const msgId = newMessage.id || newMessage._id;
          if (prev.some((m) => (m.id || m._id) === msgId)) return prev;
          
          return [...prev, newMessage];
        });
      }
    };

    socket.on("receive_message", handleNewMessage);
    return () => socket.off("receive_message", handleNewMessage);
  }, [appointmentId]);

  // 3. Gửi tin nhắn
  const sendMessage = useCallback((content) => {
    if (!appointmentId || !content.trim()) return;

    // Kiểm tra user có tồn tại không
    if (!user || !user.id) {
        console.error("Chưa đăng nhập, không thể gửi tin");
        return;
    }

    // [SỬA 2] Gửi kèm senderId
    const payload = {
      appointmentId,
      content,
      type: "text", // Hoặc 'image', 'file' tùy logic mở rộng
      senderId: user.id // <--- BẮT BUỘC CÓ để Backend lưu vào DB
    };

    // Emit trực tiếp lên server
    socket.emit("send_message", payload);

    // [Mẹo UX] Optimistic Update: Hiện tin nhắn lên luôn cho mượt (không cần chờ Server phản hồi)
    // Bạn có thể mở comment dòng dưới nếu muốn UI phản hồi tức thì:
    /*
    setMessages(prev => [...prev, {
        ...payload,
        id: Date.now(), // ID tạm
        createdAt: new Date(),
        isRead: false
    }]);
    */

  }, [appointmentId, user]);

  return { messages, sendMessage, loading };
};