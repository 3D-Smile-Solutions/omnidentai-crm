// 10. src/components/Dashboard/components/Overview/Overview.jsx
// ===========================================
import React from 'react';
import { Typography } from '@mui/material';
import OverviewMetrics from './OverviewMetrics';
import OverviewCharts from './OverviewCharts';

const Overview = ({ isMobile }) => {
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