import React, { useMemo } from "react";
import {
    Box, Grid, Paper, Typography, Avatar, Tooltip, Chip, Stack, Divider
} from "@mui/material";
import { AccessTime } from "@mui/icons-material";
import { getImageUrl } from "@utils/imageHelper";

const DAYS = [
    { key: "Monday", label: "Thứ 2" },
    { key: "Tuesday", label: "Thứ 3" },
    { key: "Wednesday", label: "Thứ 4" },
    { key: "Thursday", label: "Thứ 5" },
    { key: "Friday", label: "Thứ 6" },
    { key: "Saturday", label: "Thứ 7" },
    { key: "Sunday", label: "CN" },
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
        <Box sx={{ overflowX: 'auto', pb: 2 }}>
            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    pb: 1,
                }}
            >
                {DAYS.map((day) => {
                    const shifts = scheduleMap[day.key];
                    return (
                        <Box
                            key={day.key}
                            sx={{
                                flex: '1 1 0',          
                            }}
                        >
                            <Paper
                                variant="outlined"
                                sx={{
                                    height: '100%',
                                    minHeight: 500,
                                    bgcolor: '#f8fafc',
                                    borderColor: shifts.length > 0 ? '#bbdefb' : '#eee'
                                }}
                            >
                                <Box p={1.5} textAlign="center" borderBottom="1px solid #eee" bgcolor="white">
                                    <Typography variant="subtitle2" fontWeight="bold" textTransform="uppercase" color="primary">
                                        {day.label}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {shifts.length} ca trực
                                    </Typography>
                                </Box>

                                <Stack spacing={1} p={1} sx={{ maxHeight: 600, overflowY: 'auto' }}>
                                    {shifts.map((item, index) => (
                                        <Tooltip
                                            key={index}
                                            title={`${item.doctor.fullName} (${item.doctor.specCode || 'BS'})`}
                                            placement="top"
                                            arrow
                                        >
                                            <Paper
                                                elevation={0}
                                                sx={{
                                                    p: 1,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                    borderRadius: 2,
                                                    border: '1px solid #e0e0e0',
                                                    bgcolor: 'white',
                                                    cursor: 'pointer',
                                                    '&:hover': { borderColor: '#2196f3', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }
                                                }}
                                            >
                                                <Avatar
                                                    src={getImageUrl(item.doctor.avatarUrl)}
                                                    sx={{ width: 32, height: 32, border: '1px solid #eee' }}
                                                />

                                                <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                                        <Chip
                                                            label={`${item.slot.start}-${item.slot.end}`}
                                                            size="small"
                                                            color="primary"
                                                            variant="outlined"
                                                            sx={{ height: 20, fontSize: '0.65rem', borderRadius: 1 }}
                                                        />
                                                    </Box>
                                                    <Typography variant="caption" fontWeight="bold" noWrap display="block" mt={0.5}>
                                                        {item.doctor.fullName}
                                                    </Typography>
                                                </Box>
                                            </Paper>
                                        </Tooltip>
                                    ))}

                                    {shifts.length === 0 && (
                                        <Box textAlign="center" py={4} opacity={0.4}>
                                            <Typography variant="caption" display="block">Trống lịch</Typography>
                                        </Box>
                                    )}
                                </Stack>
                            </Paper>
                        </Box>
                    );
                })}

            </Box>
        </Box>
    );
};

export default VisualSchedule;