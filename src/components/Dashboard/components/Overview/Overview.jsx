// src/components/Dashboard/components/Overview/Overview.jsx
import React, { useEffect } from 'react';
import { Typography, Box, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOverviewMetrics } from '../../../../redux/slices/metricsSlice';
import OverviewMetrics from './OverviewMetrics';
import OverviewCharts from './OverviewCharts';

const Overview = ({ isMobile }) => {
  const dispatch = useDispatch();
  const { loading, error, lastFetched, summary, charts } = useSelector((state) => state.metrics);

  useEffect(() => {
    console.log('📊 Overview component mounted - fetching metrics');
    dispatch(fetchOverviewMetrics());
  }, [dispatch]);

  // DEBUG: Log the entire metrics state
  useEffect(() => {
    console.log('🔍 METRICS STATE DEBUG:');
    console.log('Summary:', summary);
    console.log('Charts:', charts);
    console.log('Charts keys:', Object.keys(charts));
    console.log('Loading:', loading);
    console.log('Error:', error);
    
    // Check each chart array
    Object.keys(charts).forEach(key => {
      console.log(`📊 ${key}:`, charts[key]);
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
        <Typography variant="body2" sx={{ mt: 2 }}>
          Check browser console for details
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Practice Overview
      </Typography>
      <Typography paragraph color="text.secondary">
        Welcome to OmniDent AI. Monitor your practice performance, track patient metrics, and manage daily operations.
      </Typography>
      <OverviewMetrics />
      <OverviewCharts isMobile={isMobile} />
    </>
  );
};

export default Overview;