// src/components/Dashboard/components/Analytics/RevenueAnalytics.jsx
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
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import DateRangePicker from '../Overview/Daterangepicker.jsx';
import { subDays } from 'date-fns';

// Font family constant - Inter for clean, professional look with excellent number rendering
const FONT_FAMILY = '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

// Number styling for tabular figures (consistent width numbers for better alignment)
const NUMBER_STYLE = {
  fontFamily: FONT_FAMILY,
  fontFeatureSettings: '"tnum" 1, "cv01" 1',
  fontVariantNumeric: 'tabular-nums',
};

// Custom tooltip matching Overview style
const CustomTooltip = ({ active, payload, label, tokens, formatter }) => {
  if (!active || !payload?.length) return null;
  
  return (
    <Box sx={{
      background: tokens.bgSubtle,
      border: `1px solid ${tokens.border}`,
      borderRadius: '12px',
      p: 1.5,
      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      backdropFilter: 'blur(8px)',
    }}>
      <Typography sx={{ 
        fontSize: '0.7rem', 
        color: tokens.textTertiary, 
        mb: 0.5,
        fontFamily: FONT_FAMILY,
        fontWeight: 500,
      }}>
        {label || payload[0]?.name}
      </Typography>
      {payload.map((entry, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: entry.color || entry.payload?.fill }} />
          <Typography sx={{ 
            fontSize: '0.8rem', 
            fontWeight: 600, 
            color: tokens.textPrimary,
            ...NUMBER_STYLE,
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
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
      <Box sx={{ position: 'relative', width: { xs: 60, sm: 68 }, height: { xs: 60, sm: 68 } }}>
        <svg width="100%" height="100%" viewBox="0 0 64 64" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="32" cy="32" r="26" fill="none" stroke={tokens.border} strokeWidth="5" />
          <circle
            cx="32" cy="32" r="26" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
        </svg>
        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography sx={{
            fontSize: { xs: '0.9375rem', sm: '1.0625rem' },
            fontWeight: 600,
            color: tokens.textPrimary,
            letterSpacing: '-0.02em',
            ...NUMBER_STYLE,
          }}>
            {value}%
          </Typography>
        </Box>
      </Box>
      <Typography sx={{
        fontSize: { xs: '0.5625rem', sm: '0.625rem' },
        fontWeight: 500,
        color: tokens.textTertiary,
        textAlign: 'center',
        lineHeight: 1.3,
        textTransform: 'uppercase',
        letterSpacing: '0.03em',
        fontFamily: FONT_FAMILY,
      }}>
        {label}
      </Typography>
    </Box>
  );
};

// Distribution metric item for the combined card
const DistributionMetricItem = ({ title, subtitle, data, tokens }) => {
  const normalizedData = data.map(item => ({
    name: item.name || item.type || item.procedure,
    value: item.value ?? item.count ?? item.revenue ?? 0
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
          fontFamily: FONT_FAMILY,
          lineHeight: 1.2,
        }}>
          {title}
        </Typography>
        <Typography sx={{
          fontSize: { xs: '0.6875rem', sm: '0.75rem' },
          color: tokens.textTertiary,
          fontFamily: FONT_FAMILY,
          lineHeight: 1.2,
          mt: 0.125,
        }}>
          {subtitle}
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', height: 5, borderRadius: 6, overflow: 'hidden' }}>
        {normalizedData.map((item, index) => (
          <Box key={index} sx={{ 
            width: `${(item.value / total) * 100}%`, 
            background: `linear-gradient(90deg, ${colors[index % colors.length]}, ${colors[index % colors.length]}dd)`,
            transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)' 
          }} />
        ))}
      </Box>
      
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {normalizedData.map((item, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '4px', background: colors[index % colors.length], flexShrink: 0 }} />
            <Typography sx={{ fontSize: { xs: '0.75rem', sm: '0.8125rem' }, color: tokens.textSecondary, fontFamily: FONT_FAMILY }}>
              {item.name}: <span style={{ fontWeight: 600, color: tokens.textPrimary, ...NUMBER_STYLE }}>{typeof item.value === 'number' && item.value > 1000 ? `$${(item.value/1000).toFixed(0)}k` : item.value}</span>
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
      border: `1px solid ${tokens.border}`,
      borderRadius: '16px',
      p: { xs: 1.5, sm: 2, md: 2.5 },
      minHeight: { xs: 120, sm: 140, md: 160 },
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
              <linearGradient id={`spark-rev-${label.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={sparklineColor} stopOpacity={0.3} />
                <stop offset="100%" stopColor={sparklineColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey="v" 
              stroke={sparklineColor}
              strokeWidth={1.5}
              fill={`url(#spark-rev-${label.replace(/\s/g, '')})`}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>

      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography sx={{
          fontSize: { xs: '0.625rem', sm: '0.6875rem' },
          fontWeight: 500,
          color: tokens.textTertiary,
          letterSpacing: '0.04em',
          mb: { xs: 0.5, sm: 1 },
          textTransform: 'uppercase',
          fontFamily: FONT_FAMILY,
        }}>
          {label}
        </Typography>

        {loading ? (
          <Skeleton variant="text" width="60%" height={36} sx={{ bgcolor: tokens.border, borderRadius: '8px' }} />
        ) : (
          <Typography sx={{
            fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.875rem' },
            fontWeight: 600,
            color: tokens.textPrimary,
            letterSpacing: '-0.03em',
            lineHeight: 1,
            ...NUMBER_STYLE,
          }}>
            {value}
          </Typography>
        )}
      </Box>

      {!loading && (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 0.75, 
          position: 'relative', 
          zIndex: 1,
          flexWrap: 'wrap',
        }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.375,
            px: 0.875,
            py: 0.375,
            borderRadius: '8px',
            background: isPositive ? tokens.accentMuted : 'rgba(239,68,68,0.1)',
          }}>
            <Typography sx={{
              fontSize: { xs: '0.625rem', sm: '0.6875rem' },
              fontWeight: 600,
              color: isPositive ? tokens.accent : '#ef4444',
              ...NUMBER_STYLE,
            }}>
              {isPositive ? '↑' : '↓'} {Math.abs(change)}%
            </Typography>
          </Box>
          <Typography sx={{
            fontSize: { xs: '0.5625rem', sm: '0.625rem' },
            color: tokens.textTertiary,
            display: { xs: 'none', sm: 'block' },
            fontFamily: FONT_FAMILY,
            fontWeight: 500,
          }}>
            {changeLabel}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

// Donut Chart Component for Payment Plans
const DonutChart = ({ data, tokens, centerLabel, centerValue, cardHoverStyle }) => {
  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];
  const normalizedData = data.map(item => ({
    name: item.name,
    value: item.value ?? item.count ?? 0
  }));
  
  return (
    <Box sx={{
      background: tokens.bgSubtle,
      border: `1px solid ${tokens.border}`,
      borderRadius: '16px',
      p: { xs: 1.5, sm: 2 },
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      ...cardHoverStyle,
    }}>
      <Typography sx={{
        fontSize: '0.6875rem',
        fontWeight: 500,
        color: tokens.textTertiary,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        mb: { xs: 1, sm: 1.5 },
        fontFamily: FONT_FAMILY,
      }}>
        Payment Plans
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
        <Box sx={{ position: 'relative', width: { xs: 120, sm: 140 }, height: { xs: 120, sm: 140 } }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={normalizedData}
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="85%"
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {normalizedData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip tokens={tokens} />} />
            </PieChart>
          </ResponsiveContainer>
          {centerLabel && (
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <Typography sx={{ fontSize: { xs: '1.125rem', sm: '1.25rem' }, fontWeight: 600, color: tokens.textPrimary, ...NUMBER_STYLE }}>
                {centerValue}
              </Typography>
              <Typography sx={{ fontSize: '0.5625rem', color: tokens.textTertiary, fontFamily: FONT_FAMILY }}>
                {centerLabel}
              </Typography>
            </Box>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {normalizedData.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '4px', background: COLORS[index % COLORS.length], flexShrink: 0 }} />
              <Typography sx={{ fontSize: '0.75rem', color: tokens.textSecondary, fontFamily: FONT_FAMILY }}>
                {item.name}: <span style={{ fontWeight: 600, color: tokens.textPrimary, ...NUMBER_STYLE }}>{item.value}</span>
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
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

const RevenueAnalytics = () => {
  const { isDarkMode } = useTheme();
  const { charts, summary, loading } = useSelector((state) => state.metrics);
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
    accent: '#10b981',
    accentMuted: isDarkMode ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16,185,129,0.1)',
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
      transform: 'translateY(-2px)',
      boxShadow: isDarkMode 
        ? '0 8px 32px rgba(59, 131, 246, 0.15)'
        : '0 8px 32px rgba(59, 131, 246, 0.1)',
    },
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount}`;
  };

  // Calculate metrics
  const totalRevenue = summary?.totalRevenue || 0;
  const avgRevenue = charts.monthlyRevenue?.length > 0 
    ? Math.round(charts.monthlyRevenue.reduce((sum, d) => sum + d.revenue, 0) / charts.monthlyRevenue.length)
    : 0;

  // KPI stats with sparklines
  const kpiStats = [
    { label: 'Total Revenue', value: formatCurrency(totalRevenue) || '$248K', change: 12.5, changeLabel: 'vs last month', sparklineData: generateSparkline('up'), sparklineColor: categoryColors.green },
    { label: 'Avg Monthly', value: formatCurrency(avgRevenue) || '$42K', change: 8.3, changeLabel: 'vs last month', sparklineData: generateSparkline('up'), sparklineColor: categoryColors.blue },
    { label: 'Growth Rate', value: '18.5%', change: 5.2, changeLabel: 'vs last quarter', sparklineData: generateSparkline('up'), sparklineColor: categoryColors.purple },
    { label: 'Profit Margin', value: '34.2%', change: 2.8, changeLabel: 'vs last month', sparklineData: generateSparkline('up'), sparklineColor: categoryColors.orange },
  ];

  // Monthly revenue data
  const monthlyRevenueData = charts.monthlyRevenue?.length > 0 
    ? charts.monthlyRevenue 
    : [
        { month: 'Jan', revenue: 32000 },
        { month: 'Feb', revenue: 38000 },
        { month: 'Mar', revenue: 35000 },
        { month: 'Apr', revenue: 42000 },
        { month: 'May', revenue: 48000 },
        { month: 'Jun', revenue: 53000 },
      ];

  // Procedure revenue data
  const procedureRevenueData = charts.procedurePrimary?.length > 0 
    ? charts.procedurePrimary 
    : [
        { name: 'Crowns', value: 45000 },
        { name: 'Implants', value: 38000 },
        { name: 'Cleanings', value: 28000 },
        { name: 'Fillings', value: 22000 },
        { name: 'Whitening', value: 15000 },
      ];

  // Payment plan data
  const paymentPlanData = charts.paymentPlan?.length > 0 
    ? charts.paymentPlan 
    : [
        { name: 'Discussed', value: 156 },
        { name: 'Not Discussed', value: 89 },
      ];

  const totalPaymentPlans = paymentPlanData.reduce((sum, d) => sum + (d.value ?? 0), 0);

  return (
    <Box sx={{ 
      minHeight: '100vh',
      width: '100%',
      background: isDarkMode 
        ? 'linear-gradient(135deg, rgba(9, 9, 11, 0.57) 0%, rgba(24, 24, 27, 0.47) 50%, rgba(9, 9, 11, 0.37) 100%)'
        : 'linear-gradient(135deg, rgba(250,250,250,0.57) 0%, rgba(255,255,255,0.47) 50%, rgba(250,250,250,0.37) 100%)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      fontFamily: FONT_FAMILY,
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
                fontFamily: FONT_FAMILY,
              }}
            >
              Revenue Analytics
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

        {/* Monthly Revenue (left) + Key Metrics & Payment Plans (right) */}
        <Fade in={mounted} timeout={1000}>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', lg: '3fr 2fr' }, 
            gap: { xs: 2, sm: 2 },
            mb: { xs: 2, sm: 3 },
          }}>
            {/* Monthly Revenue Trend - Left */}
            <Box sx={{
              background: tokens.bgSubtle,
              border: `1px solid ${tokens.border}`,
              borderRadius: '16px',
              overflow: 'hidden',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
                  fontFamily: FONT_FAMILY,
                }}>
                  Monthly Revenue Trend
                </Typography>
                <Typography sx={{ 
                  fontSize: '0.6875rem', 
                  color: tokens.textTertiary,
                  fontFamily: FONT_FAMILY,
                }}>
                  Revenue performance over time
                </Typography>
              </Box>

              {/* Chart Content */}
              <Box sx={{ p: { xs: 1.5, sm: 2 }, height: { xs: 320, sm: 380, md: 420, lg: 460 } }}>
                {loading ? (
                  <Skeleton variant="rectangular" width="100%" height="100%" sx={{ borderRadius: '12px', bgcolor: tokens.border }} />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyRevenueData}>
                      <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                          <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke={gridColor} strokeDasharray="none" vertical={false} />
                      <XAxis 
                        dataKey="month" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fill: tokens.textTertiary, fontFamily: FONT_FAMILY }} 
                        dy={8}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fill: tokens.textTertiary, fontFamily: FONT_FAMILY, fontFeatureSettings: '"tnum" 1' }}
                        tickFormatter={(v) => `$${v/1000}k`}
                        dx={-5}
                        width={40}
                      />
                      <Tooltip content={<CustomTooltip tokens={tokens} formatter={(v) => `$${v.toLocaleString()}`} />} />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#10b981" 
                        strokeWidth={2} 
                        fill="url(#revenueGradient)" 
                        dot={false}
                        activeDot={{ r: 5, fill: '#10b981', stroke: tokens.bgSubtle, strokeWidth: 2 }} 
                      />
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
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 3, borderRadius: 2, background: '#10b981' }} />
                  <Typography sx={{ fontSize: '0.6875rem', color: tokens.textSecondary, fontFamily: FONT_FAMILY }}>
                    Monthly Revenue
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Right Column - Key Metrics + Payment Plans Donut */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: { xs: 2, sm: 2 },
            }}>
              {/* Key Metrics - Revenue by Procedure */}
              <Box sx={{
                background: tokens.bgSubtle,
                border: `1px solid ${tokens.border}`,
                borderRadius: '16px',
                p: { xs: 1.5, sm: 2 },
                flex: { xs: 'none', lg: '1 1 auto' },
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                ...cardHoverStyle,
              }}>
                <Typography sx={{
                  fontSize: '0.6875rem',
                  fontWeight: 500,
                  color: tokens.textTertiary,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  mb: { xs: 1.5, sm: 2 },
                  flexShrink: 0,
                  fontFamily: FONT_FAMILY,
                }}>
                  Revenue Breakdown
                </Typography>

                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  flex: 1,
                  gap: { xs: 2, sm: 2.5 },
                }}>
                  <DistributionMetricItem 
                    title="By Procedure" 
                    subtitle="Top performing procedures" 
                    data={procedureRevenueData} 
                    tokens={tokens} 
                  />
                  <DistributionMetricItem 
                    title="By Source" 
                    subtitle="Revenue by patient source" 
                    data={[
                      { name: 'Existing', value: 156000 },
                      { name: 'New', value: 92000 },
                    ]} 
                    tokens={tokens} 
                  />
                  <DistributionMetricItem 
                    title="By Insurance" 
                    subtitle="Insurance vs Self-pay" 
                    data={[
                      { name: 'Insurance', value: 178000 },
                      { name: 'Self-pay', value: 70000 },
                    ]} 
                    tokens={tokens} 
                  />
                </Box>
              </Box>

              {/* Payment Plans Donut Chart */}
              <DonutChart 
                data={paymentPlanData}
                tokens={tokens}
                centerLabel="Total"
                centerValue={totalPaymentPlans}
                cardHoverStyle={cardHoverStyle}
              />
            </Box>
          </Box>
        </Fade>

        {/* Revenue Overview Rings - Full Width */}
        <Fade in={mounted} timeout={1200}>
          <Box sx={{
            background: tokens.bgSubtle,
            border: `1px solid ${tokens.border}`,
            borderRadius: '16px',
            p: { xs: 1.5, sm: 2, md: 3 },
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            ...cardHoverStyle,
          }}>
            <Typography sx={{
              fontSize: '0.6875rem',
              fontWeight: 500,
              color: tokens.textTertiary,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              mb: { xs: 2, sm: 3 },
              fontFamily: FONT_FAMILY,
            }}>
              Revenue Performance
            </Typography>

            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-around', 
              alignItems: 'center', 
              py: { xs: 1, sm: 2 },
              flexWrap: 'wrap',
              gap: 3,
            }}>
              <PerformanceRing value={92} label="Collection Rate" color={categoryColors.green} tokens={tokens} />
              <PerformanceRing value={78} label="Target Progress" color={categoryColors.blue} tokens={tokens} />
              <PerformanceRing value={85} label="Growth vs Goal" color={categoryColors.purple} tokens={tokens} />
              <PerformanceRing value={96} label="Payment Success" color={categoryColors.orange} tokens={tokens} />
            </Box>
          </Box>
        </Fade>
      </Box>
    </Box>
  );
};

export default RevenueAnalytics;