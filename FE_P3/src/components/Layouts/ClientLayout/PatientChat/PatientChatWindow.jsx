import {
    Box, Avatar, Typography, IconButton, Paper, CircularProgress,
    TextField, InputAdornment, Grid
} from "@mui/material";
import {
    Close as CloseIcon,
    LocalHospital as HospitalIcon,
    Send as SendIcon,
    AccountCircle as UserIcon
} from "@mui/icons-material";

export default function PatientChatWindow({
    activeApp,
    messages,
    loading,
    myId,
    text,
    setText,
    handleSend,
    isConnected,
    messagesEndRef,
    onClose
}) {
    console.log(activeApp);
    const getAvatarUrl = (url) => {
        if (!url) return "";
        if (url.startsWith("http")) return url;
        return "http://localhost:3000" + url;
    };
    return (
        <Grid item sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: '#f0f2f5', height: '100%', overflow: 'hidden' }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px', flexShrink: 0 }}>
                {activeApp ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                            {activeApp.doctor.name.charAt(0)}
                        </Avatar>
                        <Box>
                            <Typography variant="subtitle1" fontWeight="bold">{activeApp.doctor.name}</Typography>
                            <Typography variant="caption" color="text.secondary">Chuyên khoa: Nội tổng hợp</Typography>
                        </Box>
                    </Box>
                ) : (
                    <Typography variant="subtitle1" fontWeight="medium" color="text.secondary">
                        Chào mừng đến với phòng tư vấn
                    </Typography>
                )}
                <IconButton onClick={onClose} color="inherit">
                    <CloseIcon />
                </IconButton>
            </Box>

            <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {!activeApp ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.6 }}>
                        <HospitalIcon sx={{ fontSize: 100, color: 'grey.400', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">Chọn bác sĩ để bắt đầu chat</Typography>
                    </Box>
                ) : (
                    <>
                        {loading && <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}><CircularProgress size={30} /></Box>}

                        {messages.map((msg, i) => {
                            const isMe = msg.senderId === myId;
                            return (
                                <Box key={i} sx={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', mb: 1 }}>
                                    {!isMe &&
                                        <Avatar src={getAvatarUrl(activeApp.doctor.avatar)}
                                            sx={{ width: 32, height: 32, mr: 1.5, bgcolor: 'primary.main' }}>D</Avatar>}

                                    <Box sx={{ maxWidth: '70%' }}>
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 2,
                                                borderRadius: 3,
                                                bgcolor: isMe ? 'primary.main' : 'white',
                                                color: isMe ? 'white' : 'text.primary',
                                                borderTopRightRadius: isMe ? 0 : 3,
                                                borderTopLeftRadius: !isMe ? 0 : 3,
                                                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                                                position: 'relative'
                                            }}
                                        >
                                            <Typography variant="body1" sx={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
                                                {msg.content}
                                            </Typography>
                                        </Paper>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: isMe ? 'right' : 'left', mt: 0.5, px: 1 }}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </Typography>
                                    </Box>
                                    {isMe && <Avatar src={getAvatarUrl(activeApp.patient.avatar)} sx={{ width: 32, height: 32, ml: 1.5, bgcolor: 'grey.300' }}><UserIcon sx={{ color: 'white' }} /></Avatar>}
                                </Box>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </Box>

            {activeApp && (
                <Box sx={{ p: 2, bgcolor: 'white', borderTop: 1, borderColor: 'divider', flexShrink: 0 }}>
                    <TextField
                        fullWidth
                        placeholder={isConnected ? "Nhập tin nhắn cho bác sĩ..." : "Đang kết nối lại..."}
                        variant="outlined"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        disabled={!isConnected}
                        InputProps={{
                            sx: { borderRadius: 4, bgcolor: '#f0f2f5', pr: 1 },
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={handleSend}
                                        color="primary"
                                        disabled={!text.trim() || !isConnected}
                                        sx={{
                                            bgcolor: text.trim() ? 'primary.main' : 'transparent',
                                            color: text.trim() ? 'white' : 'grey.500',
                                            '&:hover': { bgcolor: text.trim() ? 'primary.dark' : 'transparent' },
                                            width: 40, height: 40
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
        </Grid>
    );
}