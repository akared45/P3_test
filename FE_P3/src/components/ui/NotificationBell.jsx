import React, { useState, useContext } from "react";
import {
    IconButton, Badge, Menu, MenuItem, Box, Typography,
    Divider, Avatar, Button, ListItemText, ListItemAvatar
} from "@mui/material";
import {
    Notifications as BellIcon,
    NotificationsNone as NoNotiIcon,
    Circle as DotIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { NotificationContext } from "../../providers/NotificationProvider";

const NotificationBell = () => {
    const {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead
    } = useContext(NotificationContext);

    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNotificationClick = async (noti) => {
        await markAsRead(noti.id);
        handleClose();
        if (noti.link) {
            navigate(noti.link);
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' });
    };

    return (
        <>
            <IconButton
                size="small"
                color="inherit"
                onClick={handleClick}
                sx={{ color: 'text.secondary' }}
            >
                <Badge badgeContent={unreadCount} color="error" max={99}>
                    <BellIcon />
                </Badge>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={null}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        width: 360,
                        maxHeight: '70vh',
                        overflowY: 'auto',

                        '& .MuiAvatar-root': { width: 32, height: 32, ml: -0.5, mr: 1 },
                        '&:before': {
                            content: '""', display: 'block', position: 'absolute', top: 0, right: 14, width: 10, height: 10, bgcolor: 'background.paper', transform: 'translateY(-50%) rotate(45deg)', zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1" fontWeight="bold">Thông báo</Typography>
                    {unreadCount > 0 && (
                        <Button size="small" onClick={markAllAsRead} sx={{ fontSize: '0.75rem', textTransform: 'none' }}>
                            Đánh dấu đã đọc
                        </Button>
                    )}
                </Box>
                <Divider />
                <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                        <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
                            <NoNotiIcon sx={{ fontSize: 40, mb: 1, color: 'text.disabled' }} />
                            <Typography variant="body2">Không có thông báo mới</Typography>
                        </Box>
                    ) : (
                        notifications.map((noti) => (
                            <MenuItem
                                key={noti.id}
                                onClick={() => handleNotificationClick(noti)}
                                sx={{
                                    py: 1.5,
                                    px: 2,
                                    alignItems: 'flex-start',
                                    whiteSpace: 'normal',
                                    bgcolor: noti.isRead ? 'transparent' : 'action.hover',
                                    borderLeft: noti.isRead ? '3px solid transparent' : '3px solid #1976d2'
                                }}
                            >
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: 'primary.light' }}>
                                        <BellIcon sx={{ fontSize: 18, color: 'white' }} />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Typography variant="subtitle2" sx={{ fontWeight: noti.isRead ? 400 : 700, lineHeight: 1.3 }}>
                                            {noti.title}
                                        </Typography>
                                    }
                                    secondary={
                                        <>
                                            <Typography variant="body2" component="span" sx={{ display: 'block', my: 0.5, color: 'text.primary', fontSize: '0.85rem' }}>
                                                {noti.message}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {formatTime(noti.createdAt)}
                                            </Typography>
                                        </>
                                    }
                                />
                                {!noti.isRead && (
                                    <DotIcon sx={{ fontSize: 10, color: 'primary.main', mt: 1 }} />
                                )}
                            </MenuItem>
                        ))
                    )}
                </Box>

                <Divider />
                <Box sx={{ p: 1, textAlign: 'center' }}>
                    <Button size="small" fullWidth onClick={() => { handleClose(); navigate('/notifications'); }}>
                        Xem tất cả
                    </Button>
                </Box>
            </Menu>
        </>
    );
};

export default NotificationBell;