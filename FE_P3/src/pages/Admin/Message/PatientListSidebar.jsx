import React from 'react';
import {
    Box, Grid, List, ListItemButton, ListItemText, ListItemAvatar,
    Avatar, Typography, Chip, ListSubheader, Divider, Button,
    Badge
} from "@mui/material";
import {
    FiberManualRecord as DotIcon,
    CheckCircle as CheckIcon,
    AccessTime as PendingIcon,
} from "@mui/icons-material";

export default function PatientListSidebar({
    appointments = [],
    activeId,
    setActiveId,
    isConnected,
    onAcceptAppointment,
    onlineUsers = [] // Danh sách ID người dùng đang online từ Socket
}) {

    // Phân nhóm lịch hẹn
    const groupedApps = {
        pending: appointments.filter(a => ['pending', 'PENDING'].includes(a.status)),
        in_progress: appointments.filter(a => ['in_progress', 'IN_PROGRESS', 'active', 'ACTIVE'].includes(a.status)),
        confirmed: appointments.filter(a => ['confirmed', 'CONFIRMED'].includes(a.status)),
        completed: appointments.filter(a => ['completed', 'COMPLETED', 'finished'].includes(a.status)),
    };

    // Hàm lấy chi tiết trạng thái (Màu, Chữ, Icon)
    const getStatusDetails = (app) => {
        const status = app.status?.toLowerCase();
        // Kiểm tra xem bệnh nhân của lịch hẹn này có trong danh sách online không
        const isPatientOnline = onlineUsers.some(id => String(id) === String(app.patient?.id || app.patientId));

        // Ưu tiên hiển thị trạng thái Online cho lịch đang hoạt động hoặc đã xác nhận
        if (['in_progress', 'confirmed', 'active'].includes(status)) {
            return {
                color: isPatientOnline ? 'success' : 'warning',
                label: isPatientOnline ? 'Bệnh nhân đã vào' : 'Chờ bệnh nhân',
                icon: <DotIcon fontSize="small" sx={{ 
                    animation: isPatientOnline ? 'pulse 2s infinite' : 'none',
                    '@keyframes pulse': {
                        '0%': { opacity: 1 },
                        '50%': { opacity: 0.4 },
                        '100%': { opacity: 1 },
                    }
                }} />
            };
        }

        // Các trạng thái mặc định khác
        switch (status) {
            case 'pending':
                return { color: 'warning', label: 'Chờ duyệt', icon: <PendingIcon fontSize="small" /> };
            case 'completed':
            case 'finished':
                return { color: 'default', label: 'Đã hoàn thành', icon: <CheckIcon fontSize="small" /> };
            default:
                return { color: 'default', label: status, icon: <DotIcon fontSize="small" /> };
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    const renderSection = (title, apps, showAcceptBtn = false) => {
        if (apps.length === 0) return null;

        return (
            <Box>
                <ListSubheader sx={{ 
                    lineHeight: '36px', bgcolor: 'grey.50', fontSize: 11, 
                    fontWeight: 'bold', textTransform: 'uppercase', color: 'text.secondary',
                    display: 'flex', alignItems: 'center', gap: 1
                }}>
                    {title} ({apps.length})
                </ListSubheader>
                {apps.map((app) => {
                    const details = getStatusDetails(app);
                    const isSelected = activeId === app.id;

                    return (
                        <ListItemButton
                            key={app.id}
                            selected={isSelected}
                            onClick={() => setActiveId(app.id)}
                            sx={{
                                py: 1.5,
                                borderLeft: isSelected ? '4px solid' : '4px solid transparent',
                                borderColor: `${details.color}.main`,
                                '&.Mui-selected': { bgcolor: `${details.color}.light`, opacity: 0.9 },
                                '&:hover': { bgcolor: 'grey.100' }
                            }}
                        >
                            <ListItemAvatar>
                                <Badge
                                    overlap="circular"
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    badgeContent={React.cloneElement(details.icon, { color: details.color })}
                                >
                                    <Avatar
                                        src={app.patient?.avatar}
                                        sx={{ 
                                            bgcolor: `${details.color}.main`, 
                                            width: 42, height: 42, fontSize: 16 
                                        }}
                                    >
                                        {app.patient?.name?.charAt(0) || "P"}
                                    </Avatar>
                                </Badge>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="subtitle2" fontWeight="bold" noWrap>
                                            {app.patient?.name || app.patientName}
                                        </Typography>
                                        <Chip
                                            label={details.label}
                                            color={details.color}
                                            size="small"
                                            sx={{ height: 16, fontSize: '0.6rem', fontWeight: 'bold' }}
                                        />
                                    </Box>
                                }
                                secondary={
                                    <Box sx={{ mt: 0.5 }}>
                                        <Typography variant="caption" display="block" color="text.primary" fontWeight="medium" noWrap>
                                            {app.symptoms || "Tư vấn sức khỏe"}
                                        </Typography>
                                        <Typography variant="caption" display="block" color="text.secondary">
                                            {formatDate(app.appointmentDate)} • {formatTime(app.appointmentDate)}
                                        </Typography>
                                    </Box>
                                }
                            />
                            {showAcceptBtn && (
                                <Button
                                    variant="contained"
                                    color="success"
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onAcceptAppointment?.(app.id);
                                    }}
                                    sx={{ minWidth: 'auto', px: 1, fontSize: '0.65rem', borderRadius: 1.5, ml: 1 }}
                                >
                                    Duyệt
                                </Button>
                            )}
                        </ListItemButton>
                    );
                })}
                <Divider />
            </Box>
        );
    };

    return (
        <Grid item xs={3} sx={{ borderRight: 1, borderColor: 'divider', display: 'flex', flexDirection: 'column', bgcolor: 'white', height: '100%' }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1rem', color: 'primary.main' }}>
                        Bệnh nhân của tôi
                    </Typography>
                </Box>
                <Chip
                    icon={<DotIcon sx={{ 
                        fontSize: 12, 
                        color: isConnected ? 'success.main' : 'error.main',
                        animation: isConnected ? 'pulse 2.5s infinite' : 'none'
                    }} />}
                    label={isConnected ? "Máy chủ: Trực tuyến" : "Máy chủ: Mất kết nối"}
                    size="small"
                    variant="outlined"
                    sx={{ 
                        height: 24, fontSize: 10, border: 'none', 
                        bgcolor: isConnected ? '#e6fffa' : '#fff5f5' 
                    }}
                />
            </Box>

            <Box sx={{ flex: 1, overflowY: 'auto' }}>
                {appointments.length === 0 ? (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">Không có lịch hẹn</Typography>
                    </Box>
                ) : (
                    <>
                        {renderSection('Đang tư vấn', groupedApps.in_progress)}
                        {renderSection('Chờ duyệt', groupedApps.pending, true)}
                        {renderSection('Đã xác nhận', groupedApps.confirmed)}
                        {renderSection('Lịch sử', groupedApps.completed)}
                    </>
                )}
            </Box>
        </Grid>
    );
}