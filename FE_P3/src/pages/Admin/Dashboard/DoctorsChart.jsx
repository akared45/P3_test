import React from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Avatar, 
  Stack, 
  Chip,
  alpha, 
  useTheme 
} from '@mui/material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell 
} from 'recharts';
import { TrendingUp, Star } from '@mui/icons-material';

const DoctorsChart = ({ data }) => {
  const theme = useTheme();
  
  const formatCurrency = (val) => 
    new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(val);

  const formatNumber = (val) => 
    new Intl.NumberFormat('vi-VN', {
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(val);

  // Sort data by revenue
  const sortedData = [...data].sort((a, b) => b.totalRevenue - a.totalRevenue);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const doctor = payload[0].payload;
      return (
        <Paper 
          sx={{ 
            p: 2, 
            borderRadius: 2,
            boxShadow: 3,
            bgcolor: 'background.paper',
            minWidth: 200
          }}
        >
          <Stack spacing={1}>
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32,
                  bgcolor: alpha('#6366f1', 0.1),
                  color: '#6366f1',
                  fontSize: 14
                }}
              >
                {doctor.name.charAt(0)}
              </Avatar>
              <Typography variant="subtitle2" fontWeight="bold">
                {doctor.name}
              </Typography>
            </Box>
            
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Số lịch:
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {doctor.bookingCount.toLocaleString()}
              </Typography>
            </Box>
            
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Doanh thu:
              </Typography>
              <Typography variant="body2" fontWeight="bold" color="#2e7d32">
                {formatCurrency(doctor.totalRevenue)}
              </Typography>
            </Box>
            
            {doctor.specialty && (
              <Chip 
                label={doctor.specialty} 
                size="small" 
                sx={{ 
                  mt: 1,
                  bgcolor: alpha('#1976d2', 0.1),
                  color: '#1976d2'
                }}
              />
            )}
          </Stack>
        </Paper>
      );
    }
    return null;
  };

  // Custom legend
  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
        {payload.map((entry, index) => (
          <Box key={`item-${index}`} display="flex" alignItems="center" gap={1}>
            <Box 
              width={12} 
              height={12} 
              borderRadius="2px" 
              bgcolor={entry.color}
            />
            <Typography variant="caption" color="text.secondary">
              {entry.value}
            </Typography>
          </Box>
        ))}
      </Stack>
    );
  };

  // Rank colors
  const rankColors = ['#ffd700', '#c0c0c0', '#cd7f32', '#6366f1', '#10b981'];

  return (
    <Paper 
      sx={{ 
        p: 3, 
        borderRadius: 3,
        height: 500,
        display: 'flex',
        flexDirection: 'column',
        background: `linear-gradient(135deg, ${alpha('#f8fafc', 0.8)} 0%, ${alpha('#ffffff', 0.8)} 100%)`,
        border: `1px solid ${alpha('#000', 0.08)}`,
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
        }
      }}
    >
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
        <Box>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Star sx={{ color: '#ffd700', fontSize: 24 }} />
            <Typography variant="h5" fontWeight="bold" color="text.primary">
              Top Bác Sĩ Xuất Sắc
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Xếp hạng dựa trên doanh thu và hiệu suất làm việc
          </Typography>
        </Box>
        <Chip 
          icon={<TrendingUp />}
          label="Hiệu suất cao"
          size="small"
          sx={{ 
            bgcolor: alpha('#10b981', 0.1),
            color: '#065f46',
            fontWeight: 'medium'
          }}
        />
      </Box>

      {/* Doctor cards on mobile, chart on desktop */}
      <Box sx={{ display: { xs: 'none', md: 'block' }, flex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 120, bottom: 20 }}
          >
            <CartesianGrid 
              horizontal={false}
              stroke={alpha('#000', 0.05)}
              strokeDasharray="3 3"
            />
            <XAxis 
              type="number"
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => formatNumber(value)}
              tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
            />
            <YAxis 
              dataKey="name" 
              type="category" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: theme.palette.text.primary, fontWeight: 500, fontSize: 14 }}
              width={110}
              tickFormatter={(value) => {
                const maxLength = 15;
                return value.length > maxLength ? value.substring(0, maxLength) + '...' : value;
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={renderLegend} />
            
            {/* Booking count bar */}
            <Bar 
              dataKey="bookingCount" 
              name="Số lịch đã khám"
              radius={[0, 4, 4, 0]}
              barSize={16}
            >
              {sortedData.map((entry, index) => (
                <Cell 
                  key={`cell-booking-${index}`}
                  fill={alpha('#3b82f6', 0.8)}
                  stroke={alpha('#3b82f6', 0.2)}
                  strokeWidth={1}
                />
              ))}
            </Bar>
            
            {/* Revenue bar */}
            <Bar 
              dataKey="totalRevenue" 
              name="Doanh thu"
              radius={[0, 4, 4, 0]}
              barSize={16}
            >
              {sortedData.map((entry, index) => (
                <Cell 
                  key={`cell-revenue-${index}`}
                  fill={alpha('#10b981', 0.8)}
                  stroke={alpha('#10b981', 0.2)}
                  strokeWidth={1}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {/* Mobile view - Doctor cards */}
      <Box sx={{ display: { xs: 'block', md: 'none' }, flex: 1, overflowY: 'auto' }}>
        <Stack spacing={2}>
          {sortedData.map((doctor, index) => (
            <Paper
              key={index}
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: 'background.paper',
                borderLeft: `4px solid ${rankColors[index]}`,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateX(4px)',
                }
              }}
            >
              {/* Rank badge */}
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  bgcolor: rankColors[index],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 14
                }}
              >
                {index + 1}
              </Box>
              
              {/* Doctor info */}
              <Box flex={1}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {doctor.name}
                </Typography>
                {doctor.specialty && (
                  <Typography variant="caption" color="text.secondary">
                    {doctor.specialty}
                  </Typography>
                )}
              </Box>
              
              {/* Stats */}
              <Box textAlign="right">
                <Typography variant="body2" fontWeight="bold" color="#3b82f6">
                  {doctor.bookingCount} lịch
                </Typography>
                <Typography variant="body2" fontWeight="bold" color="#10b981">
                  {formatCurrency(doctor.totalRevenue)}
                </Typography>
              </Box>
            </Paper>
          ))}
        </Stack>
      </Box>

      {/* Footer stats */}
      <Box 
        mt={3} 
        pt={2} 
        borderTop={`1px solid ${alpha('#000', 0.08)}`}
        display="flex"
        justifyContent="space-around"
        flexWrap="wrap"
        gap={2}
      >
        <Box textAlign="center">
          <Typography variant="caption" color="text.secondary">
            Tổng doanh thu
          </Typography>
          <Typography variant="h6" fontWeight="bold" color="#2e7d32">
            {formatCurrency(sortedData.reduce((sum, doc) => sum + doc.totalRevenue, 0))}
          </Typography>
        </Box>
        <Box textAlign="center">
          <Typography variant="caption" color="text.secondary">
            Tổng số lịch
          </Typography>
          <Typography variant="h6" fontWeight="bold" color="#1976d2">
            {sortedData.reduce((sum, doc) => sum + doc.bookingCount, 0).toLocaleString()}
          </Typography>
        </Box>
        <Box textAlign="center">
          <Typography variant="caption" color="text.secondary">
            Bác sĩ hàng đầu
          </Typography>
          <Typography variant="h6" fontWeight="bold" color="#ed6c02">
            {sortedData[0]?.name.split(' ').pop() || 'N/A'}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default DoctorsChart;