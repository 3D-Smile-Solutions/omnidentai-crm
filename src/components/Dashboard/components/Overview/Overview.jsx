// src/components/Dashboard/components/Overview/Overview.jsx
import React, { useEffect, useState } from 'react';
import { 
  Typography, 
  Box, 
  CircularProgress, 
  Fade,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOverviewMetrics } from '../../../../redux/slices/metricsSlice';
import { useTheme } from '../../../../context/ThemeContext';
import OverviewMetrics from './OverviewMetrics';
import DateRangePicker from './Daterangepicker.jsx';
import GoogleMapComponent from '../../../GoogleMapComponent';
import TwilioUsage from '../../../TwilioUsage';
import { subDays } from 'date-fns';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';

// Custom tooltip
const CustomTooltip = ({ active, payload, label, tokens, formatter }) => {
  if (!active || !payload?.length) return null;
  
  return (
    <Box sx={{
      background: tokens.bgSubtle,
      border: `1px solid ${tokens.border}`,
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

const Overview = ({ isMobile }) => {
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const { charts, loading, error, lastFetched } = useSelector((state) => state.metrics);
  const [mounted, setMounted] = useState(false);
  const [selectedChart, setSelectedChart] = useState('revenue');
  
  const [dateRange, setDateRange] = useState({
    startDate: subDays(new Date(), 30),
    endDate: new Date(),
    label: 'Last 30 Days'
  });

  useEffect(() => {
    dispatch(fetchOverviewMetrics());
    setMounted(true);
  }, [dispatch]);

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      dispatch(fetchOverviewMetrics({ 
        startDate: dateRange.startDate.toISOString(), 
        endDate: dateRange.endDate.toISOString() 
      }));
    }
  }, [dateRange, dispatch]);

  // Design tokens - transparent main bg, solid cards
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
    accent: '#10b981',
    accentMuted: isDarkMode ? 'rgba(44, 185, 16, 0.15)' : 'rgba(16,185,129,0.1)',
  };

  // Gradient hover style for cards - half blue, half transparent
  const cardHoverStyle = {
    '&:hover': {
      background: isDarkMode 
        ? 'linear-gradient(180deg, rgba(59, 131, 246, 0.90) 0%, rgba(34, 47, 66, 0.9) 50%, rgba(24, 24, 27, 0.90) 100%)'
          : 'linear-gradient(180deg, rgba(59, 187, 246, 0.9) 0%, rgba(255, 255, 255, 0.90) 100%)',
    },
  };

  const chartOptions = [
    { value: 'revenue', label: 'Revenue' },
    { value: 'appointments', label: 'Appointments' },
    { value: 'channels', label: 'Channels' },
    { value: 'aiPerformance', label: 'AI Performance' },
  ];

  // Category colors matching Forms/Reports
  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];

  const gridColor = isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';

  const renderSelectedChart = () => {
    switch (selectedChart) {
      case 'revenue':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={charts.monthlyRevenue || []}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={tokens.accent} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={tokens.accent} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={gridColor} strokeDasharray="none" vertical={false} />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: tokens.textTertiary }}
                dy={8}
                interval="preserveStartEnd"
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: tokens.textTertiary }}
                tickFormatter={(v) => `$${v/1000}k`}
                dx={-5}
                width={40}
              />
              <Tooltip content={<CustomTooltip tokens={tokens} formatter={(v) => `$${v.toLocaleString()}`} />} />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke={tokens.accent}
                strokeWidth={2}
                fill="url(#revenueGradient)"
                dot={false}
                activeDot={{ r: 5, fill: tokens.accent, stroke: tokens.bgSubtle, strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'appointments':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={charts.appointmentType || []} layout="vertical">
              <CartesianGrid stroke={gridColor} strokeDasharray="none" horizontal={false} />
              <XAxis 
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: tokens.textTertiary }}
              />
              <YAxis 
                type="category"
                dataKey="type"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: tokens.textTertiary }}
                width={70}
              />
              <Tooltip content={<CustomTooltip tokens={tokens} />} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {(charts.appointmentType || []).map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );

      case 'channels':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={charts.conversationChannel || []}>
              <defs>
                <linearGradient id="channelsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={gridColor} strokeDasharray="none" vertical={false} />
              <XAxis 
                dataKey="channel"
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
              <Area 
                type="monotone" 
                dataKey="count" 
                stroke="#8b5cf6"
                strokeWidth={2}
                fill="url(#channelsGradient)"
                dot={false}
                activeDot={{ r: 5, fill: '#8b5cf6', stroke: tokens.bgSubtle, strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'aiPerformance':
        const aiTrendData = [
          { period: 'W1', handled: 82, resolution: 89, satisfaction: 88 },
          { period: 'W2', handled: 85, resolution: 91, satisfaction: 90 },
          { period: 'W3', handled: 84, resolution: 92, satisfaction: 89 },
          { period: 'W4', handled: 87, resolution: 94, satisfaction: 92 },
        ];
        
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={aiTrendData}>
              <defs>
                <linearGradient id="handledGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="resolutionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="satisfactionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={gridColor} strokeDasharray="none" vertical={false} />
              <XAxis 
                dataKey="period"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: tokens.textTertiary }}
                dy={8}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: tokens.textTertiary }}
                domain={[70, 100]}
                tickFormatter={(v) => `${v}%`}
                dx={-5}
                width={35}
              />
              <Tooltip content={<CustomTooltip tokens={tokens} formatter={(v) => `${v}%`} />} />
              <Area type="monotone" dataKey="handled" stroke="#10b981" strokeWidth={2} fill="url(#handledGradient)" dot={false} />
              <Area type="monotone" dataKey="resolution" stroke="#3b82f6" strokeWidth={2} fill="url(#resolutionGradient)" dot={false} />
              <Area type="monotone" dataKey="satisfaction" stroke="#8b5cf6" strokeWidth={2} fill="url(#satisfactionGradient)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  if (loading && !lastFetched) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        gap: 3,
        background: isDarkMode 
          ? 'linear-gradient(135deg, rgba(9,9,11,0.85) 0%, rgba(24,24,27,0.9) 50%, rgba(9,9,11,0.85) 100%)'
          : 'linear-gradient(135deg, rgba(250,250,250,0.9) 0%, rgba(255,255,255,0.95) 50%, rgba(250,250,250,0.9) 100%)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        fontFamily: '"DM Sans", system-ui, sans-serif',
      }}>
        <CircularProgress 
          sx={{ 
            color: tokens.accent,
            '& .MuiCircularProgress-circle': { strokeLinecap: 'round' }
          }} 
          size={44} 
          thickness={3} 
        />
        <Box sx={{ textAlign: 'center' }}>
          <Typography sx={{ color: tokens.textPrimary, fontWeight: 600, fontSize: '0.9rem' }}>
            Loading insights
          </Typography>
          <Typography sx={{ color: tokens.textTertiary, fontSize: '0.8rem', mt: 0.5 }}>
            Analyzing practice data...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', 
        background: isDarkMode 
          ? 'linear-gradient(135deg, rgba(9,9,11,0.85) 0%, rgba(24,24,27,0.9) 50%, rgba(9,9,11,0.85) 100%)'
          : 'linear-gradient(135deg, rgba(250,250,250,0.9) 0%, rgba(255,255,255,0.95) 50%, rgba(250,250,250,0.9) 100%)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        p: 3, 
        fontFamily: '"DM Sans", system-ui, sans-serif',
      }}>
        <Box sx={{ 
          width: 56, height: 56, borderRadius: '50%', 
          background: 'rgba(239,68,68,0.1)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 
        }}>
          <Typography sx={{ fontSize: '1.25rem' }}>⚠️</Typography>
        </Box>
        <Typography sx={{ fontWeight: 600, color: tokens.textPrimary, mb: 1, fontSize: '0.95rem' }}>
          Unable to load dashboard
        </Typography>
        <Typography sx={{ color: tokens.textSecondary, fontSize: '0.85rem', textAlign: 'center' }}>
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      width: '100%',
      background: isDarkMode 
        ? 'linear-gradient(135deg, rgba(9, 9, 11, 0.57) 0%, rgba(24, 24, 27, 0.47) 50%, rgba(9, 9, 11, 0.37) 100%)'
        : 'linear-gradient(135deg, rgba(250, 250, 250, 0.9) 0%, rgba(255,255,255,0.95) 50%, rgba(250,250,250,0.9) 100%)',
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
            ? 'rgba(24, 24, 27, 0.95)'
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          position: 'relative',
          zIndex: 100,
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
              Dashboard
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
        {/* Metrics Section */}
        <Fade in={mounted} timeout={800}>
          <Box>
            <OverviewMetrics 
              tokens={tokens}
              dateRange={dateRange}
              renderQuickAnalytics={() => (
                <Box sx={{
                  background: tokens.bgSubtle,
                  border: `1px solid ${tokens.border}`,
                  borderRadius: '12px',
                  overflow: 'hidden',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  ...cardHoverStyle,
                }}>
                  {/* Chart Header */}
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 1,
                    p: { xs: 1.5, sm: 2 },
                    borderBottom: `1px solid ${tokens.border}`,
                    flexShrink: 0,
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{
                        width: { xs: 32, sm: 36 },
                        height: { xs: 32, sm: 36 },
                        borderRadius: '10px',
                        background: tokens.accentMuted,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <TrendingUpIcon sx={{ fontSize: { xs: 16, sm: 18 }, color: tokens.accent }} />
                      </Box>
                      <Box>
                        <Typography sx={{ 
                          fontWeight: 600, 
                          color: tokens.textPrimary,
                          fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                        }}>
                          Quick Analytics
                        </Typography>
                        <Typography sx={{ 
                          fontSize: '0.6875rem', 
                          color: tokens.textTertiary,
                          display: { xs: 'none', sm: 'block' },
                        }}>
                          Key metrics overview
                        </Typography>
                      </Box>
                    </Box>

                    <FormControl size="small">
                      <Select
                        value={selectedChart}
                        onChange={(e) => setSelectedChart(e.target.value)}
                        sx={{
                          minWidth: { xs: 110, sm: 140 },
                          borderRadius: '8px',
                          fontSize: '0.8125rem',
                          fontWeight: 500,
                          color: tokens.textPrimary,
                          background: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                          '& .MuiOutlinedInput-notchedOutline': { borderColor: tokens.border },
                          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: tokens.accent },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: tokens.accent, borderWidth: '1px' },
                          '& .MuiSelect-icon': { color: tokens.textSecondary },
                        }}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              borderRadius: '10px',
                              background: isDarkMode ? '#1f1f23' : '#ffffff',
                              border: `1px solid ${tokens.border}`,
                              boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                              mt: 0.5,
                              '& .MuiMenuItem-root': {
                                fontSize: '0.8125rem',
                                color: tokens.textPrimary,
                                py: 1,
                                '&:hover': { background: tokens.accentMuted },
                                '&.Mui-selected': { background: tokens.accentMuted, color: tokens.accent, fontWeight: 600 },
                              }
                            }
                          }
                        }}
                      >
                        {chartOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  {/* Chart Content */}
                  <Box sx={{ p: { xs: 1, sm: 2 }, flex: 1, minHeight: 0 }}>
                    {renderSelectedChart()}
                  </Box>
                </Box>
              )}
            />
          </Box>
        </Fade>

        {/* Geographic & Usage Section */}
        <Fade in={mounted} timeout={1000}>
          <Box sx={{ mt: { xs: 2, sm: 3 } }}>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' },
              gap: { xs: 2, sm: 3 },
            }}>

                <GoogleMapComponent />
                <TwilioUsage />
            </Box>
          </Box>
        </Fade>
      </Box>
    </Box>
  );
};

export default Overview;