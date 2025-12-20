import React from 'react';
import {
    Box, Grid, List, ListItemButton, ListItemText, ListItemAvatar,
    Avatar, Typography, Chip, Divider, Badge
} from "@mui/material";
import { 
    FiberManualRecord as DotIcon, 
    Person as DoctorIcon, 
    Block as BlockIcon, 
    CheckCircle as CheckCircleIcon, 
    AccessTime as PendingIcon 
} from "@mui/icons-material";

export default function DoctorListSidebar({
    appointments = [],
    activeId,
    setActiveId,
    isConnected,
    onlineUsers = [] 
}) {

    const getAvatarUrl = (url) => {
        if (!url) return "";
        if (url.startsWith("http")) return url;
        return "http://localhost:3000" + url;
    };

    const groupedAppointments = {
        pending: appointments.filter(app => ['pending', 'PENDING'].includes(app.status)),
        active: appointments.filter(app => ['active', 'ACTIVE', 'confirmed', 'CONFIRMED'].includes(app.status)),
        completed: appointments.filter(app => ['completed', 'COMPLETED', 'finished', 'FINISHED'].includes(app.status)),
        cancelled: appointments.filter(app => ['cancelled', 'CANCELLED'].includes(app.status))
    };

    const getStatusDetails = (app) => {
        const status = app.status?.toLowerCase();
        const isDoctorOnline = onlineUsers.includes(app.doctor?.id);
        console.log(isDoctorOnline);
        if (status === 'active' || status === 'confirmed') {
            return {
                color: isDoctorOnline ? 'success' : 'warning',
                text: isDoctorOnline ? 'Bác sĩ đã sẵn sàng' : 'Chờ bác sĩ vào',
                icon: <DotIcon fontSize="small" sx={{ 
                    animation: isDoctorOnline ? 'pulse 2s infinite' : 'none',
                    '@keyframes pulse': {
                        '0%': { opacity: 1 },
                        '50%': { opacity: 0.4 },
                        '100%': { opacity: 1 },
                    }
                }} />
            };
        }

        switch (status) {
            case 'pending':
                return { color: 'warning', text: 'Chờ xác nhận', icon: <PendingIcon fontSize="small" /> };
            case 'completed':
            case 'finished':
                return { color: 'primary', text: 'Đã hoàn thành', icon: <CheckCircleIcon fontSize="small" /> };
            case 'cancelled':
                return { color: 'error', text: 'Đã hủy', icon: <BlockIcon fontSize="small" /> };
            default:
                return { color: 'default', text: status, icon: <PendingIcon fontSize="small" /> };
        }
    };

    const renderAppointmentList = (title, appointmentsList) => {
        if (appointmentsList.length === 0) return null;

        return (
            <Box sx={{ mb: 2 }}>
                <Typography 
                    variant="subtitle2" 
                    sx={{ px: 2, py: 1, color: 'text.secondary', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', borderBottom: '1px solid', borderColor: 'divider' }}
                >
                    {title} ({appointmentsList.length})
                </Typography>
                <List sx={{ p: 0 }}>
                    {appointmentsList.map((app) => {
                        const details = getStatusDetails(app);
                        const canChat = ['active', 'confirmed'].includes(app.status?.toLowerCase());
                        
                        return (
                            <Box key={app.id}>
                                <ListItemButton
                                    selected={activeId === app.id}
                                    onClick={() => canChat && setActiveId(app.id)}
                                    disabled={!canChat}
                                    sx={{
                                        py: 2,
                                        opacity: canChat ? 1 : 0.6,
                                        '&.Mui-selected': { bgcolor: '#e3f2fd', borderRight: '4px solid', borderColor: 'primary.main' }
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Badge
                                            overlap="circular"
                                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                            badgeContent={React.cloneElement(details.icon, { color: details.color })}
                                        >
                                            <Avatar 
                                                src={getAvatarUrl(app.doctor?.avatar)}
                                                sx={{ width: 45, height: 45, bgcolor: 'primary.light' }}
                                            >
                                                <DoctorIcon />
                                            </Avatar>
                                        </Badge>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                                <Typography variant="subtitle2" fontWeight="bold">
                                                    {app.doctor?.name || "Bác sĩ"}
                                                </Typography>
                                                <Chip 
                                                    label={details.text} 
                                                    color={details.color} 
                                                    size="small" 
                                                    variant="outlined" 
                                                    sx={{ height: 18, fontSize: '0.6rem', fontWeight: 'bold' }} 
                                                />
                                            </Box>
                                        }
                                        secondary={
                                            <Typography variant="caption" color="text.secondary">
                                                {new Date(app.appointmentDate).toLocaleDateString('vi-VN')} • {app.type === 'chat' ? 'Tư vấn Chat' : 'Video Call'}
                                            </Typography>
                                        }
                                    />
                                </ListItemButton>
                                <Divider component="li" />
                            </Box>
                        );
                    })}
                </List>
            </Box>
        );
    };

    return (
        <Grid item sx={{ width: '320px', borderRight: 1, borderColor: 'divider', display: 'flex', flexDirection: 'column', bgcolor: '#fff', height: '100%' }}>
            {/* Header */}
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1rem', color: 'primary.dark' }}>
                        Phòng tư vấn
                    </Typography>
                </Box>
                <Chip
                    icon={<DotIcon sx={{ 
                        fontSize: 12, 
                        color: isConnected ? 'success.main' : 'error.main',
                        animation: isConnected ? 'pulse 2.5s infinite' : 'none'
                    }} />}
                    label={isConnected ? "Máy chủ: Đã kết nối" : "Máy chủ: Mất kết nối"}
                    size="small"
                    variant="outlined"
                    sx={{ 
                        height: 24, fontSize: 11, border: 'none', 
                        bgcolor: isConnected ? '#f0fff4' : '#fff5f5',
                        color: isConnected ? 'success.dark' : 'error.dark'
                    }}
                />
            </Box>

            {/* List */}
            <Box sx={{ flex: 1, overflowY: 'auto' }}>
                {appointments.length === 0 ? (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">Không có lịch hẹn nào</Typography>
                    </Box>
                ) : (
                    <>
                        {renderAppointmentList('Đang hoạt động', groupedAppointments.active)}
                        {renderAppointmentList('Chờ xác nhận', groupedAppointments.pending)}
                        {renderAppointmentList('Lịch sử tư vấn', groupedAppointments.completed)}
                        {renderAppointmentList('Đã hủy', groupedAppointments.cancelled)}
                    </>
                )}
            </Box>
        </Grid>
    );
}