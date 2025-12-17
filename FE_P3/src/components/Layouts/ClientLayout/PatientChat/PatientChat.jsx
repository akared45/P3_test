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

  const { messages, sendMessage, loading } = useChat(activeId);

  // 1. Theo dõi trạng thái Socket
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

  // 2. [SỬA QUAN TRỌNG] Tải danh sách NGAY LẬP TỨC khi vào trang
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setMyId(user.id || user._id);

    // Gọi API luôn, KHÔNG chờ isOpen nữa
    const fetchAppointments = async () => {
      try {
        const res = await appointmentApi.getMyAppointments();
        console.log("Danh sách chat:", res.data.data); // Log để check
        const validApps = res.data.data.filter(a =>
          ['confirmed', 'in_progress', 'pending'].includes(a.status)
        );
        setAppointments(validApps);
      } catch (error) {
        console.error("Lỗi tải danh sách chat:", error);
      }
    };

    fetchAppointments();
  }, []); // [] rỗng nghĩa là chạy 1 lần duy nhất khi F5 hoặc load trang

  // 3. Tự động cuộn xuống khi có tin nhắn hoặc mở chat
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
      {/* Nút FAB hiển thị Badge */}
      {!isOpen && (
        <Fab
          color="primary"
          onClick={() => setIsOpen(true)}
          sx={{ position: 'fixed', bottom: 30, right: 30, zIndex: 1300 }}
        >
          {/* Badge hiển thị số lượng cuộc hẹn lấy được từ API ngay lúc đầu */}
          <Badge badgeContent={appointments.length} color="error">
            <ChatIcon />
          </Badge>
        </Fab>
      )}

      {/* Cửa sổ Chat */}
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
          />
        </Grid>
      </Dialog>
    </>
  );
}