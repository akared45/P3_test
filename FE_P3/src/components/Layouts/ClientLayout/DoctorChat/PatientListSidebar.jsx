import {
    Box, Grid, List, ListItemButton, ListItemText, ListItemAvatar,
    Avatar, Typography, Chip, ListSubheader, Divider, Button,
    Badge, IconButton
} from "@mui/material";
import {
    FiberManualRecord as DotIcon,
    CheckCircle as CheckIcon,
    AccessTime as PendingIcon,
    Person as PersonIcon
} from "@mui/icons-material";

export default function PatientListSidebar({
    appointments,
    activeId,
    setActiveId,
    isConnected,
    onAcceptAppointment
}) {
    console.log(appointments);

    const groupedApps = {
        pending: appointments.filter(a => a.status === 'pending' || a.status === 'PENDING'),
        in_progress: appointments.filter(a => a.status === 'in_progress' || a.status === 'IN_PROGRESS'),
        confirmed: appointments.filter(a => a.status === 'confirmed' || a.status === 'CONFIRMED'),
        completed: appointments.filter(a => a.status === 'completed' || a.status === 'COMPLETED'),
    };

    const statusLabels = {
        pending: 'Chờ xác nhận',
        in_progress: 'Đang tư vấn',
        confirmed: 'Đã xác nhận',
        completed: 'Đã hoàn thành'
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return <PendingIcon fontSize="small" color="warning" />;
            case 'in_progress': return <DotIcon fontSize="small" color="success" />;
            case 'confirmed': return <CheckIcon fontSize="small" color="info" />;
            case 'completed': return <CheckIcon fontSize="small" color="primary" />;
            default: return <PendingIcon fontSize="small" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'warning';
            case 'in_progress': return 'success';
            case 'confirmed': return 'info';
            case 'completed': return 'default';
            default: return 'default';
        }
    };

    const getAvatarColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'warning.main';
            case 'in_progress': return 'success.main';
            case 'confirmed': return 'info.main';
            case 'completed': return 'grey.400';
            default: return 'grey.400';
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    return (
        <Grid item xs={3} sx={{ borderRight: 1, borderColor: 'divider', display: 'flex', flexDirection: 'column', bgcolor: 'white' }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1rem', color: 'primary.main' }}>
                        Tư vấn trực tuyến
                    </Typography>
                    <Chip
                        label={`${appointments.length} cuộc hẹn`}
                        size="small"
                        variant="outlined"
                        sx={{ height: 24, fontSize: 11 }}
                    />
                </Box>
                <Chip
                    icon={<DotIcon style={{ fontSize: 12 }} />}
                    label={isConnected ? "Hệ thống Online" : "Mất kết nối"}
                    color={isConnected ? "success" : "error"}
                    size="small"
                    variant="outlined"
                    sx={{ height: 24, fontSize: 11 }}
                />
            </Box>

            <List sx={{ flex: 1, overflowY: 'auto', p: 0 }}>
                {appointments.length === 0 && (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            Chưa có lịch hẹn nào.
                        </Typography>
                    </Box>
                )}

                {groupedApps.pending.length > 0 && (
                    <Box key="pending">
                        <ListSubheader sx={{
                            lineHeight: '30px',
                            bgcolor: 'background.paper',
                            fontSize: 11,
                            textTransform: 'uppercase',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            <PendingIcon fontSize="small" color="warning" />
                            {statusLabels.pending} ({groupedApps.pending.length})
                        </ListSubheader>
                        {groupedApps.pending.map((app) => (
                            <ListItemButton
                                key={app.id}
                                selected={activeId === app.id}
                                onClick={() => setActiveId(app.id)}
                                sx={{
                                    py: 1.5,
                                    '&.Mui-selected': {
                                        bgcolor: 'warning.light',
                                        borderLeft: '4px solid',
                                        borderColor: 'warning.main'
                                    },
                                    position: 'relative'
                                }}
                            >
                                <ListItemAvatar>
                                    <Badge
                                        overlap="circular"
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        badgeContent={getStatusIcon(app.status)}
                                    >
                                        <Avatar
                                            sx={{
                                                bgcolor: getAvatarColor(app.status),
                                                width: 40,
                                                height: 40,
                                                fontSize: 14
                                            }}
                                        >
                                            {app.patient.name.charAt(0)}
                                        </Avatar>
                                    </Badge>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="subtitle2" fontWeight="bold">
                                                {app.patientName}
                                            </Typography>
                                            <Chip
                                                label="Chờ duyệt"
                                                color="warning"
                                                size="small"
                                                sx={{ height: 18, fontSize: '0.6rem' }}
                                            />
                                        </Box>
                                    }
                                    secondary={
                                        <>
                                            <Typography variant="caption" display="block" color="text.secondary">
                                                {app.symptoms || "Tư vấn chung"}
                                            </Typography>
                                            <Typography variant="caption" display="block" color="text.secondary">
                                                {formatDate(app.appointmentDate)} • {formatTime(app.appointmentDate)}
                                            </Typography>
                                        </>
                                    }
                                    primaryTypographyProps={{ variant: 'subtitle2' }}
                                    secondaryTypographyProps={{ variant: 'caption' }}
                                />

                                <Button
                                    variant="contained"
                                    color="success"
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onAcceptAppointment && onAcceptAppointment(app.id);
                                    }}
                                    sx={{
                                        minWidth: 'auto',
                                        px: 1,
                                        py: 0.5,
                                        fontSize: '0.7rem',
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        position: 'absolute',
                                        right: 8,
                                        top: 8,
                                        zIndex: 1
                                    }}
                                >
                                    <CheckIcon fontSize="small" sx={{ mr: 0.5 }} />
                                    Chấp nhận
                                </Button>
                            </ListItemButton>
                        ))}
                        <Divider />
                    </Box>
                )}

                {groupedApps.in_progress.length > 0 && (
                    <Box key="in_progress">
                        <ListSubheader sx={{
                            lineHeight: '30px',
                            bgcolor: 'background.paper',
                            fontSize: 11,
                            textTransform: 'uppercase',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            <DotIcon fontSize="small" color="success" />
                            {statusLabels.in_progress} ({groupedApps.in_progress.length})
                        </ListSubheader>
                        {groupedApps.in_progress.map((app) => (
                            <ListItemButton
                                key={app.id}
                                selected={activeId === app.id}
                                onClick={() => setActiveId(app.id)}
                                sx={{
                                    py: 1.5,
                                    '&.Mui-selected': {
                                        bgcolor: 'success.light',
                                        borderLeft: '4px solid',
                                        borderColor: 'success.main'
                                    }
                                }}
                            >
                                <ListItemAvatar>
                                    <Badge
                                        overlap="circular"
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        badgeContent={getStatusIcon(app.status)}
                                    >
                                        <Avatar
                                            sx={{
                                                bgcolor: getAvatarColor(app.status),
                                                width: 40,
                                                height: 40,
                                                fontSize: 14
                                            }}
                                        >
                                            {app.patient.name.charAt(0)}
                                        </Avatar>
                                    </Badge>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="subtitle2" fontWeight="bold">
                                                {app.patientName}
                                            </Typography>
                                            <Chip
                                                label="Đang tư vấn"
                                                color="success"
                                                size="small"
                                                sx={{ height: 18, fontSize: '0.6rem' }}
                                            />
                                        </Box>
                                    }
                                    secondary={
                                        <>
                                            <Typography variant="caption" display="block" color="text.secondary">
                                                {app.symptoms || "Tư vấn chung"}
                                            </Typography>
                                            <Typography variant="caption" display="block" color="text.secondary">
                                                {formatDate(app.appointmentDate)} • {formatTime(app.appointmentDate)}
                                            </Typography>
                                        </>
                                    }
                                    primaryTypographyProps={{ variant: 'subtitle2' }}
                                    secondaryTypographyProps={{ variant: 'caption' }}
                                />
                            </ListItemButton>
                        ))}
                        <Divider />
                    </Box>
                )}

                {groupedApps.confirmed.length > 0 && (
                    <Box key="confirmed">
                        <ListSubheader sx={{
                            lineHeight: '30px',
                            bgcolor: 'background.paper',
                            fontSize: 11,
                            textTransform: 'uppercase',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            <CheckIcon fontSize="small" color="info" />
                            {statusLabels.confirmed} ({groupedApps.confirmed.length})
                        </ListSubheader>
                        {groupedApps.confirmed.map((app) => (
                            <ListItemButton
                                key={app.id}
                                selected={activeId === app.id}
                                onClick={() => setActiveId(app.id)}
                                sx={{
                                    py: 1.5,
                                    '&.Mui-selected': {
                                        bgcolor: 'info.light',
                                        borderLeft: '4px solid',
                                        borderColor: 'info.main'
                                    }
                                }}
                            >
                                <ListItemAvatar>
                                    <Badge
                                        overlap="circular"
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        badgeContent={getStatusIcon(app.status)}
                                    >
                                        <Avatar
                                            sx={{
                                                bgcolor: getAvatarColor(app.status),
                                                width: 40,
                                                height: 40,
                                                fontSize: 14
                                            }}
                                        >
                                            {app.patient.name.charAt(0)}
                                        </Avatar>
                                    </Badge>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="subtitle2" fontWeight="bold">
                                                {app.patientName}
                                            </Typography>
                                            <Chip
                                                label="Đã xác nhận"
                                                color="info"
                                                size="small"
                                                sx={{ height: 18, fontSize: '0.6rem' }}
                                            />
                                        </Box>
                                    }
                                    secondary={
                                        <>
                                            <Typography variant="caption" display="block" color="text.secondary">
                                                {app.symptoms || "Tư vấn chung"}
                                            </Typography>
                                            <Typography variant="caption" display="block" color="text.secondary">
                                                {formatDate(app.appointmentDate)} • {formatTime(app.appointmentDate)}
                                            </Typography>
                                        </>
                                    }
                                    primaryTypographyProps={{ variant: 'subtitle2' }}
                                    secondaryTypographyProps={{ variant: 'caption' }}
                                />
                            </ListItemButton>
                        ))}
                        <Divider />
                    </Box>
                )}

                {groupedApps.completed.length > 0 && (
                    <Box key="completed">
                        <ListSubheader sx={{
                            lineHeight: '30px',
                            bgcolor: 'background.paper',
                            fontSize: 11,
                            textTransform: 'uppercase',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            <CheckIcon fontSize="small" color="primary" />
                            {statusLabels.completed} ({groupedApps.completed.length})
                        </ListSubheader>
                        {groupedApps.completed.map((app) => (
                            <ListItemButton
                                key={app.id}
                                selected={activeId === app.id}
                                onClick={() => setActiveId(app.id)}
                                sx={{
                                    py: 1.5,
                                    opacity: 0.7,
                                    '&.Mui-selected': {
                                        bgcolor: 'grey.100',
                                        borderLeft: '4px solid',
                                        borderColor: 'grey.400'
                                    }
                                }}
                            >
                                <ListItemAvatar>
                                    <Badge
                                        overlap="circular"
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        badgeContent={getStatusIcon(app.status)}
                                    >
                                        <Avatar
                                            sx={{
                                                bgcolor: getAvatarColor(app.status),
                                                width: 40,
                                                height: 40,
                                                fontSize: 14
                                            }}
                                        >
                                            {app.patient.name.charAt(0)}
                                        </Avatar>
                                    </Badge>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Typography variant="subtitle2">
                                            {app.patientName}
                                        </Typography>
                                    }
                                    secondary={
                                        <>
                                            <Typography variant="caption" display="block" color="text.secondary">
                                                {app.symptoms || "Tư vấn chung"}
                                            </Typography>
                                            <Typography variant="caption" display="block" color="text.secondary">
                                                {formatDate(app.appointmentDate)} • {formatTime(app.appointmentDate)}
                                            </Typography>
                                        </>
                                    }
                                    primaryTypographyProps={{ variant: 'subtitle2' }}
                                    secondaryTypographyProps={{ variant: 'caption' }}
                                />
                            </ListItemButton>
                        ))}
                        <Divider />
                    </Box>
                )}
            </List>
        </Grid>
    );
}