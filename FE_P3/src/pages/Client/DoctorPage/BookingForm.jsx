import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Divider,
  CircularProgress,
  TextField,
  DialogActions,
  Alert,
  Chip,
  Paper,
} from "@mui/material";
import { AccessTime, EventNote, CheckCircle } from "@mui/icons-material";
import { format } from "date-fns";
import { fromZonedTime } from "date-fns-tz";
import { appointmentApi } from "../../../services/api";
import { useTranslation } from "react-i18next";

// Mapping chuẩn để so sánh ngày
const DAYS_MAP = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

const BookingForm = ({ doctor, onSubmit, onCancel, loading }) => {
  const { t } = useTranslation("doctorcard");

  // States
  const [selectedScheduleIndex, setSelectedScheduleIndex] = useState(null);
  const [generatedSlots, setGeneratedSlots] = useState([]);
  const [busySlots, setBusySlots] = useState([]);
  const [checkingSlots, setCheckingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [symptoms, setSymptoms] = useState("");

  /**
   * Tính toán ngày tiếp theo dựa trên thứ (Monday, Tuesday...)
   * Nếu là hôm nay và đã qua giờ kết thúc ca, sẽ nhảy sang tuần sau.
   */
  const getTargetDate = (dayName, endTimeStr) => {
    const targetDayIndex = DAYS_MAP[dayName];
    if (targetDayIndex === undefined) return null;

    const now = new Date();
    const currentDayIndex = now.getDay();
    let daysToAdd = targetDayIndex - currentDayIndex;

    if (daysToAdd < 0) daysToAdd += 7;

    // Xử lý nếu chọn trúng ngày hôm nay
    if (daysToAdd === 0) {
      const [endH, endM] = endTimeStr.split(":").map(Number);
      const shiftEnd = new Date(now);
      shiftEnd.setHours(endH, endM, 0, 0);

      // Nếu hiện tại đã quá giờ kết thúc ca khám hôm nay -> Nhảy sang tuần sau
      if (now > shiftEnd) {
        daysToAdd = 7;
      }
    }

    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() + daysToAdd);
    return targetDate;
  };

  /**
   * Kiểm tra xem slot có bị trùng lịch (busy) hay không
   */
  const isSlotBusy = (slotIsoTime) => {
    if (!busySlots?.length) return false;
    const targetTime = new Date(slotIsoTime).getTime();
    return busySlots.some(
      (busy) => new Date(busy.startTime).getTime() === targetTime
    );
  };

  /**
   * Xử lý khi người dùng chọn một ca khám (Thứ 2, Thứ 3...)
   */
  const handleSelectSchedule = async (index, schedule) => {
    setSelectedScheduleIndex(index);
    setSelectedSlot(null);
    setGeneratedSlots([]);
    setCheckingSlots(true);

    const doctorTimeZone = doctor.timeZone || "Asia/Ho_Chi_Minh";
    const targetDateObj = getTargetDate(schedule.day, schedule.end);
    const dateStr = format(targetDateObj, "yyyy-MM-dd");

    try {
      // 1. Gọi API lấy các slot đã bị đặt
      const res = await appointmentApi.getBusySlots(
        doctor.id || doctor._id,
        dateStr
      );
      const busyData = res.data?.data || res.data || [];
      setBusySlots(busyData);

      // 2. Tạo danh sách các slot 30 phút
      const slots = [];
      const [startH, startM] = schedule.start.split(":").map(Number);
      const [endH, endM] = schedule.end.split(":").map(Number);

      let currentTotalMins = startH * 60 + startM;
      const endTotalMins = endH * 60 + endM;

      while (currentTotalMins < endTotalMins) {
        const h = Math.floor(currentTotalMins / 60);
        const m = currentTotalMins % 60;
        const timeStr = `${h.toString().padStart(2, "0")}:${m
          .toString()
          .padStart(2, "0")}`;

        // Chuyển đổi giờ địa phương của bác sĩ sang ISO dựa trên múi giờ
        const slotDateObj = fromZonedTime(
          `${dateStr} ${timeStr}`,
          doctorTimeZone
        );

        // Chỉ thêm slot nếu nó ở tương lai so với thời điểm hiện tại
        if (slotDateObj.getTime() > new Date().getTime()) {
          slots.push({
            display: timeStr,
            iso: slotDateObj.toISOString(),
            dateObj: slotDateObj,
          });
        }
        currentTotalMins += 30;
      }
      setGeneratedSlots(slots);
    } catch (error) {
      console.error("Error fetching slots:", error);
    } finally {
      setCheckingSlots(false);
    }
  };

  const handleFinalSubmit = () => {
    if (!selectedSlot || !symptoms.trim()) return;
    onSubmit({
      appointmentDate: selectedSlot.iso,
      symptoms,
    });
  };

  return (
    <Box>
      {/* Bước 1: Chọn ca khám */}
      <Box mb={3}>
        <Typography
          variant="subtitle2"
          fontWeight={600}
          display="flex"
          alignItems="center"
          gap={1}
          mb={1.5}
        >
          <EventNote color="primary" fontSize="small" /> {t("step1")}
        </Typography>
        <Grid container spacing={1.5}>
          {doctor?.schedules?.map((schedule, index) => (
            <Grid item xs={6} sm={4} key={index}>
              <Button
                fullWidth
                variant={
                  selectedScheduleIndex === index ? "contained" : "outlined"
                }
                onClick={() => handleSelectSchedule(index, schedule)}
                sx={{ flexDirection: "column", py: 1.5, borderRadius: 2 }}
              >
                <Typography fontWeight={700} variant="body2">
                  {t(schedule.day.toLowerCase()) || schedule.day}
                </Typography>
                <Typography variant="caption">
                  {schedule.start} - {schedule.end}
                </Typography>
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider />

      {/* Bước 2: Chọn khung giờ cụ thể */}
      {selectedScheduleIndex !== null && (
        <Box mt={3}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Typography
              variant="subtitle2"
              fontWeight={600}
              display="flex"
              alignItems="center"
              gap={1}
            >
              <AccessTime color="primary" fontSize="small" /> {t("step2")}
            </Typography>
            {generatedSlots.length > 0 && (
              <Chip
                label={format(generatedSlots[0].dateObj, "dd/MM/yyyy")}
                color="primary"
                variant="outlined"
                size="small"
              />
            )}
          </Box>

          {checkingSlots ? (
            <Box textAlign="center" py={3}>
              <CircularProgress size={24} />
              <Typography variant="caption" display="block" mt={1}>
                {t("checking")}
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={1}>
              {generatedSlots.length > 0 ? (
                generatedSlots.map((slot, idx) => {
                  const isBusy = isSlotBusy(slot.iso);
                  const isSelected = selectedSlot?.iso === slot.iso;
                  return (
                    <Grid item xs={4} sm={3} md={2.4} key={idx}>
                      <Button
                        fullWidth
                        variant={isSelected ? "contained" : "outlined"}
                        disabled={isBusy}
                        onClick={() => setSelectedSlot(slot)}
                        sx={{ position: "relative", py: 1 }}
                      >
                        {slot.display}
                        {isSelected && (
                          <CheckCircle
                            sx={{
                              position: "absolute",
                              top: 2,
                              right: 2,
                              fontSize: 12,
                            }}
                          />
                        )}
                      </Button>
                      {isBusy && (
                        <Typography
                          variant="caption"
                          color="error"
                          display="block"
                          textAlign="center"
                        >
                          {t("busy")}
                        </Typography>
                      )}
                    </Grid>
                  );
                })
              ) : (
                <Grid item xs={12}>
                  <Alert severity="warning">{t("noSlotsAvailable")}</Alert>
                </Grid>
              )}
            </Grid>
          )}
        </Box>
      )}

      {/* Bước 3: Nhập triệu chứng */}
      {selectedSlot && (
        <Box mt={3}>
          <Typography variant="subtitle2" fontWeight={600} mb={1}>
            {t("step3")}
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder={t("placeholderSymptoms")}
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
          />
        </Box>
      )}

      <DialogActions sx={{ mt: 3, px: 0 }}>
        <Button onClick={onCancel} color="inherit">
          {t("cancelButton")}
        </Button>
        <Button
          variant="contained"
          onClick={handleFinalSubmit}
          disabled={loading || !selectedSlot || !symptoms.trim()}
          startIcon={loading && <CircularProgress size={16} />}
        >
          {loading ? t("processing") : t("confirmButton")}
        </Button>
      </DialogActions>
    </Box>
  );
};

export default BookingForm;
