import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Tooltip,
  Chip,
  Stack,
  Grid,
} from "@mui/material";
import { getImageUrl } from "@utils/imageHelper";

const VisualSchedule = ({ doctors }) => {
  const { t } = useTranslation("admin_schedule");

  const DAYS = useMemo(
    () => [
      { key: "Monday", label: t("days.Monday") },
      { key: "Tuesday", label: t("days.Tuesday") },
      { key: "Wednesday", label: t("days.Wednesday") },
      { key: "Thursday", label: t("days.Thursday") },
      { key: "Friday", label: t("days.Friday") },
      { key: "Saturday", label: t("days.Saturday") },
    ],
    [t]
  );

  const scheduleMap = useMemo(() => {
    const map = {};
    DAYS.forEach((d) => (map[d.key] = []));
    doctors.forEach((doc) => {
      doc.schedules?.forEach((slot) => {
        if (map[slot.day]) map[slot.day].push({ doctor: doc, slot });
      });
    });
    return map;
  }, [doctors, DAYS]);

  return (
    <Box sx={{ width: "100%" }}>
      <Grid container spacing={2}>
        {DAYS.map((day) => (
          <Grid item xs={12} md={4} key={day.key} sx={{ display: "flex" }}>
            <Paper variant="outlined" sx={{ flex: 1, bgcolor: "#f8fafc" }}>
              <Box
                p={2}
                textAlign="center"
                borderBottom="1px solid #e0e0e0"
                bgcolor="white"
              >
                <Typography variant="h6" fontWeight="bold" color="primary">
                  {day.label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t("visual.shifts_count", {
                    count: scheduleMap[day.key].length,
                  })}
                </Typography>
              </Box>
              <Box p={2}>
                <Stack spacing={1.5}>
                  {scheduleMap[day.key].map((item, index) => (
                    <Tooltip
                      key={index}
                      title={`${item.doctor.fullName} (${item.slot.start}-${item.slot.end})`}
                    >
                      <Box
                        sx={{
                          p: 1.5,
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          bgcolor: "white",
                          border: "1px solid #e0e0e0",
                          borderRadius: 1,
                        }}
                      >
                        <Avatar
                          src={getImageUrl(item.doctor.avatarUrl)}
                          sx={{ width: 36, height: 36 }}
                        />
                        <Box>
                          <Chip
                            label={`${item.slot.start}-${item.slot.end}`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                          <Typography variant="body2" fontWeight="bold">
                            {item.doctor.fullName}
                          </Typography>
                        </Box>
                      </Box>
                    </Tooltip>
                  ))}
                  {scheduleMap[day.key].length === 0 && (
                    <Typography align="center" sx={{ opacity: 0.5 }}>
                      {t("visual.no_shifts")}
                    </Typography>
                  )}
                </Stack>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
export default VisualSchedule;
