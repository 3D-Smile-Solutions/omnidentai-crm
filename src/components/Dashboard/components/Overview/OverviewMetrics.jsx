// src/components/Dashboard/components/Overview/OverviewMetrics.jsx
import React from 'react';
import { Box, Paper, Typography, Skeleton } from '@mui/material';
import { useSelector } from 'react-redux';
import { useTheme } from '../../../../context/ThemeContext';

const MetricCard = ({ title, value, subtitle, color = 'success.main', loading = false, isDarkMode }) => (
  <Paper elevation={0} sx={{ 
    p: 3,
    background: isDarkMode 
      ? 'rgba(17, 24, 39, 0.5)'
      : 'linear-gradient(135deg, #ffffff 0%, #f8fffe 100%)',
    backdropFilter: 'blur(20px)',
    border: isDarkMode 
      ? '1px solid rgba(100, 255, 218, 0.2)'
      : '1px solid rgba(62, 228, 200, 0.2)',
    borderRadius: 2,
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
    '&:hover': {
      boxShadow: isDarkMode 
        ? '0 4px 20px rgba(100, 255, 218, 0.15)'
        : '0 4px 20px rgba(62, 228, 200, 0.2)',
      transform: 'translateY(-2px)'
    }
  }}>
    <Typography 
      variant="subtitle2" 
      sx={{ 
        color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(11, 25, 41, 0.6)', 
        fontWeight: 600 
      }} 
      gutterBottom
    >
      {title}
    </Typography>
    {loading ? (
      <>
        <Skeleton variant="text" width="60%" height={48} sx={{ bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : undefined }} />
        <Skeleton variant="text" width="80%" sx={{ bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : undefined }} />
      </>
    ) : (
      <>
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 700, 
            color: isDarkMode ? '#ffffff' : '#0B1929' 
          }}
        >
          {value}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{
            color: isDarkMode 
              ? (color === 'success.main' ? '#3EE4C8' : color === 'primary.main' ? '#64ffda' : 'rgba(255,255,255,0.6)')
              : color
          }}
        >
          {subtitle}
        </Typography>
      </>
    )}
  </Paper>
);

const OverviewMetrics = () => {
  const { isDarkMode } = useTheme();
  const { summary, loading } = useSelector((state) => state.metrics);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const metrics = [
    {
      title: 'Total Conversations',
      value: summary.totalConversations || 0,
      subtitle: 'All conversation records',
      color: 'primary.main'
    },
    {
      title: 'Total Bookings',
      value: summary.totalBookings || 0,
      subtitle: 'Appointments booked',
      color: 'success.main'
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(summary.totalRevenue || 0),
      subtitle: 'Estimated value from conversations',
      color: 'success.main'
    },
    {
      title: 'Avg Session Duration',
      value: `${summary.avgSessionDuration || 0} min`,
      subtitle: 'Average conversation length',
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
          loading={loading}
          isDarkMode={isDarkMode}
        />
      ))}
    </Box>
  );
};

export default OverviewMetrics;