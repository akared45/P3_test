import {
    Box, Grid, List, ListItemButton, ListItemText, ListItemAvatar,
    Avatar, Typography, Chip, Divider, Badge
} from "@mui/material";
import { FiberManualRecord as DotIcon, Person as DoctorIcon, Block as BlockIcon, CheckCircle as CheckCircleIcon, AccessTime as PendingIcon } from "@mui/icons-material";

export default function DoctorListSidebar({
    appointments,
    activeId,
    setActiveId,
    isConnected
}) {
    console.log(appointments);
    const getAvatarUrl = (url) => {
        if (!url) return "";
        if (url.startsWith("http")) return url;
        return "http://localhost:3000" + url;
    };

    const groupedAppointments = {
        pending: appointments.filter(app => app.status === 'pending' || app.status === 'PENDING'),
        active: appointments.filter(app => app.status === 'active' || app.status === 'ACTIVE' || app.status === 'confirmed'),
        completed: appointments.filter(app => app.status === 'completed' || app.status === 'COMPLETED' || app.status === 'finished'),
        cancelled: appointments.filter(app => app.status === 'cancelled' || app.status === 'CANCELLED')
    };

    const getStatusIcon = (status) => {
        switch(status?.toLowerCase()) {
            case 'pending': return <PendingIcon fontSize="small" color="warning" />;
            case 'active': 
            case 'confirmed': return <DotIcon fontSize="small" color="success" />;
            case 'completed': 
            case 'finished': return <CheckCircleIcon fontSize="small" color="primary" />;
            case 'cancelled': return <BlockIcon fontSize="small" color="error" />;
            default: return <PendingIcon fontSize="small" />;
        }
    };

    const getStatusColor = (status) => {
        switch(status?.toLowerCase()) {
            case 'pending': return 'warning';
            case 'active': 
            case 'confirmed': return 'success';
            case 'completed': 
            case 'finished': return 'primary';
            case 'cancelled': return 'error';
            default: return 'default';
        }
    };

    const getStatusText = (status) => {
        switch(status?.toLowerCase()) {
            case 'pending': return 'Chờ xác nhận';
            case 'active': 
            case 'confirmed': return 'Đang hoạt động';
            case 'completed': 
            case 'finished': return 'Đã hoàn thành';
            case 'cancelled': return 'Đã hủy';
            default: return status;
        }
    };

    const renderAppointmentList = (title, appointmentsList, statusType) => {
        if (appointmentsList.length === 0) return null;

        return (
            <Box sx={{ mb: 2 }}>
                <Typography 
                    variant="subtitle2" 
                    sx={{ 
                        px: 2, 
                        py: 1, 
                        color: 'text.secondary',
                        fontWeight: 'medium',
                        fontSize: '0.85rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        borderBottom: '1px solid',
                        borderColor: 'divider'
                    }}
                >
                    {title} ({appointmentsList.length})
                </Typography>
                <List sx={{ p: 0 }}>
                    {appointmentsList.map((app) => (
                        <Box key={app.id}>
                            <ListItemButton
                                selected={activeId === app.id}
                                onClick={() => {
                                    if (app.status === 'active' || app.status === 'confirmed' || app.status === 'ACTIVE') {
                                        setActiveId(app.id);
                                    }
                                }}
                                sx={{
                                    py: 2,
                                    opacity: (app.status === 'active' || app.status === 'confirmed' || app.status === 'ACTIVE') ? 1 : 0.7,
                                    '&.Mui-selected': {
                                        bgcolor: '#e3f2fd',
                                        borderRight: '4px solid',
                                        borderColor: 'primary.main'
                                    },
                                    '&:hover': { bgcolor: 'grey.50' },
                                    cursor: (app.status === 'active' || app.status === 'confirmed' || app.status === 'ACTIVE') ? 'pointer' : 'default'
                                }}
                                disabled={!(app.status === 'active' || app.status === 'confirmed' || app.status === 'ACTIVE')}
                            >
                                <ListItemAvatar>
                                    <Badge
                                        overlap="circular"
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        badgeContent={getStatusIcon(app.status)}
                                    >
                                        <Avatar 
                                            src={getAvatarUrl(app.doctor.avatar)}
                                            sx={{ 
                                                bgcolor: 'primary.main', 
                                                width: 45, 
                                                height: 45,
                                                filter: !(app.status === 'active' || app.status === 'confirmed' || app.status === 'ACTIVE') ? 'grayscale(30%)' : 'none'
                                            }}
                                        >
                                            <DoctorIcon />
                                        </Avatar>
                                    </Badge>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="subtitle2" fontWeight="bold">
                                                {app.doctor.name}
                                            </Typography>
                                            <Chip
                                                label={getStatusText(app.status)}
                                                color={getStatusColor(app.status)}
                                                size="small"
                                                variant="outlined"
                                                sx={{ height: 20, fontSize: '0.65rem' }}
                                            />
                                        </Box>
                                    }
                                    secondary={
                                        <Box sx={{ mt: 0.5 }}>
                                            <Typography variant="caption" display="block" color="text.secondary">
                                                {new Date(app.appointmentDate).toLocaleDateString('vi-VN')}
                                            </Typography>
                                            {!(app.status === 'active' || app.status === 'confirmed' || app.status === 'ACTIVE') && (
                                                <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                                    Không thể chat
                                                </Typography>
                                            )}
                                        </Box>
                                    }
                                />
                            </ListItemButton>
                            <Divider component="li" />
                        </Box>
                    ))}
                </List>
            </Box>
        );
    };

    const totalAppointments = appointments.length;

    return (
        <Grid item sx={{ width: '300px', borderRight: 1, borderColor: 'divider', display: 'flex', flexDirection: 'column', bgcolor: '#fff' }}>
            <Box sx={{ p: 2.5, borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'primary.main' }}>
                        Tư vấn sức khỏe
                    </Typography>
                    <Chip 
                        label={`${totalAppointments} cuộc hẹn`}
                        size="small"
                        variant="outlined"
                        sx={{ height: 24, fontSize: 11 }}
                    />
                </Box>
                <Chip
                    icon={<DotIcon style={{ fontSize: 12 }} />}
                    label={isConnected ? "Trực tuyến" : "Mất kết nối"}
                    color={isConnected ? "success" : "default"}
                    size="small"
                    variant="outlined"
                    sx={{ height: 24, fontSize: 11, border: 'none', bgcolor: isConnected ? '#e6fffa' : '#f5f5f5' }}
                />
            </Box>

            <Box sx={{ flex: 1, overflowY: 'auto', p: 0 }}>
                {totalAppointments === 0 ? (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            Bạn chưa có lịch hẹn nào.
                        </Typography>
                    </Box>
                ) : (
                    <>
                        {renderAppointmentList('Đang hoạt động', groupedAppointments.active, 'active')}
                        {renderAppointmentList('Chờ xác nhận', groupedAppointments.pending, 'pending')}
                        {renderAppointmentList('Đã hoàn thành', groupedAppointments.completed, 'completed')}
                        {renderAppointmentList('Đã hủy', groupedAppointments.cancelled, 'cancelled')}
                    </>
                )}
            </Box>
        </Grid>
    );
}