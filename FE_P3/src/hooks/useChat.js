import { useState, useEffect, useCallback } from "react";
import { socket } from "../services/socket";
import { chatApi } from "../services/api";

export const useChat = (appointmentId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!appointmentId) return;
    if (!socket.connected) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        socket.auth = { token };
        socket.connect();
      }
    }

    const initChat = async () => {
      setLoading(true);
      try {
        const res = await chatApi.getHistory(appointmentId);
        setMessages(res.data || []);
      } catch (err) {
        console.error("Lỗi tải lịch sử chat:", err);
      } finally {
        setLoading(false);
      }
    };
    socket.emit("join_appointment", appointmentId);
    initChat();
    const onConnect = () => {
      socket.emit("join_appointment", appointmentId);
    };
    socket.on("connect", onConnect);
    return () => {
      socket.off("connect", onConnect);
      socket.emit("leave_appointment", appointmentId);
    };
  }, [appointmentId]);

  useEffect(() => {
    if (!appointmentId) return;

    const handleNewMessage = (newMessage) => {
      if (newMessage.appointmentId === appointmentId) {
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

  const sendMessage = useCallback((content) => {
    if (!appointmentId || !content.trim()) return;

    if (!socket.connected) {
      const token = localStorage.getItem("accessToken");
      if (token) { socket.auth = { token }; socket.connect(); }
    }

    socket.emit("send_message", {
      appointmentId,
      content,
      type: "text",
    });
  }, [appointmentId]);

  return { messages, sendMessage, loading };
};