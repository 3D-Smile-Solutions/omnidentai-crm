// ===========================================
// FILE: src/components/Dashboard/components/PracticeEnhancer/PracticeEnhancer.jsx
// ===========================================
import React from 'react';
import { Box, Typography } from '@mui/material';
import PracticeEnhancerChat from '../../../PracticeEnhancerChat';
import { useTheme } from '../../../../context/ThemeContext';

const PracticeEnhancer = ({ isMobile }) => {
  const { isDarkMode } = useTheme();
  
  const textPrimary = isDarkMode ? '#ffffff' : '#ffffff';
  const textSecondary = isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(255, 255, 255, 0.65)';

  return (
    <Box sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      px: isMobile ? 2 : 3,
      pt: 6,
      pb: 0,
    }}>
      <Typography 
        variant="h4" 
        sx={{ 
          fontWeight: 600,
          color: textPrimary,
          mb: 1,
          flexShrink: 0,
        }}
      >
        Practice Enhancer
      </Typography>
      <Typography 
        variant="body2" 
        sx={{ 
          mb: 2,
          color: textSecondary,
          flexShrink: 0,
        }}
      >
        Chat with your AI assistant that knows everything about your practice
      </Typography>
      <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <PracticeEnhancerChat isMobile={isMobile} />
      </Box>
    </Box>
  );
};

export default PracticeEnhancer;