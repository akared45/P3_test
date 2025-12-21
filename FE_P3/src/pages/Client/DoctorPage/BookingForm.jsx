import React, { useState } from "react";
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
} from "@mui/material";
import { AccessTime, EventNote } from "@mui/icons-material";
import { format } from "date-fns";
import { fromZonedTime } from "date-fns-tz";
import { appointmentApi } from "../../../services/api";
import { useTranslation } from "react-i18next";

const DAYS_CONFIG = {
  Sunday: { index: 0, key: "sunday" },
  Monday: { index: 1, key: "monday" },
  Tuesday: { index: 2, key: "tuesday" },
  Wednesday: { index: 3, key: "wednesday" },
  Thursday: { index: 4, key: "thursday" },
  Friday: { index: 5, key: "friday" },
  Saturday: { index: 6, key: "saturday" },
};

const BookingForm = ({ doctor, onSubmit, onCancel, loading }) => {
  const { t } = useTranslation("doctorcard");

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

    if (daysToAdd < 0) {
      daysToAdd += 7;
    }

    date.setDate(date.getDate() + daysToAdd);
    return date.toISOString().split("T")[0];
  };
  const isSlotBusy = (slotIsoTime) => {
    if (!busySlots?.length) return false;
    const slotTime = new Date(slotIsoTime).getTime();
    return busySlots.some(
      (busy) => new Date(busy.startTime).getTime() === slotTime
    );
  };

  const handleSelectSchedule = async (index, schedule) => {
    setSelectedScheduleIndex(index);
    setSelectedSlot(null);
    setBusySlots([]);

    const date = new Date();
    const currentDayIndex = date.getDay();
    const targetDayIndex = DAYS_CONFIG[schedule.day]?.index;
    let daysToAdd = targetDayIndex - currentDayIndex;

    if (daysToAdd < 0) daysToAdd += 7;

    if (daysToAdd === 0) {
      const [endH, endM] = schedule.end.split(":").map(Number);
      const nowH = date.getHours();
      const nowM = date.getMinutes();

      if (nowH > endH || (nowH === endH && nowM >= endM)) {
        daysToAdd = 7;
      }
    }

    const nextDateStr = new Date(date.setDate(date.getDate() + daysToAdd))
      .toISOString()
      .split("T")[0];

    setCheckingSlots(true);
    try {
      const res = await appointmentApi.getBusySlots(
        doctor.id || doctor._id,
        nextDateStr
      );
      setBusySlots(res.data?.data || res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setCheckingSlots(false);
    }

    const doctorTimeZone = doctor.timeZone || "Asia/Ho_Chi_Minh";
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
      const dateTimeString = `${nextDateStr} ${timeStr}`;
      const dateObj = fromZonedTime(dateTimeString, doctorTimeZone);

      if (dateObj.getTime() > new Date().getTime()) {
        slots.push({
          display: format(dateObj, "HH:mm"),
          iso: dateObj.toISOString(),
        });
      }
      currentTotalMins += 30;
    }
    setGeneratedSlots(slots);
  };

  const handleSubmit = () => {
    if (!selectedSlot || !symptoms) return;
    onSubmit({
      appointmentDate: selectedSlot.iso,
      symptoms,
    });
  };

  return (
    <>
      <Box mb={3}>
        <Typography variant="subtitle2" fontWeight={600}>
          <EventNote fontSize="small" /> {t("step1")}
        </Typography>

        <Grid container spacing={1.5}>
          {doctor?.schedules?.map((schedule, index) => {
            const isSelected = selectedScheduleIndex === index;
            const dayKey = DAYS_CONFIG[schedule.day]?.key;

            return (
              <Grid item xs={6} sm={4} key={index}>
                <Button
                  fullWidth
                  variant={isSelected ? "contained" : "outlined"}
                  onClick={() => handleSelectSchedule(index, schedule)}
                  sx={{ flexDirection: "column", py: 1.5 }}
                >
                  <Typography fontWeight={700}>
                    {dayKey ? t(dayKey) : schedule.day}
                  </Typography>
                  <Typography variant="caption">
                    {schedule.start} - {schedule.end}
                  </Typography>
                </Button>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      <Divider />

      {selectedScheduleIndex !== null && (
        <Box mt={2}>
          <Typography variant="subtitle2" fontWeight={600}>
            <AccessTime fontSize="small" /> {t("step2")}
          </Typography>

          <Alert severity="info">{t("slotInfo")}</Alert>

          {checkingSlots ? (
            <Box display="flex" justifyContent="center">
              <CircularProgress size={24} />
              <Typography ml={1}>{t("checking")}</Typography>
            </Box>
          ) : (
            <Grid container spacing={1.5}>
              {generatedSlots.map((slot, idx) => (
                <Grid item xs={3} key={idx}>
                  <Button
                    fullWidth
                    disabled={isSlotBusy(slot.iso)}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    {slot.display}
                  </Button>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {selectedSlot && (
        <Box mt={2}>
          <Typography fontWeight={600}>{t("step3")}</Typography>
          <TextField
            fullWidth
            multiline
            rows={2}
            placeholder={t("placeholderSymptoms")}
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
          />
        </Box>
      )}

      <DialogActions>
        <Button onClick={onCancel}>{t("cancelButton")}</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !selectedSlot || !symptoms}
        >
          {loading ? t("checking") : t("confirmButton")}
        </Button>
      </DialogActions>
    </>
  );
};

export default BookingForm;
