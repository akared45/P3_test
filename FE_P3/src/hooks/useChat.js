import { useState, useEffect, useCallback, useContext } from "react";
import { socket, connectSocket } from "../services/socket";
import { chatApi } from "../services/api";
import { AuthContext } from "../providers/AuthProvider";

export const useChat = (appointmentId) => {
  const [messages, setMessages] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    if (!appointmentId || !user?.id) return;

    if (!socket.connected) {
      const storedToken = localStorage.getItem("accessToken") || token;
      if (storedToken) connectSocket(storedToken);
    }

    const joinRoom = () => {
      socket.emit("join_chat_room", {
        roomId: appointmentId,
        userId: user.id
      });
    };

    joinRoom();
    socket.on("connect", joinRoom);
    const handleOnlineList = (participants) => {
      setOnlineUsers(participants);
    };
    socket.on("update_online_list", handleOnlineList);

    const handleSuggestions = (data) => {
      if (String(data.appointmentId) === String(appointmentId)) {
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
      socket.off("receive_suggestions", handleSuggestions);
      socket.off("update_online_list", handleOnlineList);
    };
  }, [appointmentId, token, user?.id]);

  useEffect(() => {
    if (!appointmentId) return;

    const handleNewMessage = (newMessage) => {
      if (String(newMessage.appointmentId) === String(appointmentId)) {
        setMessages((prev) => {
          const msgId = newMessage.id || newMessage._id;
          if (prev.some((m) => (m.id || m._id) === msgId)) return prev;
          return [...prev, newMessage];
        });

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
      if (!appointmentId || !content.trim() || !user?.id) return;

      const payload = {
        appointmentId,
        content,
        type: "text",
        senderId: user.id,
        senderRole: user.userType || (user.id.includes('DOC') ? 'doctor' : 'patient')
      };

      socket.emit("send_message", payload);
      setSuggestions([]);
    },
    [appointmentId, user]
  );

  return { messages, sendMessage, loading, suggestions, setSuggestions, onlineUsers };
};