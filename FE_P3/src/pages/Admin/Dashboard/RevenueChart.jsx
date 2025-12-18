import React from "react";
import { Box, Paper, Typography, Chip, alpha } from "@mui/material";
import {
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import dayjs from "dayjs";
import CustomTooltip from "./CustomTooltip";
import { useTranslation } from "react-i18next";

const CHART_COLORS = {
  revenue: "#6366f1",
  appointments: "#10b981",
};

const RevenueChart = ({ data, range }) => {
  const { t } = useTranslation("admin_dashboard");

  const formatCurrency = (val) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        height: 420,
        display: "flex",
        flexDirection: "column",
        boxShadow: 1,
      }}
    >
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box>
          <Typography variant="h6" fontWeight="bold">
            {t("revenue_chart.title")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("revenue_chart.subtitle")}
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Chip
            label={t("revenue_chart.revenue")}
            size="small"
            icon={
              <Box
                width={10}
                height={10}
                borderRadius="50%"
                bgcolor={CHART_COLORS.revenue}
              />
            }
            sx={{ pl: 1 }}
          />
          <Chip
            label={t("revenue_chart.appointments")}
            size="small"
            icon={
              <Box
                width={10}
                height={10}
                borderRadius="50%"
                bgcolor={CHART_COLORS.appointments}
              />
            }
            sx={{ pl: 1 }}
          />
        </Box>
      </Box>

      {/* Chart */}
      <Box flex={1}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={alpha("#000", 0.1)}
            />
            <XAxis
              dataKey="date"
              tickFormatter={(str) => dayjs(str).format("DD/MM")}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="left"
              tickFormatter={(value) => value.toLocaleString()}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: 20 }} />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="revenue"
              fill={alpha(CHART_COLORS.revenue, 0.1)}
              stroke={CHART_COLORS.revenue}
              strokeWidth={2}
              name={t("revenue_chart.revenue")}
            />
            <Bar
              yAxisId="right"
              dataKey="count"
              fill={alpha(CHART_COLORS.appointments, 0.8)}
              name={t("revenue_chart.appointments")}
              radius={[4, 4, 0, 0]}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default RevenueChart;
