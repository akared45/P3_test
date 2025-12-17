import React from "react";
import { Box, Paper, Typography, Grid } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useTranslation } from "react-i18next";

const CHART_COLORS = {
  pending: "#f59e0b",
  confirmed: "#3b82f6",
  done: "#10b981",
  cancelled: "#ef4444",
};

const StatusChart = ({ statusData }) => {
  const { t } = useTranslation("admin_dashboard");
  const totalAppointments = statusData.reduce(
    (sum, item) => sum + item.value,
    0
  );

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
      <Typography variant="h6" fontWeight="bold" mb={2}>
        {t("status_chart.title")}
      </Typography>

      <Box flex={1} position="relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="45%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(1)}%`
              }
              labelLine={false}
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [value, t("status_chart.quantity")]}
              contentStyle={{ borderRadius: 8 }}
            />
          </PieChart>
        </ResponsiveContainer>

        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            {totalAppointments}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t("status_chart.total")}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={1} mt={2}>
        {statusData.map((item, index) => (
          <Grid item xs={6} key={index}>
            <Box display="flex" alignItems="center" gap={1}>
              <Box
                width={12}
                height={12}
                borderRadius="2px"
                bgcolor={item.color}
              />
              <Typography variant="body2" fontWeight="medium">
                {item.name}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ ml: "auto" }}
              >
                {item.value}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default StatusChart;
