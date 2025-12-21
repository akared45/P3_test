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

            const gracePeriodEnd = end + (5 * 60 * 1000);

            if (now < start) {
                setStatus({
                    label: 'Chưa bắt đầu',
                    color: 'default',
                    icon: <WaitIcon fontSize="small" />
                });
                return;
            }

            if (now >= start && now <= end) {
                const diff = end - now;
                const mins = Math.floor(diff / 60000);
                const secs = Math.floor((diff % 60000) / 1000);
                const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

                let color = 'success';
                if (mins < 2) color = 'error';
                else if (mins < 5) color = 'warning';

                setStatus({
                    label: `Còn lại: ${timeStr}`,
                    color: color,
                    icon: <TimeIcon fontSize="small" />
                });
                return;
            }

            if (now > end && now <= gracePeriodEnd) {
                setStatus({
                    label: 'Đang bù giờ',
                    color: 'secondary',
                    icon: <OvertimeIcon fontSize="small" />
                });
                return;
            }

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