import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  alpha,
} from "@mui/material";
import {
  AttachMoney,
  CalendarToday,
  People,
  MedicalServices,
} from "@mui/icons-material";
import { statisticsApi } from "../../../services/api";

import StatCard from "./StatCard";
import RevenueChart from "./RevenueChart";
import StatusChart from "./StatusChart";
import DoctorsChart from "./DoctorsChart";
import { STAT_CARD_COLORS } from "./colors";
import { formatCurrency } from "./formatters";
import { useTranslation } from "react-i18next";

const AdminDashboard = () => {
  const { t } = useTranslation("admin_dashboard");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [range, setRange] = useState("30");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - parseInt(range));

        const res = await statisticsApi.getDashboardStats({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        });

        setData(res.data.data || res.data);
      } catch (error) {
        console.error("Lỗi tải thống kê:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [range]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!data) {
    return (
      <Paper sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
        <Typography color="text.secondary">{t("header.no_data")}</Typography>
      </Paper>
    );
  }

  const statusData = [
    {
      name: t("status_chart.statuses.pending"),
      value: data.charts.statusDistribution.pending || 0,
      color: "#f59e0b",
    },
    {
      name: t("status_chart.statuses.confirmed"),
      value: data.charts.statusDistribution.confirmed || 0,
      color: "#3b82f6",
    },
    {
      name: t("status_chart.statuses.done"),
      value: data.charts.statusDistribution.done || 0,
      color: "#10b981",
    },
    {
      name: t("status_chart.statuses.cancelled"),
      value: data.charts.statusDistribution.cancelled || 0,
      color: "#ef4444",
    },
  ].filter((item) => item.value > 0);

  return (
    <Box p={3}>
      {/* HEADER */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {t("header.title")}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t("header.subtitle")}
          </Typography>
        </Box>

        <FormControl
          size="small"
          sx={{
            width: 200,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              bgcolor: "background.paper",
            },
          }}
        >
          <InputLabel>{t("header.select_range")}</InputLabel>
          <Select
            value={range}
            label={t("header.select_range")}
            onChange={(e) => setRange(e.target.value)}
          >
            <MenuItem value="7">{t("header.ranges.7")}</MenuItem>
            <MenuItem value="30">{t("header.ranges.30")}</MenuItem>
            <MenuItem value="90">{t("header.ranges.90")}</MenuItem>
            <MenuItem value="365">{t("header.ranges.365")}</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          mb: 4,
        }}
      >
        <Box sx={{ flex: "1 1 calc(25% - 24px)", minWidth: 250 }}>
          <StatCard
            title={t("stat_cards.total_revenue")}
            value={formatCurrency(data.summary.totalRevenue)}
            icon={<AttachMoney />}
            color={STAT_CARD_COLORS.revenue}
            trend="up"
            trendValue={12.5}
          />
        </Box>
        <Box sx={{ flex: "1 1 calc(25% - 24px)", minWidth: 250 }}>
          <StatCard
            title={t("stat_cards.total_appointments")}
            value={data.summary.totalAppointments}
            icon={<CalendarToday />}
            color={STAT_CARD_COLORS.appointments}
            trend="up"
            trendValue={8.2}
          />
        </Box>
        <Box sx={{ flex: "1 1 calc(25% - 24px)", minWidth: 250 }}>
          <StatCard
            title={t("stat_cards.new_patients")}
            value={data.summary.totalPatients}
            icon={<People />}
            color={STAT_CARD_COLORS.patients}
            trend="up"
            trendValue={15.3}
          />
        </Box>
        <Box sx={{ flex: "1 1 calc(25% - 24px)", minWidth: 250 }}>
          <StatCard
            title={t("stat_cards.active_doctors")}
            value={data.summary.totalDoctors}
            icon={<MedicalServices />}
            color={STAT_CARD_COLORS.doctors}
            trend="up"
            trendValue={5.7}
          />
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <RevenueChart data={data.charts.revenueOverTime} range={range} />
        </Grid>

        <Grid item xs={12} lg={4}>
          <StatusChart statusData={statusData} />
        </Grid>

        <Grid item xs={12} lg={2}>
          <DoctorsChart data={data.charts.topDoctors} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
