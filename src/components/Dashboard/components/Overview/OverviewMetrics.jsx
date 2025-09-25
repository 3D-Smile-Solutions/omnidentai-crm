// 8. src/components/Dashboard/components/Overview/OverviewMetrics.jsx
// ===========================================
import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

const MetricCard = ({ title, value, subtitle, color = 'success.main' }) => (
  <Paper elevation={0} sx={{ 
    p: 3,
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fffe 100%)',
    border: '1px solid rgba(62, 228, 200, 0.2)',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
    '&:hover': {
      boxShadow: '0 4px 20px rgba(62, 228, 200, 0.15)',
      transform: 'translateY(-2px)'
    }
  }}>
    <Typography variant="subtitle2" sx={{ color: 'rgba(11, 25, 41, 0.6)', fontWeight: 600 }} gutterBottom>
      {title}
    </Typography>
    <Typography variant="h3" sx={{ fontWeight: 700, color: '#0B1929' }}>{value}</Typography>
    <Typography variant="body2" color={color}>
      {subtitle}
    </Typography>
  </Paper>
);

const OverviewMetrics = () => {
  const metrics = [
    {
      title: 'Total Revenue',
      value: '$24,580',
      subtitle: '+12% from last month',
      color: 'success.main'
    },
    {
      title: 'Total Bookings',
      value: '68',
      subtitle: '52 completed this month',
      color: 'text.secondary'
    },
    {
      title: 'Total Conversations',
      value: '342',
      subtitle: '+28% from last week',
      color: 'success.main'
    },
    {
      title: 'Most Recent Booking',
      value: 'Teeth Cleaning',
      subtitle: 'Booked 2 hours ago',
      color: 'text.secondary'
    }
  ];

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2, mt: 3 }}>
      {metrics.map((metric, index) => (
        <MetricCard 
          key={index}
          title={metric.title}
          value={metric.value}
          subtitle={metric.subtitle}
          color={metric.color}
        />
      ))}
    </Box>
  );
};

export default OverviewMetrics;