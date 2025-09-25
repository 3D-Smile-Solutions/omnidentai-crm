import React from 'react';
import { Box, Typography } from '@mui/material';
import PracticeEnhancerChat from '../../components/PracticeEnhancerChat';

const DashboardPracticeEnhancer = ({ isMobile }) => (
  <Box sx={{ mx: isMobile ? -2 : 0, px: isMobile ? 1 : 0 }}>
    <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>Practice Enhancer</Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, px: isMobile ? 2 : 0 }}>Chat with your AI assistant that knows everything about your practice</Typography>
    <PracticeEnhancerChat isMobile={isMobile} />
  </Box>
);

export default DashboardPracticeEnhancer;
