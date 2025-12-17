import React from 'react';
import { Box, Paper, Typography, Chip, alpha } from '@mui/material';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Bar, ComposedChart, Legend
} from 'recharts';
import dayjs from 'dayjs';
import CustomTooltip from './CustomTooltip';

const CHART_COLORS = {
  revenue: '#6366f1',
  appointments: '#10b981',
};

const RevenueChart = ({ data, range }) => {
  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  return (
    <Paper 
      sx={{ 
        p: 3, 
        borderRadius: 3,
        height: 420,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 1
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h6" fontWeight="bold">
            Xu hướng Doanh thu & Đặt lịch
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Biểu đồ thể hiện doanh thu và số lượng đặt lịch theo thời gian
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Chip 
            label="Doanh thu" 
            size="small"
            icon={<Box width={10} height={10} borderRadius="50%" bgcolor={CHART_COLORS.revenue} />}
            sx={{ pl: 1 }}
          />
          <Chip 
            label="Số lịch hẹn" 
            size="small"
            icon={<Box width={10} height={10} borderRadius="50%" bgcolor={CHART_COLORS.appointments} />}
            sx={{ pl: 1 }}
          />
        </Box>
      </Box>
      
      <Box flex={1}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false}
              stroke={alpha('#000', 0.1)}
            />
            <XAxis 
              dataKey="date" 
              tickFormatter={(str) => dayjs(str).format('DD/MM')}
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
              name="Doanh thu"
            />
            <Bar 
              yAxisId="right"
              dataKey="count" 
              fill={alpha(CHART_COLORS.appointments, 0.8)} 
              name="Số lịch hẹn"
              radius={[4, 4, 0, 0]}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default RevenueChart;