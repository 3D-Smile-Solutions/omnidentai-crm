// frontend/src/components/Dashboard/components/Overview/Overview.jsx
import React, { useEffect } from 'react';
import { Typography, Box, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOverviewMetrics } from '../../../../redux/slices/metricsSlice';
import OverviewMetrics from './OverviewMetrics';
import OverviewCharts from './OverviewCharts';

const Overview = ({ isMobile }) => {
  const dispatch = useDispatch();
  const { loading, error, lastFetched } = useSelector((state) => state.metrics);

  useEffect(() => {
    // Fetch metrics on mount
    console.log('📊 Overview component mounted - fetching metrics');
    dispatch(fetchOverviewMetrics());

    // Optional: Refresh metrics every 5 minutes
    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing metrics...');
      dispatch(fetchOverviewMetrics());
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [dispatch]);

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