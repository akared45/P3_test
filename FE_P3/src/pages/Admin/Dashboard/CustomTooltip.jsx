import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import dayjs from 'dayjs';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Paper 
        sx={{ 
          p: 2, 
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: 'background.paper'
        }}
      >
        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
          {dayjs(label).format('DD/MM/YYYY')}
        </Typography>
        {payload.map((entry, index) => (
          <Box key={index} display="flex" alignItems="center" gap={1} mb={0.5}>
            <Box 
              width={12} 
              height={12} 
              borderRadius="2px"
              bgcolor={entry.color}
            />
            <Typography variant="body2" color="text.secondary">
              {entry.name === 'revenue' ? 'Doanh thu:' : 'Lượt đặt:'}
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {entry.name === 'revenue' 
                ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(entry.value)
                : entry.value
              }
            </Typography>
          </Box>
        ))}
      </Paper>
    );
  }
  return null;
};

export default CustomTooltip;