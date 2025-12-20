import React, { useState, useEffect, useMemo } from 'react';
import { Chip } from '@mui/material';
import { 
    AccessTime as TimeIcon, 
    HourglassEmpty as WaitIcon, 
    History as OvertimeIcon 
} from '@mui/icons-material';

const SessionTimer = ({ appointment, onTimeUp }) => {
    const [status, setStatus] = useState({ label: '', color: 'default', icon: <TimeIcon /> });

    useEffect(() => {
        if (!appointment) return;

        const updateTimer = () => {
            const now = new Date().getTime();
            const start = new Date(appointment.startTime || appointment.appointmentDate).getTime();
            const end = new Date(appointment.endTime).getTime();
            
            // 30 phút bù giờ (Grace Period) như logic ở Backend/Frontend trước đó của bạn
            const gracePeriodEnd = end + (30 * 60 * 1000); 

            // GIAI ĐOẠN 1: CHƯA ĐẾN GIỜ KHÁM
            if (now < start) {
                setStatus({
                    label: 'Chưa bắt đầu',
                    color: 'default',
                    icon: <WaitIcon fontSize="small" />
                });
                return;
            }

            // GIAI ĐOẠN 2: ĐANG TRONG PHIÊN TƯ VẤN (Đếm ngược)
            if (now >= start && now <= end) {
                const diff = end - now;
                const mins = Math.floor(diff / 60000);
                const secs = Math.floor((diff % 60000) / 1000);
                const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

                let color = 'success';
                if (mins < 2) color = 'error'; // < 2p nháy đỏ
                else if (mins < 5) color = 'warning'; // < 5p hiện vàng

                setStatus({
                    label: `Còn lại: ${timeStr}`,
                    color: color,
                    icon: <TimeIcon fontSize="small" />
                });
                return;
            }

            // GIAI ĐOẠN 3: ĐANG BÙ GIỜ (Overtime - Hết giờ chính thức nhưng chưa đóng phòng)
            if (now > end && now <= gracePeriodEnd) {
                setStatus({
                    label: 'Đang bù giờ',
                    color: 'secondary', // Thường là màu tím hoặc cam đậm
                    icon: <OvertimeIcon fontSize="small" />
                });
                return;
            }

            // GIAI ĐOẠN 4: KẾT THÚC HOÀN TOÀN
            if (now > gracePeriodEnd) {
                setStatus({
                    label: 'Đã hết giờ',
                    color: 'error',
                    icon: <TimeIcon fontSize="small" />
                });
                if (onTimeUp) onTimeUp();
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [appointment, onTimeUp]);

    return (
        <Chip
            icon={status.icon}
            label={status.label}
            color={status.color}
            variant="filled"
            sx={{ 
                fontWeight: 'bold', 
                minWidth: '130px',
                animation: status.color === 'error' || status.color === 'secondary' ? 'pulse-custom 1.5s infinite' : 'none',
                '@keyframes pulse-custom': {
                    '0%': { opacity: 1, transform: 'scale(1)' },
                    '50%': { opacity: 0.7, transform: 'scale(0.98)' },
                    '100%': { opacity: 1, transform: 'scale(1)' },
                }
            }}
        />
    );
};

export default SessionTimer;