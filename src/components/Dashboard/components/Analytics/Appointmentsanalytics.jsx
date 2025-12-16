// src/components/Dashboard/components/Analytics/AppointmentsAnalytics.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Skeleton, Fade } from '@mui/material';
import { useSelector } from 'react-redux';
import { useTheme } from '../../../../context/ThemeContext';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import DateRangePicker from '../Overview/Daterangepicker.jsx';
import { subDays } from 'date-fns';

// Custom tooltip matching Overview style
const CustomTooltip = ({ active, payload, label, tokens, formatter }) => {
  if (!active || !payload?.length) return null;
  
  return (
    <Box sx={{
      background: tokens.bgSubtle,
      border: `0px solid ${tokens.border}`,
      borderRadius: '10px',
      p: 1.5,
      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    }}>
      <Typography sx={{ 
        fontSize: '0.7rem', 
        color: tokens.textTertiary, 
        mb: 0.5,
        fontFamily: '"DM Sans", system-ui, sans-serif',
      }}>
        {label}
      </Typography>
      {payload.map((entry, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: entry.color }} />
          <Typography sx={{ 
            fontSize: '0.8rem', 
            fontWeight: 600, 
            color: tokens.textPrimary,
            fontFamily: '"DM Sans", system-ui, sans-serif',
          }}>
            {formatter ? formatter(entry.value) : entry.value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

// Performance Ring matching OverviewMetrics style
const PerformanceRing = ({ value, label, color, tokens }) => {
  const circumference = 2 * Math.PI * 26;
  const offset = circumference - (value / 100) * circumference;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
      <Box sx={{ position: 'relative', width: { xs: 56, sm: 64 }, height: { xs: 56, sm: 64 } }}>
        <svg width="100%" height="100%" viewBox="0 0 64 64" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="32" cy="32" r="26" fill="none" stroke={tokens.border} strokeWidth="5" />
          <circle
            cx="32" cy="32" r="26" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography sx={{
            fontSize: { xs: '0.8125rem', sm: '0.9375rem' },
            fontWeight: 700,
            color: tokens.textPrimary,
            letterSpacing: '-0.02em',
            fontFamily: '"DM Sans", system-ui, sans-serif',
          }}>
            {value}%
          </Typography>
        </Box>
      </Box>
      <Typography sx={{
        fontSize: { xs: '0.5rem', sm: '0.5625rem' },
        fontWeight: 600,
        color: tokens.textTertiary,
        textAlign: 'center',
        lineHeight: 1.2,
        textTransform: 'uppercase',
        letterSpacing: '0.03em',
        fontFamily: '"DM Sans", system-ui, sans-serif',
      }}>
        {label}
      </Typography>
    </Box>
  );
};

// Distribution metric item for the combined card
const DistributionMetricItem = ({ title, subtitle, data, tokens }) => {
  // Handle both 'value' and 'count' properties from different data sources
  const normalizedData = data.map(item => ({
    name: item.name || item.type || item.outcome || item.channel,
    value: item.value ?? item.count ?? 0
  }));
  const total = normalizedData.reduce((sum, item) => sum + item.value, 0);
  const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];
  
  if (total === 0) return null;
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <Box sx={{ lineHeight: 1.2 }}>
        <Typography sx={{
          fontSize: { xs: '0.875rem', sm: '0.9375rem' },
          fontWeight: 600,
          color: tokens.textPrimary,
          fontFamily: '"DM Sans", system-ui, sans-serif',
          lineHeight: 1.2,
        }}>
          {title}
        </Typography>
        <Typography sx={{
          fontSize: { xs: '0.6875rem', sm: '0.75rem' },
          color: tokens.textTertiary,
          fontFamily: '"DM Sans", system-ui, sans-serif',
          lineHeight: 1.2,
          mt: 0.125,
        }}>
          {subtitle}
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', height: 5, borderRadius: 2.5, overflow: 'hidden' }}>
        {normalizedData.map((item, index) => (
          <Box key={index} sx={{ width: `${(item.value / total) * 100}%`, background: colors[index % colors.length], transition: 'width 0.6s ease' }} />
        ))}
      </Box>
      
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {normalizedData.map((item, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: 1.5, background: colors[index % colors.length], flexShrink: 0 }} />
            <Typography sx={{ fontSize: { xs: '0.75rem', sm: '0.8125rem' }, color: tokens.textSecondary, fontFamily: '"DM Sans", system-ui, sans-serif' }}>
              {item.name}: <span style={{ fontWeight: 700, color: tokens.textPrimary }}>{item.value}</span>
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

// Stat card with sparkline background
const StatCard = ({ label, value, change, changeLabel, sparklineData, sparklineColor, loading, tokens, isDarkMode, cardHoverStyle }) => {
  const isPositive = change >= 0;
  
  return (
    <Box sx={{
      background: tokens.bgSubtle,
      border: `0px solid ${tokens.border}`,
      borderRadius: '12px',
      p: { xs: 1.5, sm: 2, md: 2.5 },
      minHeight: { xs: 120, sm: 140, md: 160 },
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      transition: 'all 0.3s ease',
      ...cardHoverStyle,
    }}>
      <Box sx={{ 
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        height: '50%',
        opacity: 0.6,
        pointerEvents: 'none',
      }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sparklineData}>
            <defs>
              <linearGradient id={`spark-appt-${label.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={sparklineColor} stopOpacity={0.3} />
                <stop offset="100%" stopColor={sparklineColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey="v" 
              stroke={sparklineColor}
              strokeWidth={1.5}
              fill={`url(#spark-appt-${label.replace(/\s/g, '')})`}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>

      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography sx={{
          fontSize: { xs: '0.625rem', sm: '0.6875rem' },
          fontWeight: 600,
          color: tokens.textTertiary,
          letterSpacing: '0.05em',
          mb: { xs: 0.5, sm: 1 },
          textTransform: 'uppercase',
          fontFamily: '"DM Sans", system-ui, sans-serif',
        }}>
          {label}
        </Typography>

        {loading ? (
          <Skeleton variant="text" width="60%" height={36} sx={{ bgcolor: tokens.border }} />
        ) : (
          <Typography sx={{
            fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.875rem' },
            fontWeight: 700,
            color: tokens.textPrimary,
            letterSpacing: '-0.03em',
            lineHeight: 1,
            fontFamily: '"DM Sans", system-ui, sans-serif',
          }}>
            {value}
          </Typography>
        )}
      </Box>

      {!loading && (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 0.5, 
          position: 'relative', 
          zIndex: 1,
          flexWrap: 'wrap',
        }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.25,
            px: 0.5,
            py: 0.25,
            borderRadius: '4px',
            background: isPositive ? tokens.accentMuted : 'rgba(239,68,68,0.1)',
          }}>
            <Typography sx={{
              fontSize: { xs: '0.625rem', sm: '0.6875rem' },
              fontWeight: 600,
              color: isPositive ? tokens.accent : '#ef4444',
              fontFamily: '"DM Sans", system-ui, sans-serif',
            }}>
              {isPositive ? '↑' : '↓'} {Math.abs(change)}%
            </Typography>
          </Box>
          <Typography sx={{
            fontSize: { xs: '0.5625rem', sm: '0.625rem' },
            color: tokens.textTertiary,
            display: { xs: 'none', sm: 'block' },
            fontFamily: '"DM Sans", system-ui, sans-serif',
          }}>
            {changeLabel}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

// Generate sparkline data
const generateSparkline = (trend = 'up', points = 12) => {
  const base = trend === 'up' ? 40 : 60;
  const direction = trend === 'up' ? 1 : -1;
  return Array.from({ length: points }, (_, i) => ({
    v: base + (direction * i * 2) + (Math.random() * 15 - 7.5)
  }));
};

const AppointmentsAnalytics = () => {
  const { isDarkMode } = useTheme();
  const { charts, loading } = useSelector((state) => state.metrics);
  const [mounted, setMounted] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: subDays(new Date(), 30),
    endDate: new Date(),
    label: 'Last 30 Days'
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Design tokens matching Overview exactly
  const tokens = {
    bg: 'transparent',
    bgBlur: isDarkMode 
      ? 'rgba(9, 9, 11, 0.7)'
      : 'rgba(250, 250, 250, 0.7)',
    bgSubtle: isDarkMode ? '#18181bd8' : '#ffffff',
    border: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    textPrimary: isDarkMode ? '#fafafa' : '#09090b',
    textSecondary: isDarkMode ? 'rgba(250,250,250,0.5)' : 'rgba(9,9,11,0.5)',
    textTertiary: isDarkMode ? 'rgba(250,250,250,0.35)' : 'rgba(9,9,11,0.35)',
    accent: '#3b82f6',
    accentMuted: isDarkMode ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59,130,246,0.1)',
  };

  const gridColor = isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';

  // Category colors
  const categoryColors = {
    green: '#10b981',
    blue: '#3b82f6',
    purple: '#8b5cf6',
    orange: '#f59e0b',
  };

  // Gradient hover style for cards
  const cardHoverStyle = {
    '&:hover': {
      background: isDarkMode 
        ? 'linear-gradient(180deg, rgba(59, 131, 246, 0.90) 0%, rgba(34, 47, 66, 0.9) 50%, rgba(24, 24, 27, 0.90) 100%)'
        : 'linear-gradient(180deg, rgba(59, 187, 246, 0.9) 0%, rgba(255, 255, 255, 0.90) 100%)',
    },
  };

  // Calculate metrics from charts data
  const totalAppointments = charts.appointmentType?.reduce((sum, item) => sum + item.count, 0) || 0;
  const bookedCount = charts.appointmentBooked?.find(d => d.name === 'Booked')?.value || 0;
  const confirmedCount = charts.appointmentBooked?.find(d => d.name === 'Confirmed')?.value || 0;
  const totalBooked = bookedCount + confirmedCount;
  const bookingRate = totalAppointments > 0 ? Math.round((totalBooked / totalAppointments) * 100) : 0;

  // KPI stats with sparklines
  const kpiStats = [
    { label: 'Total Appointments', value: totalAppointments || '847', change: 12.3, changeLabel: 'vs last month', sparklineData: generateSparkline('up'), sparklineColor: categoryColors.blue },
    { label: 'Booking Rate', value: `${bookingRate || 78}%`, change: 5.8, changeLabel: 'vs last month', sparklineData: generateSparkline('up'), sparklineColor: categoryColors.green },
    { label: 'Avg Wait Time', value: '2.4 days', change: -15.2, changeLabel: 'vs last month', sparklineData: generateSparkline('down'), sparklineColor: categoryColors.purple },
    { label: 'No Shows', value: '3.2%', change: -8.5, changeLabel: 'vs last month', sparklineData: generateSparkline('down'), sparklineColor: categoryColors.orange },
  ];

  // Appointment types trend data - always use structured mock data for the area chart
  const appointmentTrendData = [
    { week: 'W1', cleanings: 45, checkups: 32, emergency: 12, cosmetic: 18 },
    { week: 'W2', cleanings: 52, checkups: 38, emergency: 8, cosmetic: 22 },
    { week: 'W3', cleanings: 48, checkups: 35, emergency: 15, cosmetic: 20 },
    { week: 'W4', cleanings: 55, checkups: 42, emergency: 10, cosmetic: 25 },
    { week: 'W5', cleanings: 50, checkups: 40, emergency: 11, cosmetic: 23 },
    { week: 'W6', cleanings: 58, checkups: 45, emergency: 9, cosmetic: 28 },
  ];

  // Booking status data - normalize from Redux or use fallback
  const bookingStatusData = charts.appointmentBooked?.length > 0 
    ? charts.appointmentBooked.map(item => ({
        name: item.name || item.status,
        value: item.value ?? item.count ?? 0
      }))
    : [
        { name: 'Confirmed', value: 245 },
        { name: 'Pending', value: 67 },
        { name: 'Cancelled', value: 23 },
      ];

  // Booking outcomes data - normalize from Redux or use fallback
  const bookingOutcomesData = charts.bookingOutcome?.length > 0 
    ? charts.bookingOutcome.map(item => ({
        name: item.name || item.outcome,
        value: item.value ?? item.count ?? 0
      }))
    : [
        { name: 'Completed', value: 312 },
        { name: 'Rescheduled', value: 45 },
        { name: 'No Show', value: 18 },
      ];

  // Communication channels data - normalize from Redux or use fallback
  const channelData = charts.conversationChannel?.length > 0 
    ? charts.conversationChannel.map(item => ({
        name: item.name || item.channel,
        value: item.value ?? item.count ?? 0
      }))
    : [
        { name: 'Phone', value: 156 },
        { name: 'Online', value: 234 },
        { name: 'Walk-in', value: 45 },
      ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      width: '100%',
      background: isDarkMode 
        ? 'linear-gradient(135deg, rgba(9, 9, 11, 0.57) 0%, rgba(24, 24, 27, 0.47) 50%, rgba(9, 9, 11, 0.37) 100%)'
        : 'linear-gradient(135deg, rgba(250,250,250,0.9) 0%, rgba(255,255,255,0.95) 50%, rgba(250,250,250,0.9) 100%)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      fontFamily: '"DM Sans", system-ui, sans-serif',
    }}>
      {/* Header */}
      <Fade in={mounted} timeout={600}>
        <Box sx={{ 
          px: { xs: 2, sm: 3 },
          pt: { xs: 2, sm: 2.5 },
          pb: 1.5,
          borderBottom: `1px solid ${tokens.border}`,
          background: isDarkMode 
            ? 'rgba(24, 24, 27, 0.6)'
            : 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between', 
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: { xs: 1.5, sm: 2 },
            maxWidth: 1600,
            mx: 'auto',
          }}>
            <Typography 
              component="h1"
              sx={{ 
                fontWeight: 600,
                color: tokens.textPrimary,
                fontSize: { xs: '1.125rem', sm: '1.25rem' },
                letterSpacing: '-0.025em',
              }}
            >
              Appointments
            </Typography>
            
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              tokens={tokens}
            />
          </Box>
        </Box>
      </Fade>

      {/* Main Content */}
      <Box sx={{ 
        px: { xs: 2, sm: 3 },
        py: { xs: 2, sm: 3 },
        maxWidth: 1600,
        mx: 'auto',
      }}>
        {/* KPI Stats Row */}
        <Fade in={mounted} timeout={800}>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
            gap: { xs: 1.5, sm: 2 },
            mb: { xs: 2, sm: 3 },
          }}>
            {kpiStats.map((stat, index) => (
              <StatCard key={index} {...stat} loading={loading} tokens={tokens} isDarkMode={isDarkMode} cardHoverStyle={cardHoverStyle} />
            ))}
          </Box>
        </Fade>

        {/* Appointment Trends (left) + Key Metrics & Booking Overview (right) */}
        <Fade in={mounted} timeout={1000}>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', lg: '3fr 2fr' }, 
            gap: { xs: 2, sm: 2 },
            mb: { xs: 2, sm: 3 },
          }}>
            {/* Appointment Trends - Left */}
            <Box sx={{
              background: tokens.bgSubtle,
              border: `0px solid ${tokens.border}`,
              borderRadius: '12px',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              ...cardHoverStyle,
            }}>
              {/* Header */}
              <Box sx={{ 
                p: { xs: 1.5, sm: 2 },
                borderBottom: `1px solid ${tokens.border}`,
              }}>
                <Typography sx={{ 
                  fontWeight: 600, 
                  color: tokens.textPrimary,
                  fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                  mb: 0.25,
                }}>
                  Appointment Trends
                </Typography>
                <Typography sx={{ 
                  fontSize: '0.6875rem', 
                  color: tokens.textTertiary,
                }}>
                  Weekly appointment volume by type
                </Typography>
              </Box>

              {/* Chart Content */}
              <Box sx={{ p: { xs: 1.5, sm: 2 }, height: { xs: 320, sm: 380, md: 420, lg: 460 } }}>
                {loading ? (
                  <Skeleton variant="rectangular" width="100%" height="100%" sx={{ borderRadius: 2, bgcolor: tokens.border }} />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={appointmentTrendData}>
                      <defs>
                        <linearGradient id="cleaningsGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="checkupsGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                          <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="emergencyGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.2} />
                          <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="cosmeticGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.2} />
                          <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke={gridColor} strokeDasharray="none" vertical={false} />
                      <XAxis 
                        dataKey="week" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fill: tokens.textTertiary }} 
                        dy={8}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fill: tokens.textTertiary }}
                        dx={-5}
                        width={30}
                      />
                      <Tooltip content={<CustomTooltip tokens={tokens} />} />
                      <Area type="monotone" dataKey="cleanings" stroke="#3b82f6" strokeWidth={2} fill="url(#cleaningsGradient)" dot={false} activeDot={{ r: 5, fill: '#3b82f6', stroke: tokens.bgSubtle, strokeWidth: 2 }} />
                      <Area type="monotone" dataKey="checkups" stroke="#10b981" strokeWidth={2} fill="url(#checkupsGradient)" dot={false} activeDot={{ r: 5, fill: '#10b981', stroke: tokens.bgSubtle, strokeWidth: 2 }} />
                      <Area type="monotone" dataKey="emergency" stroke="#f59e0b" strokeWidth={2} fill="url(#emergencyGradient)" dot={false} activeDot={{ r: 5, fill: '#f59e0b', stroke: tokens.bgSubtle, strokeWidth: 2 }} />
                      <Area type="monotone" dataKey="cosmetic" stroke="#8b5cf6" strokeWidth={2} fill="url(#cosmeticGradient)" dot={false} activeDot={{ r: 5, fill: '#8b5cf6', stroke: tokens.bgSubtle, strokeWidth: 2 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </Box>

              {/* Legend */}
              <Box sx={{ 
                px: { xs: 1.5, sm: 2 }, 
                pb: { xs: 1.5, sm: 2 },
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: { xs: 2, sm: 4 },
                flexWrap: 'wrap',
              }}>
                {[
                  { label: 'Cleanings', color: '#3b82f6' },
                  { label: 'Checkups', color: '#10b981' },
                  { label: 'Emergency', color: '#f59e0b' },
                  { label: 'Cosmetic', color: '#8b5cf6' },
                ].map((item) => (
                  <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 12, height: 3, borderRadius: 1, background: item.color }} />
                    <Typography sx={{ fontSize: '0.6875rem', color: tokens.textSecondary, fontFamily: '"DM Sans", system-ui, sans-serif' }}>
                      {item.label}
                    </Typography>
                  </Box>
                ))}
                <Typography sx={{ fontSize: '0.625rem', color: tokens.textTertiary, fontFamily: '"DM Sans", system-ui, sans-serif', ml: { xs: 0, sm: 2 } }}>
                  W = Week
                </Typography>
              </Box>
            </Box>

            {/* Right Column - Key Metrics + Booking Overview */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: { xs: 2, sm: 2 },
            }}>
              {/* Key Metrics */}
              <Box sx={{
                background: tokens.bgSubtle,
                border: `0px solid ${tokens.border}`,
                borderRadius: '12px',
                p: { xs: 1.5, sm: 2 },
                flex: { xs: 'none', lg: '1 1 auto' },
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                ...cardHoverStyle,
              }}>
                <Typography sx={{
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  color: tokens.textTertiary,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  mb: { xs: 1.5, sm: 2 },
                  flexShrink: 0,
                  fontFamily: '"DM Sans", system-ui, sans-serif',
                }}>
                  Key Metrics
                </Typography>

                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  flex: 1,
                  gap: { xs: 2, sm: 2.5 },
                }}>
                  <DistributionMetricItem 
                    title="Booking Status" 
                    subtitle="Current appointment distribution" 
                    data={bookingStatusData} 
                    tokens={tokens} 
                  />
                  <DistributionMetricItem 
                    title="Booking Outcomes" 
                    subtitle="Results from scheduling" 
                    data={bookingOutcomesData} 
                    tokens={tokens} 
                  />
                  <DistributionMetricItem 
                    title="Booking Channels" 
                    subtitle="How patients book" 
                    data={channelData} 
                    tokens={tokens} 
                  />
                </Box>
              </Box>

              {/* Booking Overview Rings */}
              <Box sx={{
                background: tokens.bgSubtle,
                border: `0px solid ${tokens.border}`,
                borderRadius: '12px',
                p: { xs: 1.5, sm: 2 },
                flexShrink: 0,
                transition: 'all 0.3s ease',
                ...cardHoverStyle,
              }}>
                <Typography sx={{
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  color: tokens.textTertiary,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  mb: { xs: 1, sm: 1.5 },
                  fontFamily: '"DM Sans", system-ui, sans-serif',
                }}>
                  Booking Overview
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', py: { xs: 0.5, sm: 1 } }}>
                  <PerformanceRing value={92} label="Confirmed" color={categoryColors.green} tokens={tokens} />
                  <PerformanceRing value={78} label="Show Rate" color={categoryColors.blue} tokens={tokens} />
                  <PerformanceRing value={85} label="On Time" color={categoryColors.purple} tokens={tokens} />
                </Box>
              </Box>
            </Box>
          </Box>
        </Fade>

        {/* Communication Channels - Full Width */}
        <Fade in={mounted} timeout={1200}>
          <Box sx={{
            background: tokens.bgSubtle,
            border: `0px solid ${tokens.border}`,
            borderRadius: '12px',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            ...cardHoverStyle,
          }}>
            {/* Header */}
            <Box sx={{ 
              p: { xs: 1.5, sm: 2 },
              borderBottom: `1px solid ${tokens.border}`,
            }}>
              <Typography sx={{ 
                fontWeight: 600, 
                color: tokens.textPrimary,
                fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                mb: 0.25,
              }}>
                Weekly Booking Volume
              </Typography>
              <Typography sx={{ 
                fontSize: '0.6875rem', 
                color: tokens.textTertiary,
              }}>
                Total appointments scheduled per week
              </Typography>
            </Box>

            {/* Chart */}
            <Box sx={{ p: { xs: 1.5, sm: 2 }, height: { xs: 280, sm: 320, md: 360 } }}>
              {loading ? (
                <Skeleton variant="rectangular" width="100%" height="100%" sx={{ borderRadius: 2, bgcolor: tokens.border }} />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[
                    { week: 'W1', total: 107, online: 65, phone: 32, walkin: 10 },
                    { week: 'W2', total: 120, online: 72, phone: 35, walkin: 13 },
                    { week: 'W3', total: 118, online: 70, phone: 38, walkin: 10 },
                    { week: 'W4', total: 132, online: 82, phone: 40, walkin: 10 },
                    { week: 'W5', total: 124, online: 78, phone: 36, walkin: 10 },
                    { week: 'W6', total: 140, online: 88, phone: 42, walkin: 10 },
                  ]}>
                    <defs>
                      <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke={gridColor} strokeDasharray="none" vertical={false} />
                    <XAxis 
                      dataKey="week"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: tokens.textTertiary }}
                      dy={8}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: tokens.textTertiary }}
                      dx={-5}
                      width={35}
                    />
                    <Tooltip content={<CustomTooltip tokens={tokens} />} />
                    <Area type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} fill="url(#totalGradient)" dot={false} activeDot={{ r: 5, fill: '#3b82f6', stroke: tokens.bgSubtle, strokeWidth: 2 }} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </Box>

            {/* Legend */}
            <Box sx={{ 
              px: { xs: 1.5, sm: 2 }, 
              pb: { xs: 1.5, sm: 2 },
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: { xs: 2, sm: 4 },
              flexWrap: 'wrap',
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 3, borderRadius: 1, background: '#3b82f6' }} />
                <Typography sx={{ fontSize: '0.6875rem', color: tokens.textSecondary, fontFamily: '"DM Sans", system-ui, sans-serif' }}>
                  Total Bookings
                </Typography>
              </Box>
              <Typography sx={{ fontSize: '0.625rem', color: tokens.textTertiary, fontFamily: '"DM Sans", system-ui, sans-serif', ml: { xs: 0, sm: 2 } }}>
                W = Week
              </Typography>
            </Box>
          </Box>
        </Fade>
      </Box>
    </Box>
  );
};

export default AppointmentsAnalytics;