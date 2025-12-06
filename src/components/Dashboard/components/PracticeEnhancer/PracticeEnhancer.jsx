// 14. src/components/Dashboard/components/PracticeEnhancer/PracticeEnhancer.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import PracticeEnhancerChat from '../../../PracticeEnhancerChat';
import { useTheme } from '../../../../context/ThemeContext';

const PracticeEnhancer = ({ isMobile }) => {
  const { isDarkMode } = useTheme();
  
  const textPrimary = isDarkMode ? '#ffffff' : '#0B1929';
  const textSecondary = isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(11,25,41,0.65)';

  return (
    <Box sx={{ 
      mx: isMobile ? -2 : 0,
      px: isMobile ? 1 : 0 
    }}>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          fontWeight: 600,
          px: isMobile ? 2 : 0,
          color: textPrimary,
        }}
      >
        Practice Enhancer
      </Typography>
      <Typography 
        variant="body2" 
        sx={{ 
          mb: 2,
          px: isMobile ? 2 : 0,
          color: textSecondary,
        }}
      >
        Chat with your AI assistant that knows everything about your practice
      </Typography>
      <PracticeEnhancerChat isMobile={isMobile} />
    </Box>
  );
};

export default PracticeEnhancer;