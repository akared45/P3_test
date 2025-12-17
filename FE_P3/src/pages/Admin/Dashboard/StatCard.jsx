import React from 'react';
import { Box, Card, CardContent, Avatar, Typography, Chip, Stack, alpha } from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';

const StatCard = ({ title, value, icon, color, trend, trendValue }) => {
  return (
    <Card 
      sx={{ 
        height: '100%', 
        position: 'relative', 
        overflow: 'hidden',
        borderRadius: 3,
        bgcolor: alpha(color, 0.05),
        border: `1px solid ${alpha(color, 0.1)}`,
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 24px ${alpha(color, 0.15)}`,
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box flex={1}>
            <Typography 
              color="text.secondary" 
              variant="caption" 
              fontWeight="medium"
              sx={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}
            >
              {title}
            </Typography>
            <Typography 
              variant="h4" 
              fontWeight="bold" 
              sx={{ 
                color: color,
                mt: 1,
                mb: 2
              }}
            >
              {value}
            </Typography>
            
            {trend && (
              <Stack direction="row" alignItems="center" spacing={1}>
                <Chip
                  icon={trend === 'up' ? <ArrowUpward /> : <ArrowDownward />}
                  label={`${trendValue}%`}
                  size="small"
                  sx={{
                    bgcolor: trend === 'up' ? alpha('#2e7d32', 0.1) : alpha('#d32f2f', 0.1),
                    color: trend === 'up' ? '#2e7d32' : '#d32f2f',
                    fontWeight: 'medium'
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  so với kỳ trước
                </Typography>
              </Stack>
            )}
          </Box>
          <Avatar 
            variant="rounded"
            sx={{ 
              bgcolor: alpha(color, 0.1), 
              color: color, 
              width: 56, 
              height: 56,
              borderRadius: 2
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
      
      <Box sx={{
        position: 'absolute', 
        right: -24, 
        bottom: -24, 
        width: 80, 
        height: 80,
        borderRadius: '50%', 
        bgcolor: alpha(color, 0.1),
        zIndex: 0
      }} />
    </Card>
  );
};

export default StatCard;