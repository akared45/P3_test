import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    IconButton,
    Tabs,
    Tab,
    Button,
    Divider,
    Chip,
    Menu,
    MenuItem,
    CircularProgress,
    Alert
} from '@mui/material';
import {
    Notifications as BellIcon,
    CheckCircle,
    Error as ErrorIcon,
    Info,
    Payment,
    EventAvailable,
    MoreVert,
    DoneAll,
    DeleteOutline
} from '@mui/icons-material';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import relativeTime from 'dayjs/plugin/relativeTime';
import { notificationApi } from '../../../services/api';

dayjs.extend(relativeTime);
dayjs.locale('vi');

const NotificationPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                setLoading(true);
                const res = await notificationApi.getAll();
                const data = res.data.notifications;
                console.log(data);
                const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setNotifications(sortedData);
            } catch (error) {
                console.error("Lỗi tải thông báo:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    const getNotificationStyle = (type) => {
        switch (type) {
            case 'appointment_success':
            case 'confirmed':
                return { icon: <CheckCircle />, color: '#4caf50', bg: '#e8f5e9' };
            case 'appointment_cancel':
            case 'cancelled':
                return { icon: <ErrorIcon />, color: '#f44336', bg: '#ffebee' };
            case 'payment_required':
            case 'payment':
                return { icon: <Payment />, color: '#ff9800', bg: '#fff3e0' };
            case 'promo':
            case 'system':
                return { icon: <EventAvailable />, color: '#9c27b0', bg: '#f3e5f5' };
            default:
                return { icon: <Info />, color: '#2196f3', bg: '#e3f2fd' };
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const displayedNotifications = tabValue === 0
        ? notifications
        : notifications.filter(n => !n.isRead);

    const handleMarkAsRead = async (id) => {
        try {
            await notificationApi.markAsRead(id);
            setNotifications(prev => prev.map(n =>
                n.id === id || n._id === id ? { ...n, isRead: true } : n
            ));

            if (anchorEl) handleMenuClose();
        } catch (error) {
            console.error("Lỗi đánh dấu đã đọc:", error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            const unreadItems = notifications.filter(n => !n.isRead);
            await Promise.all(unreadItems.map(item => notificationApi.markAsRead(item.id || item._id)));
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error("Lỗi mark all:", error);
        }
    };

    const handleMenuOpen = (event, id) => {
        setAnchorEl(event.currentTarget);
        setSelectedId(id);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedId(null);
    };

    const handleDeleteNotification = async () => {
        if (!selectedId) return;

        try {
            await notificationApi.delete(selectedId);
            setNotifications((prev) =>
                prev.filter((n) => (n.id || n._id) !== selectedId)
            );
            handleMenuClose();
        } catch (error) {
            console.error("Lỗi xóa thông báo:", error);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box display="flex" alignItems="center" gap={1}>
                    <BellIcon color="primary" sx={{ fontSize: 32 }} />
                    <Typography variant="h4" fontWeight="bold" color="text.primary">
                        Thông báo
                    </Typography>
                    {notifications.filter(n => !n.isRead).length > 0 && (
                        <Chip
                            label={`${notifications.filter(n => !n.isRead).length} mới`}
                            color="error"
                            size="small"
                            sx={{ fontWeight: 'bold' }}
                        />
                    )}
                </Box>
                <Button
                    startIcon={<DoneAll />}
                    onClick={handleMarkAllRead}
                    disabled={notifications.every(n => n.isRead)}
                >
                    Đánh dấu đã đọc hết
                </Button>
            </Box>

            <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden', minHeight: '500px' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, pt: 1 }}>
                    <Tabs value={tabValue} onChange={handleTabChange}>
                        <Tab label="Tất cả" sx={{ fontWeight: 600 }} />
                        <Tab label="Chưa đọc" sx={{ fontWeight: 600 }} />
                    </Tabs>
                </Box>

                <List sx={{ p: 0 }}>
                    {displayedNotifications.length > 0 ? (
                        displayedNotifications.map((notification) => {
                            const style = getNotificationStyle(notification.type);
                            const itemId = notification.id || notification._id;

                            return (
                                <React.Fragment key={itemId}>
                                    <ListItem
                                        alignItems="flex-start"
                                        secondaryAction={
                                            <IconButton edge="end" onClick={(e) => handleMenuOpen(e, itemId)}>
                                                <MoreVert />
                                            </IconButton>
                                        }
                                        sx={{
                                            bgcolor: notification.isRead ? 'transparent' : '#f0f7ff',
                                            transition: '0.3s',
                                            '&:hover': { bgcolor: notification.isRead ? '#fafafa' : '#e3f2fd' },
                                            cursor: 'pointer',
                                            py: 2
                                        }}
                                        onClick={() => !notification.isRead && handleMarkAsRead(itemId)}
                                    >
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: style.bg, color: style.color }}>
                                                {style.icon}
                                            </Avatar>
                                        </ListItemAvatar>

                                        <ListItemText
                                            primary={
                                                <Box display="flex" justifyContent="space-between" alignItems="center" pr={4}>
                                                    <Typography
                                                        variant="subtitle1"
                                                        fontWeight={notification.isRead ? 500 : 700}
                                                        color={notification.isRead ? 'text.primary' : 'primary.main'}
                                                    >
                                                        {notification.title}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap', ml: 1 }}>
                                                        {dayjs(notification.createdAt).fromNow()}
                                                    </Typography>
                                                </Box>
                                            }
                                            secondary={
                                                <Typography
                                                    component="span"
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{
                                                        display: '-webkit-box',
                                                        overflow: 'hidden',
                                                        WebkitBoxOrient: 'vertical',
                                                        WebkitLineClamp: 2,
                                                        mt: 0.5
                                                    }}
                                                >
                                                    {notification.content || notification.message}
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                    <Divider component="li" />
                                </React.Fragment>
                            );
                        })
                    ) : (
                        <Box py={8} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                            <Typography color="text.secondary">
                                Không có thông báo nào.
                            </Typography>
                        </Box>
                    )}
                </List>
            </Paper>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{ elevation: 3 }}
            >
                <MenuItem onClick={() => handleMarkAsRead(selectedId)}>
                    <CheckCircle fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} /> Đánh dấu đã đọc
                </MenuItem>
                <MenuItem onClick={handleDeleteNotification} sx={{ color: 'error.main' }}>
                    <DeleteOutline fontSize="small" sx={{ mr: 1 }} />
                    Xóa thông báo
                </MenuItem>
            </Menu>

        </Container>
    );
};

export default NotificationPage;