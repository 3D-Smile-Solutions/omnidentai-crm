// src/components/Dashboard/components/Overview/OverviewMetrics.jsx
import React from 'react';
import { Box, Typography, Skeleton } from '@mui/material';
import { useSelector } from 'react-redux';
import { useTheme } from '../../../../context/ThemeContext';
import { 
  ArrowUpward,
  ArrowDownward,
  PersonAdd,
  AccessTime,
  CheckCircleOutline,
  EventNote,
} from '@mui/icons-material';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
} from 'recharts';

// Font family constant - Roboto for clean, professional look
const FONT_FAMILY = '"Roboto", -apple-system, BlinkMacSystemFont, sans-serif';

// Mini sparkline data generator
const generateSparkline = (trend = 'up', points = 12) => {
  const base = trend === 'up' ? 40 : 60;
  const direction = trend === 'up' ? 1 : -1;
  return Array.from({ length: points }, (_, i) => ({
    v: base + (direction * i * 2) + (Math.random() * 15 - 7.5)
  }));
};

// Primary KPI Card
const KPICard = ({ label, value, change, changeLabel, sparklineData, sparklineColor, loading, tokens, isDarkMode }) => {
  const isPositive = change >= 0;
  
  return (
    <Box sx={{
      background: tokens.bgSubtle,
      border: `1px solid ${tokens.border}`,
      borderRadius: '14px',
      p: { xs: 1.5, sm: 2, md: 2.5 },
      minHeight: { xs: 120, sm: 140, md: 160 },
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      transition: 'all 0.3s ease',
      '&:hover': {
        background: isDarkMode 
        ? 'linear-gradient(180deg, rgba(59, 131, 246, 0.90) 0%, rgba(34, 47, 66, 0.9) 50%, rgba(24, 24, 27, 0.90) 100%)'
          : 'linear-gradient(180deg, rgba(59, 187, 246, 0.9) 0%, rgba(255, 255, 255, 0.90) 100%)',
        transform: 'translateY(-2px)',
        boxShadow: isDarkMode 
          ? '0 8px 32px rgba(59, 131, 246, 0.15)'
          : '0 8px 32px rgba(59, 131, 246, 0.1)',
      },
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
              <linearGradient id={`spark-${label.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={sparklineColor} stopOpacity={0.3} />
                <stop offset="100%" stopColor={sparklineColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey="v" 
              stroke={sparklineColor}
              strokeWidth={1.5}
              fill={`url(#spark-${label.replace(/\s/g, '')})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>

      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography sx={{
          fontSize: { xs: '0.625rem', sm: '0.6875rem' },
          fontWeight: 600,
          color: tokens.textTertiary,
          letterSpacing: '0.06em',
          mb: { xs: 0.5, sm: 1 },
          textTransform: 'uppercase',
          fontFamily: FONT_FAMILY,
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
            letterSpacing: '-0.035em',
            lineHeight: 1,
            fontFamily: FONT_FAMILY,
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
            px: 0.75,
            py: 0.25,
            borderRadius: '6px',
            background: isPositive ? tokens.accentMuted : 'rgba(239,68,68,0.1)',
          }}>
            {isPositive ? (
              <ArrowUpward sx={{ fontSize: { xs: 10, sm: 12 }, color: tokens.accent }} />
            ) : (
              <ArrowDownward sx={{ fontSize: { xs: 10, sm: 12 }, color: '#ef4444' }} />
            )}
            <Typography sx={{
              fontSize: { xs: '0.625rem', sm: '0.6875rem' },
              fontWeight: 600,
              color: isPositive ? tokens.accent : '#ef4444',
              fontFamily: FONT_FAMILY,
            }}>
              {Math.abs(change)}%
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

// Secondary Metric Item
const SecondaryMetricItem = ({ icon: Icon, label, value, target, loading, color, tokens }) => {
  const progress = target ? Math.min((parseFloat(value) / target) * 100, 100) : 0;
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 } }}>
      <Box sx={{
        width: { xs: 38, sm: 42 },
        height: { xs: 38, sm: 42 },
        borderRadius: '12px',
        background: `${color}15`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon sx={{ fontSize: { xs: 18, sm: 20 }, color: color }} />
      </Box>
      
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 0.5 }}>
          <Typography sx={{
            fontSize: { xs: '0.75rem', sm: '0.8125rem' },
            fontWeight: 500,
            color: tokens.textSecondary,
            fontFamily: FONT_FAMILY,
          }}>
            {label}
          </Typography>
          {target && (
            <Typography sx={{
              fontSize: { xs: '0.5625rem', sm: '0.625rem' },
              color: tokens.textTertiary,
              display: { xs: 'none', sm: 'block' },
              fontFamily: FONT_FAMILY,
              fontWeight: 500,
            }}>
              Target: {target}
            </Typography>
          )}
        </Box>

        {loading ? (
          <Skeleton variant="text" width="40%" height={24} sx={{ bgcolor: tokens.border }} />
        ) : (
          <>
            <Typography sx={{
              fontSize: { xs: '1.125rem', sm: '1.25rem' },
              fontWeight: 700,
              color: tokens.textPrimary,
              letterSpacing: '-0.025em',
              lineHeight: 1,
              mb: 0.5,
              fontFamily: FONT_FAMILY,
            }}>
              {value}
            </Typography>

            <Box sx={{
              height: 4,
              borderRadius: 4,
              background: tokens.border,
              overflow: 'hidden',
            }}>
              <Box sx={{
                height: '100%',
                width: `${progress}%`,
                borderRadius: 4,
                background: color,
                transition: 'width 0.6s ease',
              }} />
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

// AI Performance Ring
const PerformanceRing = ({ value, label, color, tokens }) => {
  const circumference = 2 * Math.PI * 26;
  const offset = circumference - (value / 100) * circumference;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.75 }}>
      <Box sx={{ position: 'relative', width: { xs: 58, sm: 66 }, height: { xs: 58, sm: 66 } }}>
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
            fontSize: { xs: '0.875rem', sm: '1rem' },
            fontWeight: 700,
            color: tokens.textPrimary,
            letterSpacing: '-0.02em',
            fontFamily: FONT_FAMILY,
          }}>
            {value}%
          </Typography>
        </Box>
      </Box>
      <Typography sx={{
        fontSize: { xs: '0.5625rem', sm: '0.625rem' },
        fontWeight: 600,
        color: tokens.textTertiary,
        textAlign: 'center',
        lineHeight: 1.2,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        fontFamily: FONT_FAMILY,
      }}>
        {label}
      </Typography>
    </Box>
  );
};

const OverviewMetrics = ({ tokens, renderQuickAnalytics }) => {
  const { isDarkMode } = useTheme();
  const { summary, loading } = useSelector((state) => state.metrics);

  // Category colors matching Forms/Reports
  const categoryColors = {
    green: '#10b981',
    blue: '#3b82f6',
    purple: '#8b5cf6',
    orange: '#f59e0b',
  };

  const formatCurrency = (amount) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
  };

  const primaryKPIs = [
    { label: 'Total Revenue', value: formatCurrency(summary.totalRevenue || 0), change: 12.5, changeLabel: 'vs last month', sparklineData: generateSparkline('up'), sparklineColor: categoryColors.green },
    { label: 'Appointments', value: summary.totalBookings || '0', change: 8.3, changeLabel: 'vs last month', sparklineData: generateSparkline('up'), sparklineColor: categoryColors.blue },
    { label: 'Conversations', value: summary.totalConversations || '0', change: -2.1, changeLabel: 'vs last week', sparklineData: generateSparkline('down'), sparklineColor: categoryColors.purple },
    { label: 'Conversion', value: '24.8%', change: 5.2, changeLabel: 'vs last month', sparklineData: generateSparkline('up'), sparklineColor: categoryColors.orange },
  ];

  const secondaryMetrics = [
    { icon: PersonAdd, label: 'New Patients', value: '24', target: 30, color: categoryColors.green },
    { icon: AccessTime, label: 'Response Time', value: `${summary.avgSessionDuration || 0}m`, target: 5, color: categoryColors.orange },
    { icon: CheckCircleOutline, label: 'Cases Resolved', value: '156', target: 200, color: categoryColors.blue },
    { icon: EventNote, label: 'Scheduled Today', value: '12', target: 15, color: categoryColors.purple },
  ];

  // Gradient hover style for cards - half blue, half transparent
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

  return (
    <Box>
      {/* 4 Primary KPIs */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
        gap: { xs: 1.5, sm: 2 },
        mb: { xs: 2, sm: 3 },
      }}>
        {primaryKPIs.map((kpi, index) => (
          <KPICard key={index} {...kpi} loading={loading} tokens={tokens} isDarkMode={isDarkMode} />
        ))}
      </Box>

      {/* Quick Analytics | Secondary Metrics + AI Performance */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', lg: '3fr 2fr' }, 
        gap: { xs: 2, sm: 2 },
      }}>
        <Box sx={{ height: { xs: 320, sm: 380, md: 440, lg: 500 }, minHeight: { xs: 300, lg: 'auto' } }}>
          {renderQuickAnalytics && renderQuickAnalytics()}
        </Box>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: { xs: 2, sm: 2 },
        }}>
          {/* Key Metrics */}
          <Box sx={{
            background: tokens.bgSubtle,
            border: `1px solid ${tokens.border}`,
            borderRadius: '14px',
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
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              mb: { xs: 1.5, sm: 2 },
              flexShrink: 0,
              fontFamily: FONT_FAMILY,
            }}>
              Key Metrics
            </Typography>

            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              flex: 1,
              gap: { xs: 1.5, sm: 2 },
            }}>
              {secondaryMetrics.map((metric, index) => (
                <SecondaryMetricItem key={index} {...metric} loading={loading} tokens={tokens} />
              ))}
            </Box>
          </Box>

          {/* AI Performance */}
          <Box sx={{
            background: tokens.bgSubtle,
            border: `1px solid ${tokens.border}`,
            borderRadius: '14px',
            p: { xs: 1.5, sm: 2 },
            flexShrink: 0,
            transition: 'all 0.3s ease',
            ...cardHoverStyle,
          }}>
            <Typography sx={{
              fontSize: '0.6875rem',
              fontWeight: 600,
              color: tokens.textTertiary,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              mb: { xs: 1, sm: 1.5 },
              fontFamily: FONT_FAMILY,
            }}>
              AI Performance
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', py: { xs: 0.5, sm: 1 } }}>
              <PerformanceRing value={87} label="AI Handled" color={categoryColors.green} tokens={tokens} />
              <PerformanceRing value={94} label="Resolution" color={categoryColors.blue} tokens={tokens} />
              <PerformanceRing value={92} label="Satisfaction" color={categoryColors.purple} tokens={tokens} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default OverviewMetrics;