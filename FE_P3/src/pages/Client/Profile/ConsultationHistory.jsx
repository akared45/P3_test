import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Button,
} from "@mui/material";
import { CalendarMonth, AccessTime, Person } from "@mui/icons-material";
import dayjs from "dayjs";
import { appointmentApi } from "../../../services/api";
import { useTranslation } from "react-i18next";

const ConsultationHistory = () => {
  const { t } = useTranslation("profile_client");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await appointmentApi.getMyAppointments();
        const sorted = (res.data.data || res.data).sort(
          (a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate)
        );
        setAppointments(sorted);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "success";
      case "confirmed":
        return "primary";
      case "pending":
        return "warning";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return t("consultationHistory.statusLabel.completed");
      case "confirmed":
        return t("consultationHistory.statusLabel.confirmed");
      case "pending":
        return t("consultationHistory.statusLabel.pending");
      case "cancelled":
        return t("consultationHistory.statusLabel.cancelled");
      default:
        return status;
    }
  };

  if (loading)
    return (
      <Box p={3} textAlign="center">
        <CircularProgress />
      </Box>
    );

  return (
    <Box>
      <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
        {t("consultationHistory.title")}
      </Typography>

      {appointments.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center", bgcolor: "#f5f5f5" }}>
          <Typography color="text.secondary">
            {t("consultationHistory.empty")}
          </Typography>
        </Paper>
      ) : (
        <TableContainer
          component={Paper}
          elevation={2}
          sx={{ borderRadius: 2 }}
        >
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: "#f0f7ff" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>
                  {t("consultationHistory.table.time")}
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  {t("consultationHistory.table.doctor")}
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  {t("consultationHistory.table.type")}
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  {t("consultationHistory.table.status")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <CalendarMonth fontSize="small" color="action" />
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {dayjs(row.appointmentDate).format("DD/MM/YYYY")}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <AccessTime
                            sx={{ fontSize: 12, color: "text.secondary" }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {dayjs(row.startTime).format("HH:mm")} -{" "}
                            {dayjs(row.endTime).format("HH:mm")}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Person fontSize="small" color="action" />
                      <Typography variant="body2">
                        {row.doctorName || row.doctor?.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        row.type === "chat"
                          ? t("consultationHistory.typeLabel.online")
                          : t("consultationHistory.typeLabel.offline")
                      }
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(row.status)}
                      color={getStatusColor(row.status)}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ConsultationHistory;
