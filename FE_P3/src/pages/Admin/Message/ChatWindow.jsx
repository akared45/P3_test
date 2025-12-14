// src/components/Chat/DoctorChat/ChatWindow.jsx

import { useEffect } from "react";
import {
  Box, Avatar, Typography, IconButton, Paper, CircularProgress,
  TextField, InputAdornment, Button, Chip, Badge
} from "@mui/material";
import {
  Close as CloseIcon,
  Person as PersonIcon,
  MedicalServices as MedicalIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as PendingIcon,
  Block as BlockIcon,
  FiberManualRecord as DotIcon
} from "@mui/icons-material";

export default function ChatWindow({
  activeApp,
  messages,
  loading,
  myId,
  text,
  setText,
  handleSend,
  isConnected,
  messagesEndRef,
  onClose,
  onAcceptAppointment, // Thêm prop mới cho nút chấp nhận
  onCompleteAppointment // Thêm prop cho nút hoàn thành
}) {
  const getAvatarUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return "http://localhost:3000" + url;
  };

  const getStatusInfo = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending':
        return {
          icon: <PendingIcon fontSize="small" />,
          color: 'warning',
          text: 'Chờ xác nhận',
          actionButton: true
        };
      case 'active':
      case 'confirmed':
        return {
          icon: <DotIcon fontSize="small" color="success" />,
          color: 'success',
          text: 'Đang tư vấn',
          actionButton: false
        };
      case 'completed':
      case 'finished':
        return {
          icon: <CheckCircleIcon fontSize="small" color="primary" />,
          color: 'primary',
          text: 'Đã hoàn thành',
          actionButton: false
        };
      case 'cancelled':
        return {
          icon: <BlockIcon fontSize="small" color="error" />,
          color: 'error',
          text: 'Đã hủy',
          actionButton: false
        };
      default:
        return {
          icon: <PendingIcon fontSize="small" />,
          color: 'default',
          text: status,
          actionButton: false
        };
    }
  };

  const statusInfo = activeApp ? getStatusInfo(activeApp.status) : null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#f5f7fb', overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        borderBottom: 1, 
        borderColor: 'divider', 
        bgcolor: 'white', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        height: 'auto',
        flexShrink: 0,
        flexDirection: 'column',
        gap: 2
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          {activeApp ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={statusInfo?.icon}
              >
                <Avatar 
                  src={getAvatarUrl(activeApp.patient.avatar)}
                  sx={{ 
                    bgcolor: 'secondary.main',
                    width: 50,
                    height: 50
                  }}
                >
                  {activeApp.patient.name.charAt(0)}
                </Avatar>
              </Badge>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">{activeApp.patientName}</Typography>
                  <Chip
                    label={statusInfo?.text}
                    color={statusInfo?.color}
                    size="small"
                    variant="outlined"
                    sx={{ height: 22, fontSize: '0.7rem' }}
                  />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Mã hồ sơ: {activeApp.patientId} • Ngày hẹn: {new Date(activeApp.appointmentDate).toLocaleDateString('vi-VN')}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Typography variant="subtitle2" color="text.secondary">Chọn bệnh nhân</Typography>
          )}
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Box>

        {/* Action Button for Active Status */}
        {activeApp && (activeApp.status?.toLowerCase() === 'active' || activeApp.status?.toLowerCase() === 'confirmed') && (
          <Box sx={{ display: 'flex', gap: 2, width: '100%', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<CheckCircleIcon />}
              onClick={() => onCompleteAppointment && onCompleteAppointment(activeApp.id)}
              sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.85rem' }}
            >
              Hoàn thành tư vấn
            </Button>
          </Box>
        )}
      </Box>

      <Box sx={{ 
        flexGrow: 1, 
        overflowY: 'auto', 
        p: 3, 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 2,
        opacity: activeApp?.status?.toLowerCase() === 'pending' ? 0.5 : 1,
        pointerEvents: activeApp?.status?.toLowerCase() === 'pending' ? 'none' : 'auto'
      }}>
        {!activeApp ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'text.disabled' }}>
            <MedicalIcon sx={{ fontSize: 80, mb: 2, opacity: 0.3 }} />
            <Typography variant="h6">Trung tâm tư vấn</Typography>
            <Typography>Vui lòng chọn hồ sơ bệnh án bên trái</Typography>
          </Box>
        ) : (
          <>
            {activeApp.status?.toLowerCase() === 'pending' && (
              <Box sx={{ 
                textAlign: 'center', 
                py: 3, 
                bgcolor: 'warning.light', 
                borderRadius: 2,
                mb: 2
              }}>
                <PendingIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                <Typography variant="body1" fontWeight="medium" color="warning.dark">
                  Cuộc tư vấn chưa được chấp nhận
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Vui lòng chấp nhận tư vấn để bắt đầu trò chuyện với bệnh nhân
                </Typography>
              </Box>
            )}

            {activeApp.status?.toLowerCase() === 'completed' && (
              <Box sx={{ 
                textAlign: 'center', 
                py: 2, 
                bgcolor: 'primary.light', 
                borderRadius: 2,
                mb: 2
              }}>
                <CheckCircleIcon sx={{ fontSize: 30, color: 'primary.main', mb: 1 }} />
                <Typography variant="body2" color="primary.dark">
                  Cuộc tư vấn đã hoàn thành
                </Typography>
              </Box>
            )}

            {loading && <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}><CircularProgress size={24} /></Box>}
            
            {messages.map((msg, i) => {
              const isMe = msg.senderId === myId;
              return (
                <Box key={i} sx={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', mb: 1 }}>
                  {!isMe && (
                    <Avatar 
                      src={getAvatarUrl(activeApp.patient.avatar)} 
                      sx={{ 
                        width: 32, 
                        height: 32, 
                        mr: 1.5, 
                        bgcolor: 'grey.400',
                        border: '2px solid white'
                      }}
                    >
                      <PersonIcon sx={{ fontSize: 20 }} />
                    </Avatar>
                  )}
                  
                  <Box sx={{ maxWidth: '85%' }}> 
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        bgcolor: isMe ? 'primary.main' : 'white',
                        color: isMe ? 'white' : 'text.primary',
                        borderTopRightRadius: isMe ? 0 : 3,
                        borderTopLeftRadius: !isMe ? 0 : 3,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                        wordBreak: 'break-word'
                      }}
                    >
                      <Typography variant="body1" sx={{fontSize: '0.95rem', lineHeight: 1.5}}>{msg.content}</Typography>
                    </Paper>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: isMe ? 'right' : 'left', mt: 0.5, fontSize: 11, px: 1 }}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </Box>

                  {isMe && (
                    <Avatar 
                      src={getAvatarUrl(activeApp.doctor?.avatar)} 
                      sx={{ 
                        width: 32, 
                        height: 32, 
                        ml: 1.5, 
                        bgcolor: 'primary.main',
                        border: '2px solid white'
                      }}
                    >
                      {activeApp.doctor?.name?.charAt(0) || 'D'}
                    </Avatar>
                  )}
                </Box>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </Box>

      {activeApp && (
        <Box sx={{ 
          p: 2, 
          bgcolor: 'white', 
          borderTop: 1, 
          borderColor: 'divider', 
          flexShrink: 0,
          opacity: !isConnected || activeApp.status?.toLowerCase() === 'completed' ? 0.5 : 1,
          pointerEvents: !isConnected || activeApp.status?.toLowerCase() === 'completed' ? 'none' : 'auto'
        }}>
          <TextField
            fullWidth
            placeholder={
              !isConnected ? "Đang kết nối lại..." :
              activeApp.status?.toLowerCase() === 'completed' ? "Cuộc tư vấn đã kết thúc" :
              "Nhập lời khuyên, chỉ định..."
            }
            variant="outlined"
            size="medium"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={!isConnected || activeApp.status?.toLowerCase() === 'completed'}
            InputProps={{
              sx: { borderRadius: 3, bgcolor: 'grey.50', pr: 1 },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton 
                    onClick={handleSend} 
                    color="primary" 
                    disabled={!text.trim() || !isConnected || activeApp.status?.toLowerCase() === 'completed'}
                    sx={{ 
                      bgcolor: text.trim() && isConnected && activeApp.status?.toLowerCase() !== 'completed' ? 'primary.main' : 'transparent', 
                      color: text.trim() && isConnected && activeApp.status?.toLowerCase() !== 'completed' ? 'white' : 'inherit', 
                      '&:hover': { bgcolor: 'primary.dark' } 
                    }}
                  >
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Box>
      )}
    </Box>
  );
}