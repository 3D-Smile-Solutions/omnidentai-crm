// src/components/Dashboard/components/Analytics/AIPerformanceAnalytics.jsx
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
        {label}
      </Typography>
      {payload.map((entry, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: entry.color }} />
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

// Distribution metric item for the combined card (like SecondaryMetricItem)
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
              {item.name}: <span style={{ fontWeight: 600, color: tokens.textPrimary, ...NUMBER_STYLE }}>{item.value}</span>
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

// Stat card with sparkline background matching KPICard from OverviewMetrics
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
              <linearGradient id={`spark-ai-${label.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={sparklineColor} stopOpacity={0.3} />
                <stop offset="100%" stopColor={sparklineColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey="v" 
              stroke={sparklineColor}
              strokeWidth={1.5}
              fill={`url(#spark-ai-${label.replace(/\s/g, '')})`}
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

// Generate sparkline data
const generateSparkline = (trend = 'up', points = 12) => {
  const base = trend === 'up' ? 40 : 60;
  const direction = trend === 'up' ? 1 : -1;
  return Array.from({ length: points }, (_, i) => ({
    v: base + (direction * i * 2) + (Math.random() * 15 - 7.5)
  }));
};

const AIPerformanceAnalytics = () => {
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
    accent: '#10b981',
    accentMuted: isDarkMode ? 'rgba(44, 185, 16, 0.15)' : 'rgba(16,185,129,0.1)',
  };

  const gridColor = isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';

  // Category colors
  const categoryColors = {
    green: '#10b981',
    blue: '#3b82f6',
    purple: '#8b5cf6',
    orange: '#f59e0b',
  };

  // Gradient hover style for cards - matching Overview exactly
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

  // Calculate performance metrics
  const aiHandled = charts.aiHandled?.find(d => d.name === 'AI Handled')?.value || 0;
  const manual = charts.aiHandled?.find(d => d.name === 'Manual')?.value || 0;
  const aiTotal = aiHandled + manual;
  const aiRate = aiTotal > 0 ? Math.round((aiHandled / aiTotal) * 100) : 0;

  const resolved = charts.conversationResolved?.find(d => d.name === 'Resolved')?.value || 0;
  const unresolved = charts.conversationResolved?.find(d => d.name === 'Unresolved')?.value || 0;
  const resolutionTotal = resolved + unresolved;
  const resolutionRate = resolutionTotal > 0 ? Math.round((resolved / resolutionTotal) * 100) : 0;

  const handoff = charts.humanHandoff?.find(d => d.name === 'Handed Off')?.value || 0;
  const noHandoff = charts.humanHandoff?.find(d => d.name === 'No Handoff')?.value || 0;
  const handoffTotal = handoff + noHandoff;
  const noHandoffRate = handoffTotal > 0 ? Math.round((noHandoff / handoffTotal) * 100) : 0;

  // KPI stats with sparklines
  const kpiStats = [
    { label: 'AI Handled Rate', value: `${aiRate}%`, change: 5.2, changeLabel: 'vs last month', sparklineData: generateSparkline('up'), sparklineColor: categoryColors.green },
    { label: 'Resolution Rate', value: `${resolutionRate}%`, change: 3.8, changeLabel: 'vs last month', sparklineData: generateSparkline('up'), sparklineColor: categoryColors.blue },
    { label: 'No Handoff Rate', value: `${noHandoffRate}%`, change: 2.1, changeLabel: 'vs last month', sparklineData: generateSparkline('up'), sparklineColor: categoryColors.purple },
    { label: 'Avg Response Time', value: '1.2s', change: -12.5, changeLabel: 'vs last month', sparklineData: generateSparkline('down'), sparklineColor: categoryColors.orange },
  ];

  // AI trend data
  const aiTrendData = [
    { period: 'W1', handled: 82, resolution: 89, satisfaction: 88 },
    { period: 'W2', handled: 85, resolution: 91, satisfaction: 90 },
    { period: 'W3', handled: 84, resolution: 92, satisfaction: 89 },
    { period: 'W4', handled: 87, resolution: 94, satisfaction: 92 },
    { period: 'W5', handled: 89, resolution: 93, satisfaction: 91 },
    { period: 'W6', handled: 91, resolution: 95, satisfaction: 93 },
  ];

  // Channel efficiency data (use Redux data or fallback to mock)
  const channelEfficiencyData = charts.avgMessagesByChannel?.length > 0 
    ? charts.avgMessagesByChannel 
    : [
        { channel: 'SMS', avgMessages: 4.2 },
        { channel: 'Web Chat', avgMessages: 6.8 },
        { channel: 'Voice', avgMessages: 3.1 },
        { channel: 'Email', avgMessages: 2.4 },
        { channel: 'WhatsApp', avgMessages: 5.5 },
      ];

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
              AI Performance
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

        {/* Channel Efficiency (left) + Key Metrics & Performance Overview (right) */}
        <Fade in={mounted} timeout={1000}>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', lg: '3fr 2fr' }, 
            gap: { xs: 2, sm: 2 },
            mb: { xs: 2, sm: 3 },
          }}>
            {/* Channel Efficiency - Left (like AI Performance Trend) */}
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
                  Channel Efficiency
                </Typography>
                <Typography sx={{ 
                  fontSize: '0.6875rem', 
                  color: tokens.textTertiary,
                  fontFamily: FONT_FAMILY,
                }}>
                  Average messages per conversation by channel
                </Typography>
              </Box>

              {/* Chart Content */}
              <Box sx={{ p: { xs: 1.5, sm: 2 }, height: { xs: 320, sm: 380, md: 420, lg: 460 } }}>
                {loading ? (
                  <Skeleton variant="rectangular" width="100%" height="100%" sx={{ borderRadius: '12px', bgcolor: tokens.border }} />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={channelEfficiencyData}>
                      <defs>
                        <linearGradient id="channelGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                          <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke={gridColor} strokeDasharray="none" vertical={false} />
                      <XAxis 
                        dataKey="channel" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fill: tokens.textTertiary, fontFamily: FONT_FAMILY }} 
                        dy={8}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fill: tokens.textTertiary, fontFamily: FONT_FAMILY, fontFeatureSettings: '"tnum" 1' }}
                        dx={-5}
                        width={30}
                      />
                      <Tooltip content={<CustomTooltip tokens={tokens} formatter={(v) => `${v} msgs`} />} />
                      <Area 
                        type="monotone" 
                        dataKey="avgMessages" 
                        stroke="#10b981" 
                        strokeWidth={2} 
                        fill="url(#channelGradient)" 
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
                    Avg Messages
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Right Column - Key Metrics + Performance Overview */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: { xs: 2, sm: 2 },
            }}>
              {/* Key Metrics (AI vs Manual, Human Handoff, Resolution Rate) */}
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
                    title="AI vs Manual" 
                    subtitle="Conversation handling" 
                    data={charts.aiHandled || []} 
                    tokens={tokens} 
                  />
                  <DistributionMetricItem 
                    title="Human Handoff" 
                    subtitle="Escalation rate" 
                    data={charts.humanHandoff || []} 
                    tokens={tokens} 
                  />
                  <DistributionMetricItem 
                    title="Resolution Rate" 
                    subtitle="Conversation outcomes" 
                    data={charts.conversationResolved || []} 
                    tokens={tokens} 
                  />
                </Box>
              </Box>

              {/* AI Performance Rings */}
              <Box sx={{
                background: tokens.bgSubtle,
                border: `1px solid ${tokens.border}`,
                borderRadius: '16px',
                p: { xs: 1.5, sm: 2 },
                flexShrink: 0,
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
                  Performance Overview
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', py: { xs: 0.5, sm: 1 } }}>
                  <PerformanceRing value={aiRate} label="AI Handled" color={categoryColors.green} tokens={tokens} />
                  <PerformanceRing value={resolutionRate} label="Resolution" color={categoryColors.blue} tokens={tokens} />
                  <PerformanceRing value={noHandoffRate} label="No Handoff" color={categoryColors.purple} tokens={tokens} />
                </Box>
              </Box>
            </Box>
          </Box>
        </Fade>

        {/* AI Performance Trend - Full Width */}
        <Fade in={mounted} timeout={1200}>
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
                AI Performance Trend
              </Typography>
              <Typography sx={{ 
                fontSize: '0.6875rem', 
                color: tokens.textTertiary,
                fontFamily: FONT_FAMILY,
              }}>
                Weekly performance metrics over time
              </Typography>
            </Box>

            {/* Chart */}
            <Box sx={{ p: { xs: 1.5, sm: 2 }, height: { xs: 280, sm: 320, md: 360 } }}>
              {loading ? (
                <Skeleton variant="rectangular" width="100%" height="100%" sx={{ borderRadius: '12px', bgcolor: tokens.border }} />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={aiTrendData}>
                    <defs>
                      <linearGradient id="handledGradientAI" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="resolutionGradientAI" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="satisfactionGradientAI" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke={gridColor} strokeDasharray="none" vertical={false} />
                    <XAxis 
                      dataKey="period"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: tokens.textTertiary, fontFamily: FONT_FAMILY }}
                      dy={8}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: tokens.textTertiary, fontFamily: FONT_FAMILY, fontFeatureSettings: '"tnum" 1' }}
                      domain={[70, 100]}
                      tickFormatter={(v) => `${v}%`}
                      dx={-5}
                      width={35}
                    />
                    <Tooltip content={<CustomTooltip tokens={tokens} formatter={(v) => `${v}%`} />} />
                    <Area type="monotone" dataKey="handled" stroke="#10b981" strokeWidth={2} fill="url(#handledGradientAI)" dot={false} activeDot={{ r: 5, fill: '#10b981', stroke: tokens.bgSubtle, strokeWidth: 2 }} />
                    <Area type="monotone" dataKey="resolution" stroke="#3b82f6" strokeWidth={2} fill="url(#resolutionGradientAI)" dot={false} activeDot={{ r: 5, fill: '#3b82f6', stroke: tokens.bgSubtle, strokeWidth: 2 }} />
                    <Area type="monotone" dataKey="satisfaction" stroke="#8b5cf6" strokeWidth={2} fill="url(#satisfactionGradientAI)" dot={false} activeDot={{ r: 5, fill: '#8b5cf6', stroke: tokens.bgSubtle, strokeWidth: 2 }} />
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
                { label: 'AI Handled', color: '#10b981' },
                { label: 'Resolution', color: '#3b82f6' },
                { label: 'Satisfaction', color: '#8b5cf6' },
              ].map((item) => (
                <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 3, borderRadius: 2, background: item.color }} />
                  <Typography sx={{ fontSize: '0.6875rem', color: tokens.textSecondary, fontFamily: FONT_FAMILY }}>
                    {item.label}
                  </Typography>
                </Box>
              ))}
              <Typography sx={{ fontSize: '0.625rem', color: tokens.textTertiary, fontFamily: FONT_FAMILY, ml: { xs: 0, sm: 2 } }}>
                W = Week
              </Typography>
            </Box>
          </Box>
        </Fade>
      </Box>
    </Box>
  );
};

export default AIPerformanceAnalytics;