import React, { useMemo } from "react";
import {
    Box, Paper, Typography, Avatar, Tooltip, Chip, Stack,
    Grid
} from "@mui/material";
import { getImageUrl } from "@utils/imageHelper";

const DAYS = [
    { key: "Monday", label: "Thứ 2" },
    { key: "Tuesday", label: "Thứ 3" },
    { key: "Wednesday", label: "Thứ 4" },
    { key: "Thursday", label: "Thứ 5" },
    { key: "Friday", label: "Thứ 6" },
    { key: "Saturday", label: "Thứ 7" },
];

const VisualSchedule = ({ doctors }) => {
    const scheduleMap = useMemo(() => {
        const map = {};
        DAYS.forEach(d => map[d.key] = []);

        doctors.forEach(doc => {
            if (!doc.schedules) return;
            doc.schedules.forEach(slot => {
                if (map[slot.day]) {
                    map[slot.day].push({
                        doctor: doc,
                        slot: slot
                    });
                }
            });
        });

        Object.keys(map).forEach(dayKey => {
            map[dayKey].sort((a, b) => a.slot.start.localeCompare(b.slot.start));
        });

        return map;
    }, [doctors]);

    return (
        <Box sx={{ width: '100%' }}>
            {/* Dòng 1: Thứ 2, 3, 4 */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
                {DAYS.slice(0, 3).map((day) => (
                    <Grid item xs={12} md={4} key={day.key} sx={{ display: 'flex' }}>
                        <ScheduleColumn day={day} shifts={scheduleMap[day.key]} />
                    </Grid>
                ))}
            </Grid>
            
            {/* Dòng 2: Thứ 5, 6, 7 */}
            <Grid container spacing={2}>
                {DAYS.slice(3, 6).map((day) => (
                    <Grid item xs={12} md={4} key={day.key} sx={{ display: 'flex' }}>
                        <ScheduleColumn day={day} shifts={scheduleMap[day.key]} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

// Component con cho mỗi cột
const ScheduleColumn = ({ day, shifts }) => {
    return (
        <Paper
            variant="outlined"
            sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                bgcolor: '#f8fafc',
                borderColor: shifts.length > 0 ? '#1976d2' : '#e0e0e0',
                overflow: 'hidden',
            }}
        >
            <Box 
                p={2} 
                textAlign="center" 
                borderBottom="1px solid #e0e0e0" 
                bgcolor="white"
                sx={{ flexShrink: 0 }}
            >
                <Typography variant="h6" fontWeight="bold" color="primary">
                    {day.label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {shifts.length} ca trực
                </Typography>
            </Box>

            <Box sx={{ 
                flex: 1,
                overflowY: 'auto',
                p: 2
            }}>
                <Stack spacing={1.5}>
                    {shifts.map((item, index) => (
                        <Tooltip
                            key={index}
                            title={`${item.doctor.fullName} (${item.slot.start}-${item.slot.end})`}
                            arrow
                        >
                            <Box
                                sx={{
                                    p: 1.5,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    borderRadius: 1,
                                    border: '1px solid #e0e0e0',
                                    bgcolor: 'white',
                                    '&:hover': { 
                                        borderColor: '#1976d2'
                                    },
                                }}
                            >
                                <Avatar
                                    src={getImageUrl(item.doctor.avatarUrl)}
                                    sx={{ 
                                        width: 36, 
                                        height: 36, 
                                        border: '1px solid #eee'
                                    }}
                                />

                                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                    <Chip
                                        label={`${item.slot.start}-${item.slot.end}`}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                        sx={{ 
                                            fontSize: '0.75rem', 
                                            mb: 0.5
                                        }}
                                    />
                                    <Typography 
                                        variant="body2" 
                                        fontWeight="bold" 
                                        noWrap 
                                        sx={{ fontSize: '0.9rem' }}
                                    >
                                        {item.doctor.fullName}
                                    </Typography>
                                </Box>
                            </Box>
                        </Tooltip>
                    ))}

                    {shifts.length === 0 && (
                        <Box 
                            textAlign="center" 
                            py={3} 
                            sx={{ opacity: 0.5 }}
                        >
                            <Typography variant="body2">
                                Không có ca trực
                            </Typography>
                        </Box>
                    )}
                </Stack>
            </Box>
        </Paper>
    );
};

export default VisualSchedule;