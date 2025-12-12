import { useState, useEffect, useRef } from "react";
import { Dialog, Grid, Fab, Badge } from "@mui/material";
import { Chat as ChatIcon } from "@mui/icons-material";
import { socket } from "../../../../services/socket";
import { appointmentApi } from "../../../../services/api";
import { useChat } from "../../../../hooks/useChat";
import PatientListSidebar from "./PatientListSidebar";
import ChatWindow from "./ChatWindow";
import PatientInfoPanel from "./PatientInfoPanel";

export default function DoctorChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [text, setText] = useState("");
  const [myId, setMyId] = useState(null);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const messagesEndRef = useRef(null);

  const { messages, sendMessage, loading } = useChat(activeId);

  useEffect(() => {
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    setIsConnected(socket.connected);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setMyId(user.id || user._id);
    if (isOpen) {
      appointmentApi.getMyAppointments().then((res) => {
        console.log(res)
        const validApps = res.data.data.filter(a =>
          ['confirmed', 'in_progress', 'completed', 'pending'].includes(a.status)
        );
        setAppointments(validApps);
      });
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
          aria-label="chat"
          onClick={() => setIsOpen(true)}
          sx={{ position: 'fixed', bottom: 30, right: 30, zIndex: 1300 }}
        >
          <Badge badgeContent={appointments.length} color="error">
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
            width: '95vw',    
            height: '92vh',   
            maxWidth: '100%',
            borderRadius: 2,
            overflow: 'hidden' 
          }
        }}
      >
        <Grid container sx={{ height: '100%', flexWrap: 'nowrap' }}> 
          <Grid item sx={{ width: '20%', minWidth: '250px', borderRight: 1, borderColor: 'divider' }}>
            <PatientListSidebar
              appointments={appointments}
              activeId={activeId}
              setActiveId={setActiveId}
              isConnected={isConnected}
            />
          </Grid>

          <Grid item sx={{ flex: 1, minWidth: '400px', display: 'flex', flexDirection: 'column' }}>
            <ChatWindow
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

          <Grid item sx={{ width: '22%', minWidth: '280px', borderLeft: 1, borderColor: 'divider' }}>
            <PatientInfoPanel activeApp={activeApp} />
          </Grid>

        </Grid>
      </Dialog>
    </>
  );
}