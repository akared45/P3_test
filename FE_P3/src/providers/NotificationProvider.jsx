import React, { createContext, useState, useEffect, useContext } from 'react';
import { socket, connectSocket } from "../services/socket";
import { AuthContext } from "./AuthProvider";
import { ToastContext } from "./ToastProvider";
import { notificationApi } from '../services/api';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const { toast } = useContext(ToastContext);

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        if (!user) return;
        try {
            const res = await notificationApi.getAll({ limit: 20, offset: 0 });
            setNotifications(res.data.notifications || []);
            setUnreadCount(res.data.unreadCount || 0);
        } catch (error) {
            console.error("Lỗi tải thông báo:", error);
        }
    };

    const markAsRead = async (id) => {
        try {
            await notificationApi.markAsRead(id);

            setNotifications(prev => prev.map(n => 
                n.id === id ? { ...n, isRead: true } : n
            ));

            const target = notifications.find(n => n.id === id);
            if (target && !target.isRead) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error("Lỗi markAsRead:", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await notificationApi.markAsRead('ALL');
            
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (user && user.id) {
            fetchNotifications();
        }
    }, [user]);

    useEffect(() => {
        if (user && user.id) {
            if (!socket.connected) {
                const token = localStorage.getItem('accessToken');
                if(token) connectSocket(token);
            }

            const handleJoinRoom = () => {
                console.log("🔔 Joining user room:", user.id);
                socket.emit("join_user_room", user.id);
            };

            if (socket.connected) {
                handleJoinRoom();
            } else {
                socket.on("connect", handleJoinRoom);
            }

            const handleNewNotification = (newNoti) => {
                toast.info(newNoti.message);
                setNotifications((prev) => [newNoti, ...prev]);
                setUnreadCount((prev) => prev + 1);
            };

            socket.on("new_notification", handleNewNotification);
            return () => {
                socket.off("connect", handleJoinRoom);
                socket.off("new_notification", handleNewNotification);
            };
        }
    }, [user]);

    return (
        <NotificationContext.Provider value={{ 
            notifications, 
            unreadCount, 
            fetchNotifications,
            markAsRead, 
            markAllAsRead 
        }}>
            {children}
        </NotificationContext.Provider>
    );
};