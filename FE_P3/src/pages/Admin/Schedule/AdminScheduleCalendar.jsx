import React, { useState, useEffect } from "react";
import {
  Box, Grid, Paper, Typography, IconButton, Button
} from "@mui/material";
import { ChevronLeft, ChevronRight, FiberManualRecord } from "@mui/icons-material";
import { Divider } from '@mui/material';
const STATUS_COLORS = {
  AVAILABLE: "#00c853",
  FEW: "#29b6f6",
  FULL: "#f44336",
  OFF: "#bdbdbd"
};

const LegendItem = ({ color, label, code }) => (
  <Box display="flex" alignItems="center" gap={1} mb={1}>
    {code ? (
      <Box
        sx={{
          width: 32, height: 32, borderRadius: "50%",
          bgcolor: "#e3f2fd", color: "#0288d1",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.75rem", fontWeight: "bold"
        }}
      >
        {code}
      </Box>
    ) : (
      <FiberManualRecord sx={{ color: color }} />
    )}
    <Typography variant="body2" color="text.secondary">{label}</Typography>
  </Box>
);

const AdminScheduleCalendar = ({ doctor }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState([]);

  useEffect(() => {
    generateCalendarData(currentDate);
  }, [currentDate, doctor]);

  const generateCalendarData = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDayOfWeek = firstDay.getDay();
    const offset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
    const days = [];

    for (let i = 0; i < offset; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const currentDayDate = new Date(year, month, i);
      const dayNameMap = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const dayName = dayNameMap[currentDayDate.getDay()];
      const schedule = doctor?.schedules?.find(s => s.day === dayName);
      let stats = { type: 'OFF', ta: 0, se: 0 };

      if (schedule) {
        const totalSlots = 20;
        const booked = Math.floor(Math.random() * 20);
        const empty = totalSlots - booked;

        stats = {
          type: empty === 0 ? 'FULL' : empty < 5 ? 'FEW' : 'AVAILABLE',
          ta: booked,
          se: empty,
          workingTime: `${schedule.start} - ${schedule.end}`
        };
      }

      days.push({ day: i, ...stats });
    }

    setCalendarData(days);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const WEEKDAYS = [
    "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"
  ];

  return (
    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
      <Paper elevation={3} sx={{ flex: 1, minWidth: '700px', borderRadius: 4, overflow: 'hidden' }}>
        <Box sx={{ p: 2, bgcolor: '#e3f2fd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight="bold" color="#1565c0">
            Lịch Đặt Hẹn - Tháng {currentDate.getMonth() + 1}/{currentDate.getFullYear()}
          </Typography>
          <Box>
            <IconButton onClick={handlePrevMonth}><ChevronLeft /></IconButton>
            <Button size="small" variant="outlined" onClick={() => setCurrentDate(new Date())}>Hôm nay</Button>
            <IconButton onClick={handleNextMonth}><ChevronRight /></IconButton>
          </Box>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid #ddd' }}>
          {WEEKDAYS.map((day, index) => (
            <Box key={index} sx={{
              p: 1.5, textAlign: 'center', borderRight: '1px solid #eee', bgcolor: '#f5f5f5',
              borderBottom: '1px solid #ddd'
            }}>
              <Typography variant="subtitle2" fontWeight="bold">{day}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.7rem' }}>
                (08:00 - 17:00)
              </Typography>
            </Box>
          ))}
          {calendarData.map((item, index) => (
            <Box
              key={index}
              sx={{
                height: 100,
                borderRight: '1px solid #eee',
                borderBottom: '1px solid #eee',
                p: 1,
                position: 'relative',
                bgcolor: item ? 'white' : '#fafafa',
                cursor: item && item.type !== 'OFF' ? 'pointer' : 'default',
                '&:hover': { bgcolor: item && item.type !== 'OFF' ? '#f0f9ff' : '#fafafa' }
              }}
            >
              {item && (
                <>
                  <Typography fontWeight="bold" color="text.secondary">{item.day}</Typography>
                  {item.type !== 'OFF' ? (
                    <Box mt={1}>
                      <Typography variant="caption" display="block" sx={{ fontWeight: 600 }}>
                        TA - {item.ta}
                      </Typography>
                      <Typography variant="caption" display="block" color="text.secondary">
                        SE - {item.se}
                      </Typography>

                      <Box
                        sx={{
                          width: 12, height: 12, borderRadius: '50%',
                          bgcolor: STATUS_COLORS[item.type],
                          position: 'absolute', bottom: 8, right: 8
                        }}
                      />
                    </Box>
                  ) : (
                    <Typography variant="caption" sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#ccc' }}>
                      Nghỉ
                    </Typography>
                  )}
                </>
              )}
            </Box>
          ))}
        </Box>
      </Paper>
      <Paper elevation={0} sx={{ width: 250, p: 3, height: 'fit-content', border: '1px solid #eee', borderRadius: 4 }}>
        <Typography variant="subtitle1" fontWeight="bold" mb={2}>Chú giải</Typography>

        <LegendItem code="TA" label="Tổng cuộc hẹn (Total Appt)" />
        <LegendItem code="SE" label="Số chỗ trống (Slot Empty)" />
        <LegendItem code="NA" label="Không làm việc" />

        <Divider sx={{ my: 2 }} />

        <LegendItem color={STATUS_COLORS.FULL} label="Hết chỗ (Full)" />
        <LegendItem color={STATUS_COLORS.FEW} label="Sắp hết (Few slots)" />
        <LegendItem color={STATUS_COLORS.AVAILABLE} label="Còn chỗ (Available)" />

        <Box mt={4}>
          <Button variant="contained" fullWidth>
            Xuất báo cáo tháng
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminScheduleCalendar;