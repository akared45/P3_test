import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  Divider,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  FiberManualRecord,
} from "@mui/icons-material";

const STATUS_COLORS = {
  AVAILABLE: "#00c853",
  FEW: "#29b6f6",
  FULL: "#f44336",
  OFF: "#bdbdbd",
};

const AdminScheduleCalendar = ({ doctor }) => {
  const { t } = useTranslation("admin_schedule");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState([]);

  const WEEKDAYS = [
    t("days.Monday"),
    t("days.Tuesday"),
    t("days.Wednesday"),
    t("days.Thursday"),
    t("days.Friday"),
    t("days.Saturday"),
    t("days.Sunday"),
  ];

  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    const days = Array(offset).fill(null);

    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i);
      const dayName = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ][dayDate.getDay()];
      const schedule = doctor?.schedules?.find((s) => s.day === dayName);
      days.push({
        day: i,
        type: schedule ? "AVAILABLE" : "OFF",
        ta: 0,
        se: 20,
      });
    }
    setCalendarData(days);
  }, [currentDate, doctor]);

  return (
    <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
      <Paper elevation={3} sx={{ flex: 1, minWidth: "700px" }}>
        <Box
          p={2}
          bgcolor="#e3f2fd"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" fontWeight="bold">
            {t("calendar.appointment_schedule")} - {t("calendar.month")}{" "}
            {currentDate.getMonth() + 1}/{currentDate.getFullYear()}
          </Typography>
          <Box>
            <IconButton
              onClick={() =>
                setCurrentDate(
                  new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth() - 1,
                    1
                  )
                )
              }
            >
              <ChevronLeft />
            </IconButton>
            <Button onClick={() => setCurrentDate(new Date())}>
              {t("actions.today")}
            </Button>
            <IconButton
              onClick={() =>
                setCurrentDate(
                  new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth() + 1,
                    1
                  )
                )
              }
            >
              <ChevronRight />
            </IconButton>
          </Box>
        </Box>
        <Box display="grid" sx={{ gridTemplateColumns: "repeat(7, 1fr)" }}>
          {WEEKDAYS.map((d, i) => (
            <Box key={i} p={1.5} textAlign="center" bgcolor="#f5f5f5">
              <Typography fontWeight="bold">{d}</Typography>
            </Box>
          ))}
          {calendarData.map((item, i) => (
            <Box
              key={i}
              sx={{
                height: 100,
                border: "1px solid #eee",
                p: 1,
                position: "relative",
                bgcolor: item ? "white" : "#fafafa",
              }}
            >
              {item && (
                <>
                  <Typography fontWeight="bold">{item.day}</Typography>
                  {item.type !== "OFF" ? (
                    <Box>
                      <Typography variant="caption" display="block">
                        TA - {item.ta}
                      </Typography>
                      <Typography variant="caption" display="block">
                        SE - {item.se}
                      </Typography>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          bgcolor: STATUS_COLORS[item.type],
                          position: "absolute",
                          bottom: 8,
                          right: 8,
                        }}
                      />
                    </Box>
                  ) : (
                    <Typography
                      variant="caption"
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        color: "#ccc",
                      }}
                    >
                      {t("calendar.off_duty")}
                    </Typography>
                  )}
                </>
              )}
            </Box>
          ))}
        </Box>
      </Paper>
      <Paper sx={{ width: 250, p: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" mb={2}>
          {t("calendar.legend")}
        </Typography>
        <Typography variant="body2">
          <strong>TA:</strong> {t("calendar.total_appt")}
        </Typography>
        <Typography variant="body2">
          <strong>SE:</strong> {t("calendar.slot_empty")}
        </Typography>
        <Typography variant="body2">
          <strong>NA:</strong> {t("calendar.not_available")}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <FiberManualRecord sx={{ color: STATUS_COLORS.FULL }} />{" "}
          {t("calendar.status.full")}
        </Box>
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <FiberManualRecord sx={{ color: STATUS_COLORS.FEW }} />{" "}
          {t("calendar.status.few_slots")}
        </Box>
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <FiberManualRecord sx={{ color: STATUS_COLORS.AVAILABLE }} />{" "}
          {t("calendar.status.available")}
        </Box>
        <Button variant="contained" fullWidth sx={{ mt: 4 }}>
          {t("actions.export_report")}
        </Button>
      </Paper>
    </Box>
  );
};
export default AdminScheduleCalendar;
