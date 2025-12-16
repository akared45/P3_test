import React from 'react';
import { Box, Chip, Fade, Typography } from '@mui/material';
import { AutoAwesome } from '@mui/icons-material';

export default function SuggestionStrip({ suggestions, onSelect }) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <Fade in={true}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        gap: 1, 
        p: 1.5, 
        px: 2,
        overflowX: 'auto', 
        bgcolor: '#f0f7ff',
        borderTop: '1px dashed #bbdefb',
        whiteSpace: 'nowrap',
        '&::-webkit-scrollbar': { height: 4 },
        '&::-webkit-scrollbar-thumb': { bgcolor: '#bcd' }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 1, color: 'secondary.main' }}>
            <AutoAwesome sx={{ fontSize: 18 }} />
            <Typography variant="caption" sx={{ ml: 0.5, fontWeight: 'bold' }}>AI Gợi ý:</Typography>
        </Box>

        {suggestions.map((text, index) => (
          <Chip
            key={index}
            label={text}
            onClick={() => onSelect(text)}
            clickable
            color="primary"
            variant="outlined"
            size="small"
            sx={{ 
                bgcolor: 'white', 
                fontWeight: 500,
                border: '1px solid #90caf9',
                '&:hover': { 
                    bgcolor: '#e3f2fd',
                    transform: 'translateY(-1px)',
                    boxShadow: 1
                },
                transition: 'all 0.2s'
            }}
          />
        ))}
      </Box>
    </Fade>
  );
}