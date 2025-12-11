// src/components/Dashboard/components/Overview/Overview.jsx
import React, { useEffect } from 'react';
import { Typography, Box, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOverviewMetrics } from '../../../../redux/slices/metricsSlice';
import { useTheme } from '../../../../context/ThemeContext';
import OverviewMetrics from './OverviewMetrics';
import OverviewCharts from './OverviewCharts';
import GoogleMapComponent from '../../../GoogleMapComponent';
import TwilioUsage from '../../../TwilioUsage';

const Overview = ({ isMobile }) => {
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const { loading, error, lastFetched, summary, charts } = useSelector((state) => state.metrics);

  useEffect(() => {
    console.log('📊 Overview component mounted - fetching metrics');
    dispatch(fetchOverviewMetrics());
  }, [dispatch]);

  useEffect(() => {
    console.log('📈 METRICS STATE DEBUG:');
    Object.keys(charts).forEach(key => {
      // console.log(`📉 ${key}:`, charts[key]);
    });
  }, [summary, charts, loading, error]);

  if (loading && !lastFetched) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress sx={{ color: '#3EE4C8' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">
          Error loading metrics: {error}
        </Typography>
        <Typography variant="body2" sx={{ mt: 2, color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(11,25,41,0.7)' }}>
          Check browser console for details
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      width: '100%',
      pb: 4  // Add padding bottom to ensure last content is visible
    }}>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          fontWeight: 600,
          color: isDarkMode ? '#ffffff' : '#0B1929',
        }}
      >
        Practice Overview
      </Typography>
      <Typography 
        paragraph 
        sx={{
          color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(11, 25, 41, 0.7)',
          mb: 3
        }}
      >
        Welcome to OmniDent AI. Monitor your practice performance, track patient metrics, and manage daily operations.
      </Typography>
      <OverviewMetrics />
      <OverviewCharts isMobile={isMobile} />
      <GoogleMapComponent />
      <TwilioUsage />
    </Box>
  );
};

export default Overview;