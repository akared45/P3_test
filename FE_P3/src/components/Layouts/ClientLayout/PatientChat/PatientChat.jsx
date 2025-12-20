import { useState, useEffect, useRef } from "react";
import { Dialog, Grid, Fab, Badge } from "@mui/material";
import { Chat as ChatIcon } from "@mui/icons-material";
import { socket } from "../../../../services/socket";
import { appointmentApi } from "../../../../services/api";
import { useChat } from "../../../../hooks/useChat";
import DoctorListSidebar from "./DoctorListSidebar";
import PatientChatWindow from "./PatientChatWindow";

export default function PatientChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [text, setText] = useState("");
  const [myId, setMyId] = useState(null);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const messagesEndRef = useRef(null);

  // 1. LẤY onlineUsers RA TỪ HOOK useChat
  const { messages, sendMessage, loading, onlineUsers } = useChat(activeId);

  useEffect(() => {
    const updateStatus = () => setIsConnected(socket.connected);
    socket.on("connect", updateStatus);
    socket.on("disconnect", updateStatus);
    updateStatus();
    return () => {
      socket.off("connect", updateStatus);
      socket.off("disconnect", updateStatus);
    };
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setMyId(user.id || user._id);

    const fetchAppointments = async () => {
      try {
        const res = await appointmentApi.getMyAppointments();
        // Lọc các lịch hẹn hợp lệ để hiển thị trong danh sách chat
        const validApps = res.data.data.filter(a =>
          ['confirmed', 'in_progress', 'active', 'pending'].includes(a.status?.toLowerCase())
        );
        setAppointments(validApps);
      } catch (error) {
        console.error("Lỗi tải danh sách chat:", error);
      }
    };

    if (isOpen) fetchAppointments();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(text);
    setText("");
  };

  const activeApp = appointments.find(a => a.id === activeId);

  return (
    <>
      {!isOpen && (
        <Fab
          color="primary"
          onClick={() => setIsOpen(true)}
          sx={{ position: 'fixed', bottom: 30, right: 30, zIndex: 1300 }}
        >
          <Badge badgeContent={appointments.filter(a => a.status === 'confirmed').length} color="error">
            <ChatIcon />
          </Badge>
        </Fab>
      )}

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        maxWidth={false}
        PaperProps={{
          sx: {
            width: '90vw',
            height: '85vh',
            maxWidth: '1200px',
            borderRadius: 3,
            overflow: 'hidden'
          }
        }}
      >
        <Grid container sx={{ height: '100%', flexWrap: 'nowrap' }}>
          <DoctorListSidebar
            appointments={appointments}
            activeId={activeId}
            setActiveId={setActiveId}
            isConnected={isConnected}
            onlineUsers={onlineUsers} 
          />

          <PatientChatWindow
            activeApp={activeApp}
            messages={messages}
            loading={loading}
            myId={myId}
            text={text}
            setText={setText}
            handleSend={handleSend}
            isConnected={isConnected}
            messagesEndRef={messagesEndRef}
            onClose={() => setIsOpen(false)}
            onlineUsers={onlineUsers} 
          />
        </Grid>
      </Dialog>
    </>
  );
}