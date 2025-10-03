// frontend/src/components/Dashboard/components/Overview/OverviewMetrics.jsx
import React from 'react';
import { Box, Paper, Typography, Skeleton } from '@mui/material';
import { useSelector } from 'react-redux';

const MetricCard = ({ title, value, subtitle, color = 'success.main', loading = false }) => (
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
    {loading ? (
      <>
        <Skeleton variant="text" width="60%" height={48} />
        <Skeleton variant="text" width="80%" />
      </>
    ) : (
      <>
        <Typography variant="h3" sx={{ fontWeight: 700, color: '#0B1929' }}>{value}</Typography>
        <Typography variant="body2" color={color}>
          {subtitle}
        </Typography>
      </>
    )}
  </Paper>
);

const OverviewMetrics = () => {
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

  // Format time ago
  const getTimeAgo = (timestamp) => {
    if (!timestamp) return 'N/A';
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  const metrics = [
    {
      title: 'Total Revenue',
      value: formatCurrency(summary.totalRevenue),
      subtitle: summary.revenueGrowth > 0 
        ? `+${summary.revenueGrowth}% from last month`
        : summary.revenueGrowth < 0 
        ? `${summary.revenueGrowth}% from last month`
        : 'No change from last month',
      color: summary.revenueGrowth >= 0 ? 'success.main' : 'error.main'
    },
    {
      title: 'Total Bookings',
      value: summary.totalBookings,
      subtitle: `${summary.totalBookings} appointments booked`,
      color: 'text.secondary'
    },
    {
      title: 'Total Conversations',
      value: summary.totalConversations,
      subtitle: summary.conversationGrowth > 0 
        ? `+${summary.conversationGrowth}% from last week`
        : `${summary.totalConversations} total interactions`,
      color: summary.conversationGrowth > 0 ? 'success.main' : 'text.secondary'
    },
    {
      title: 'Most Recent Booking',
      value: summary.recentBooking?.type 
        ? summary.recentBooking.type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
        : 'No bookings yet',
      subtitle: summary.recentBooking 
        ? `Booked ${getTimeAgo(summary.recentBooking.time)}`
        : 'Waiting for first booking',
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
        />
      ))}
    </Box>
  );
};

export default OverviewMetrics;