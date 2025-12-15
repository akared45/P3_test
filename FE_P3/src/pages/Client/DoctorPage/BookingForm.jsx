import React, { useState } from "react";
import {
  Box, Typography, Grid, Button, Divider, CircularProgress, TextField,
  DialogActions, Alert
} from "@mui/material";
import { AccessTime, EventNote } from "@mui/icons-material";
import { format } from 'date-fns';
import { fromZonedTime } from 'date-fns-tz';
import { appointmentApi } from "../../../services/api";

const DAYS_CONFIG = {
  "Sunday": { label: "Chủ Nhật", index: 0 },
  "Monday": { label: "Thứ 2", index: 1 },
  "Tuesday": { label: "Thứ 3", index: 2 },
  "Wednesday": { label: "Thứ 4", index: 3 },
  "Thursday": { label: "Thứ 5", index: 4 },
  "Friday": { label: "Thứ 6", index: 5 },
  "Saturday": { label: "Thứ 7", index: 6 },
};

const BookingForm = ({ doctor, onSubmit, onCancel, loading }) => {
  const [selectedScheduleIndex, setSelectedScheduleIndex] = useState(null);
  const [generatedSlots, setGeneratedSlots] = useState([]);
  const [busySlots, setBusySlots] = useState([]);
  const [checkingSlots, setCheckingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [symptoms, setSymptoms] = useState("");

  const getNextDate = (dayName) => {
    const targetIndex = DAYS_CONFIG[dayName]?.index;
    if (targetIndex === undefined) return null;
    const date = new Date();
    const currentDayIndex = date.getDay();
    let daysToAdd = targetIndex - currentDayIndex;
    if (daysToAdd <= 0) daysToAdd += 7;
    date.setDate(date.getDate() + daysToAdd);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const isSlotBusy = (slotIsoTime) => {
    if (!busySlots || busySlots.length === 0) return false;
    const slotTime = new Date(slotIsoTime).getTime();
    return busySlots.some(busy => new Date(busy.startTime).getTime() === slotTime);
  };

  const handleSelectSchedule = async (index, schedule) => {
    setSelectedScheduleIndex(index);
    setSelectedSlot(null);
    setBusySlots([]);
    const nextDateStr = getNextDate(schedule.day);
    setCheckingSlots(true);

    try {
      const res = await appointmentApi.getBusySlots(doctor.id || doctor._id, nextDateStr);
      setBusySlots(res.data?.data || res.data || []);
    } catch (error) {
      console.error("Failed to fetch busy slots", error);
    } finally {
      setCheckingSlots(false);
    }

    const doctorTimeZone = doctor.timeZone || 'Asia/Ho_Chi_Minh';
    const slots = [];
    const [startH, startM] = schedule.start.split(":").map(Number);
    const [endH, endM] = schedule.end.split(":").map(Number);
    let currentTotalMins = startH * 60 + startM;
    const endTotalMins = endH * 60 + endM;

    while (currentTotalMins < endTotalMins) {
      const h = Math.floor(currentTotalMins / 60);
      const m = currentTotalMins % 60;
      const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
      const dateTimeString = `${nextDateStr} ${timeStr}`;
      const dateObj = fromZonedTime(dateTimeString, doctorTimeZone);
      
      slots.push({
        display: format(dateObj, 'HH:mm'),
        iso: dateObj.toISOString()
      });
      currentTotalMins += 30;
    }
    setGeneratedSlots(slots);
  };

  const handleSubmit = () => {
    if (!selectedSlot || !symptoms) return;
    onSubmit({ 
        appointmentDate: selectedSlot.iso, 
        symptoms 
    });
  };

  return (
    <>
      <Box mb={3} mt={1}>
        <Typography variant="subtitle2" gutterBottom fontWeight={600} sx={{ display: 'flex', gap: 1 }}>
          <EventNote fontSize="small" color="action" /> 1. Chọn buổi khám
        </Typography>
        <Grid container spacing={1.5}>
          {doctor?.schedules?.map((schedule, index) => {
            const isSelected = selectedScheduleIndex === index;
            const label = DAYS_CONFIG[schedule.day]?.label || schedule.day;
            return (
              <Grid item xs={6} sm={4} key={index}>
                <Button
                  variant={isSelected ? "contained" : "outlined"}
                  fullWidth
                  onClick={() => handleSelectSchedule(index, schedule)}
                  sx={{
                    borderRadius: 2, py: 1.5, flexDirection: 'column',
                    borderColor: isSelected ? '' : '#e0e0e0',
                    color: isSelected ? '#fff' : '#333',
                    bgcolor: isSelected ? '' : '#fff'
                  }}
                >
                  <Typography variant="body2" fontWeight={700}>{label}</Typography>
                  <Typography variant="caption" color={isSelected ? 'inherit' : 'text.secondary'}>
                    {schedule.start} - {schedule.end}
                  </Typography>
                </Button>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      <Divider sx={{ my: 2 }} />

      {selectedScheduleIndex !== null && (
        <Box mb={3} className="fade-in">
          <Typography variant="subtitle2" gutterBottom fontWeight={600} sx={{ display: 'flex', gap: 1 }}>
            <AccessTime fontSize="small" color="action" /> 2. Chọn giờ khám
          </Typography>
          
          <Alert severity="info" sx={{ mb: 2, py: 0 }}>Giờ đã được chuyển sang múi giờ của bạn.</Alert>

          {checkingSlots ? (
            <Box display="flex" justifyContent="center" p={2}>
              <CircularProgress size={24} /> <Typography ml={1}>Đang kiểm tra...</Typography>
            </Box>
          ) : (
            <Grid container spacing={1.5}>
              {generatedSlots.map((slot, idx) => {
                const isSelected = selectedSlot?.iso === slot.iso;
                const isBusy = isSlotBusy(slot.iso);
                return (
                  <Grid item xs={3} key={idx}>
                    <Button
                      variant={isSelected ? "contained" : "outlined"}
                      disabled={isBusy}
                      color={isBusy ? "inherit" : "success"}
                      fullWidth
                      onClick={() => setSelectedSlot(slot)}
                      sx={{
                        borderRadius: 2,
                        color: isSelected ? '#fff' : (isBusy ? '#9e9e9e' : '#2e7d32'),
                        borderColor: isSelected ? '' : (isBusy ? '#e0e0e0' : '#a5d6a7'),
                        bgcolor: isBusy ? '#f5f5f5' : ''
                      }}
                    >
                      {slot.display}
                    </Button>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>
      )}

      {selectedSlot && (
        <Box className="fade-in">
          <Typography variant="subtitle2" gutterBottom fontWeight={600}>3. Mô tả triệu chứng *</Typography>
          <TextField
            multiline rows={2} fullWidth
            placeholder="Ví dụ: Đau đầu, sốt cao..."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
          />
        </Box>
      )}

      <DialogActions sx={{ p: 2, borderTop: '1px solid #eee', mx: -3, mb: -3, mt: 3 }}>
        <Button onClick={onCancel} color="inherit">Hủy bỏ</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !selectedSlot || !symptoms}
        >
          {loading ? "Đang xử lý..." : "Xác nhận đặt lịch"}
        </Button>
      </DialogActions>
    </>
  );
};

export default BookingForm;