// src/components/Dashboard/components/Analytics/PatientAnalytics.jsx
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
        {label || payload[0]?.name}
      </Typography>
      {payload.map((entry, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: entry.color || entry.payload?.fill }} />
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
  const normalizedData = data.map(item => ({
    name: item.name || item.type || item.outcome || item.channel || item.provider,
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
              <linearGradient id={`spark-patient-${label.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={sparklineColor} stopOpacity={0.3} />
                <stop offset="100%" stopColor={sparklineColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey="v" 
              stroke={sparklineColor}
              strokeWidth={1.5}
              fill={`url(#spark-patient-${label.replace(/\s/g, '')})`}
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

// Donut Chart Component
const DonutChart = ({ data, tokens, centerLabel, centerValue, cardHoverStyle, isDarkMode }) => {
  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];
  const normalizedData = data.map(item => ({
    name: item.name || item.type,
    value: item.value ?? item.count ?? 0
  }));
  
  return (
    <Box sx={{
      background: tokens.bgSubtle,
      border: `0px solid ${tokens.border}`,
      borderRadius: '12px',
      p: { xs: 1.5, sm: 2 },
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
        Patient Types
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
              <Typography sx={{ fontSize: { xs: '1.125rem', sm: '1.25rem' }, fontWeight: 700, color: tokens.textPrimary, fontFamily: '"DM Sans", system-ui, sans-serif' }}>
                {centerValue}
              </Typography>
              <Typography sx={{ fontSize: '0.5625rem', color: tokens.textTertiary, fontFamily: '"DM Sans", system-ui, sans-serif' }}>
                {centerLabel}
              </Typography>
            </Box>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {normalizedData.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: 1.5, background: COLORS[index % COLORS.length], flexShrink: 0 }} />
              <Typography sx={{ fontSize: '0.75rem', color: tokens.textSecondary, fontFamily: '"DM Sans", system-ui, sans-serif' }}>
                {item.name}: <span style={{ fontWeight: 700, color: tokens.textPrimary }}>{item.value}</span>
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

const PatientAnalytics = () => {
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
    accent: '#f59e0b',
    accentMuted: isDarkMode ? 'rgba(245, 158, 11, 0.15)' : 'rgba(245,158,11,0.1)',
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

  // Calculate metrics
  const totalPatients = (charts.patientType || []).reduce((sum, d) => sum + (d.value ?? d.count ?? 0), 0);
  const newPatients = charts.patientType?.find(d => d.name === 'New')?.value || 0;
  const returningPatients = charts.patientType?.find(d => d.name === 'Returning')?.value || 0;
  
  const caseAccepted = charts.caseAccepted?.find(d => d.name === 'Accepted')?.value || 0;
  const caseTotal = (charts.caseAccepted || []).reduce((sum, d) => sum + (d.value ?? 0), 0);
  const acceptanceRate = caseTotal > 0 ? Math.round((caseAccepted / caseTotal) * 100) : 0;

  // KPI stats with sparklines
  const kpiStats = [
    { label: 'Total Patients', value: totalPatients || '1,247', change: 8.5, changeLabel: 'vs last month', sparklineData: generateSparkline('up'), sparklineColor: categoryColors.orange },
    { label: 'New Patients', value: newPatients || '312', change: 12.3, changeLabel: 'vs last month', sparklineData: generateSparkline('up'), sparklineColor: categoryColors.green },
    { label: 'Returning', value: returningPatients || '935', change: 6.2, changeLabel: 'vs last month', sparklineData: generateSparkline('up'), sparklineColor: categoryColors.blue },
    { label: 'Acceptance Rate', value: `${acceptanceRate || 76}%`, change: 4.8, changeLabel: 'vs last month', sparklineData: generateSparkline('up'), sparklineColor: categoryColors.purple },
  ];

  // Patient type data
  const patientTypeData = charts.patientType?.length > 0 
    ? charts.patientType 
    : [
        { name: 'New', value: 312 },
        { name: 'Returning', value: 935 },
      ];

  // Treatment plan data
  const treatmentPlanData = charts.treatmentPlan?.length > 0 
    ? charts.treatmentPlan 
    : [
        { name: 'Presented', value: 245 },
        { name: 'Accepted', value: 189 },
        { name: 'Declined', value: 56 },
      ];

  // Case acceptance data
  const caseAcceptanceData = charts.caseAccepted?.length > 0 
    ? charts.caseAccepted 
    : [
        { name: 'Accepted', value: 189 },
        { name: 'Pending', value: 34 },
        { name: 'Declined', value: 22 },
      ];

  // Insurance mentioned data
  const insuranceMentionedData = charts.insuranceMentioned?.length > 0 
    ? charts.insuranceMentioned 
    : [
        { name: 'Mentioned', value: 423 },
        { name: 'Not Mentioned', value: 312 },
      ];

  // Insurance provider data
  const insuranceProviderData = charts.insuranceProvider?.length > 0 
    ? charts.insuranceProvider 
    : [
        { provider: 'Delta Dental', count: 156 },
        { provider: 'Cigna', count: 134 },
        { provider: 'Aetna', count: 98 },
        { provider: 'MetLife', count: 87 },
        { provider: 'Guardian', count: 65 },
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
              Patient Analytics
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

        {/* Insurance Providers (left) + Key Metrics & Patient Overview (right) */}
        <Fade in={mounted} timeout={1000}>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', lg: '3fr 2fr' }, 
            gap: { xs: 2, sm: 2 },
            mb: { xs: 2, sm: 3 },
          }}>
            {/* Insurance Providers - Left */}
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
                  Insurance Providers
                </Typography>
                <Typography sx={{ 
                  fontSize: '0.6875rem', 
                  color: tokens.textTertiary,
                }}>
                  Most common carriers by patient count
                </Typography>
              </Box>

              {/* Chart Content */}
              <Box sx={{ p: { xs: 1.5, sm: 2 }, height: { xs: 320, sm: 380, md: 420, lg: 460 } }}>
                {loading ? (
                  <Skeleton variant="rectangular" width="100%" height="100%" sx={{ borderRadius: 2, bgcolor: tokens.border }} />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={insuranceProviderData}>
                      <defs>
                        <linearGradient id="insuranceGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.2} />
                          <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke={gridColor} strokeDasharray="none" vertical={false} />
                      <XAxis 
                        dataKey="provider" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 9, fill: tokens.textTertiary }} 
                        dy={8}
                        interval={0}
                        angle={-20}
                        textAnchor="end"
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
                        stroke="#f59e0b" 
                        strokeWidth={2} 
                        fill="url(#insuranceGradient)" 
                        dot={{ r: 4, fill: '#f59e0b', stroke: tokens.bgSubtle, strokeWidth: 2 }}
                        activeDot={{ r: 6, fill: '#f59e0b', stroke: tokens.bgSubtle, strokeWidth: 2 }} 
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
                  <Box sx={{ width: 12, height: 3, borderRadius: 1, background: '#f59e0b' }} />
                  <Typography sx={{ fontSize: '0.6875rem', color: tokens.textSecondary, fontFamily: '"DM Sans", system-ui, sans-serif' }}>
                    Patient Count
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Right Column - Key Metrics + Patient Types Donut */}
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
                    title="Treatment Plans" 
                    subtitle="Plans presented to patients" 
                    data={treatmentPlanData} 
                    tokens={tokens} 
                  />
                  <DistributionMetricItem 
                    title="Case Acceptance" 
                    subtitle="Acceptance rate for cases" 
                    data={caseAcceptanceData} 
                    tokens={tokens} 
                  />
                  <DistributionMetricItem 
                    title="Insurance Discussions" 
                    subtitle="Conversations mentioning insurance" 
                    data={insuranceMentionedData} 
                    tokens={tokens} 
                  />
                </Box>
              </Box>

              {/* Patient Types Donut Chart */}
              <DonutChart 
                data={patientTypeData}
                tokens={tokens}
                centerLabel="Total"
                centerValue={totalPatients || 1247}
                cardHoverStyle={cardHoverStyle}
                isDarkMode={isDarkMode}
              />
            </Box>
          </Box>
        </Fade>

        {/* Patient Overview Rings - Full Width */}
        <Fade in={mounted} timeout={1200}>
          <Box sx={{
            background: tokens.bgSubtle,
            border: `0px solid ${tokens.border}`,
            borderRadius: '12px',
            p: { xs: 1.5, sm: 2, md: 3 },
            transition: 'all 0.3s ease',
            ...cardHoverStyle,
          }}>
            <Typography sx={{
              fontSize: '0.6875rem',
              fontWeight: 600,
              color: tokens.textTertiary,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              mb: { xs: 2, sm: 3 },
              fontFamily: '"DM Sans", system-ui, sans-serif',
            }}>
              Patient Overview
            </Typography>

            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-around', 
              alignItems: 'center', 
              py: { xs: 1, sm: 2 },
              flexWrap: 'wrap',
              gap: 3,
            }}>
              <PerformanceRing value={76} label="Case Acceptance" color={categoryColors.green} tokens={tokens} />
              <PerformanceRing value={89} label="Treatment Complete" color={categoryColors.blue} tokens={tokens} />
              <PerformanceRing value={94} label="Patient Satisfaction" color={categoryColors.purple} tokens={tokens} />
              <PerformanceRing value={82} label="Retention Rate" color={categoryColors.orange} tokens={tokens} />
            </Box>
          </Box>
        </Fade>
      </Box>
    </Box>
  );
};

export default PatientAnalytics;