import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Alert } from "@mui/material";
import { LockClock, AccessTime, CheckCircle } from "@mui/icons-material";
import { formatDistanceStrict } from "date-fns";
import { vi } from "date-fns/locale";
import { useTranslation } from "react-i18next";

const ChatAccessControl = ({ appointment }) => {
  const { t } = useTranslation("patient_chat");
  const [status, setStatus] = useState("checking");
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!appointment) return;

    const checkTime = () => {
      const now = new Date().getTime();
      const start = new Date(appointment.startTime).getTime();
      const end = new Date(appointment.endTime).getTime();
      const BUFFER_TIME = 10 * 60 * 1000;
      const openTime = start - BUFFER_TIME;
      const closeTime = end + 30 * 60 * 1000;

      if (now < openTime) {
        setStatus("early");
        setTimeLeft(
          formatDistanceStrict(openTime, now, { locale: vi, addSuffix: true })
        );
      } else if (now > closeTime) {
        setStatus("expired");
      } else {
        setStatus("active");
      }
    };

    checkTime();
    const timer = setInterval(checkTime, 1000);
    return () => clearInterval(timer);
  }, [appointment]);

  if (status === "early") {
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f5f5f5",
          p: 2,
        }}
      >
        <Paper
          elevation={3}
          sx={{ p: 4, textAlign: "center", maxWidth: 400, borderRadius: 2 }}
        >
          <LockClock sx={{ fontSize: 60, color: "#1976d2", mb: 2 }} />
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {t("chatAccessControl.early.title")}
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={1}>
            {t("chatAccessControl.early.subtitle")}
          </Typography>
          <Typography
            variant="h4"
            color="primary"
            fontWeight="bold"
            sx={{ mb: 2 }}
          >
            {timeLeft}
          </Typography>
          <Alert severity="info" sx={{ justifyContent: "center" }}>
            {t("chatAccessControl.early.info")}
          </Alert>
        </Paper>
      </Box>
    );
  }

  if (status === "expired") {
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f5f5f5",
          p: 2,
        }}
      >
        <Paper elevation={3} sx={{ p: 4, textAlign: "center", maxWidth: 400 }}>
          <AccessTime sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {t("chatAccessControl.expired.title")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("chatAccessControl.expired.info")}
          </Typography>
        </Paper>
      </Box>
    );
  }

  return null;
};

export default ChatAccessControl;
