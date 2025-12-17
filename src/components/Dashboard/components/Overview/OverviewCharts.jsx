// src/components/Dashboard/components/Overview/OverviewCharts.jsx
import React, { useState } from 'react';
import { Box, Typography, Skeleton, ButtonBase } from '@mui/material';
import { useSelector } from 'react-redux';
import { useTheme } from '../../../../context/ThemeContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell,
  ComposedChart,
  Line,
} from 'recharts';

// Font family constant - Roboto for clean, professional look
const FONT_FAMILY = '"Roboto", -apple-system, BlinkMacSystemFont, sans-serif';

// Custom tooltip
const CustomTooltip = ({ active, payload, label, tokens, formatter }) => {
  if (!active || !payload?.length) return null;
  
  return (
    <Box sx={{
      background: tokens.bgSubtle,
      border: `1px solid ${tokens.border}`,
      borderRadius: '10px',
      p: 1.25,
      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      backdropFilter: 'blur(8px)',
    }}>
      <Typography sx={{ fontSize: '0.65rem', color: tokens.textTertiary, mb: 0.5, fontFamily: FONT_FAMILY, fontWeight: 500 }}>
        {label}
      </Typography>
      {payload.map((entry, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Box sx={{ width: 6, height: 6, borderRadius: 1.5, background: entry.color }} />
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: tokens.textPrimary, fontFamily: FONT_FAMILY }}>
            {formatter ? formatter(entry.value) : entry.value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

// Tab button
const TabButton = ({ active, children, onClick, tokens }) => (
  <ButtonBase
    onClick={onClick}
    sx={{
      px: { xs: 1.5, sm: 2 },
      py: { xs: 0.5, sm: 0.75 },
      borderRadius: '8px',
      fontSize: { xs: '0.7rem', sm: '0.75rem' },
      fontWeight: 600,
      fontFamily: FONT_FAMILY,
      color: active ? tokens.accent : tokens.textSecondary,
      background: active ? tokens.accentMuted : 'transparent',
      transition: 'all 0.2s ease',
      letterSpacing: '0.01em',
      '&:hover': { background: tokens.accentMuted, color: tokens.accent },
    }}
  >
    {children}
  </ButtonBase>
);

// Chart card with gradient hover
const ChartCard = ({ title, subtitle, children, loading, tokens, height = 260, isDarkMode }) => (
  <Box sx={{
    background: tokens.bgSubtle,
    border: `1px solid ${tokens.border}`,
    borderRadius: '14px',
    p: { xs: 1.5, sm: 2 },
    height: '100%',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: isDarkMode 
        ? 'linear-gradient(180deg, rgba(59, 131, 246, 0.63) 0%, rgba(59, 131, 246, 0.23) 50%, rgba(24, 24, 27, 0.23) 100%)'
        : 'linear-gradient(135deg, rgba(149, 246, 59, 0.12) 0%, rgba(59, 130, 246, 0.04) 50%, rgba(255, 255, 255, 0.95) 100%)',
      transform: 'translateY(-2px)',
      boxShadow: isDarkMode 
        ? '0 8px 32px rgba(59, 131, 246, 0.15)'
        : '0 8px 32px rgba(59, 131, 246, 0.1)',
    },
  }}>
    <Box sx={{ mb: 2 }}>
      <Typography sx={{ fontSize: { xs: '0.8125rem', sm: '0.9rem' }, fontWeight: 600, color: tokens.textPrimary, letterSpacing: '-0.015em', mb: 0.25, fontFamily: FONT_FAMILY }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography sx={{ fontSize: '0.6875rem', color: tokens.textTertiary, fontFamily: FONT_FAMILY, fontWeight: 500 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
    
    {loading ? (
      <Skeleton variant="rectangular" width="100%" height={height} sx={{ borderRadius: 2, bgcolor: tokens.border }} />
    ) : (
      <Box sx={{ height }}>{children}</Box>
    )}
  </Box>
);

// Horizontal bar distribution
const HorizontalDistribution = ({ data, tokens }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];
  
  return (
    <Box>
      <Box sx={{ display: 'flex', height: 10, borderRadius: 6, overflow: 'hidden', mb: 2 }}>
        {data.map((item, index) => (
          <Box key={index} sx={{ width: `${(item.value / total) * 100}%`, background: colors[index % colors.length], transition: 'width 0.6s ease' }} />
        ))}
      </Box>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(auto-fit, minmax(100px, 1fr))' }, gap: { xs: 1, sm: 1.5 } }}>
        {data.map((item, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: 2, background: colors[index % colors.length], flexShrink: 0 }} />
            <Box>
              <Typography sx={{ fontSize: { xs: '0.75rem', sm: '0.8125rem' }, fontWeight: 700, color: tokens.textPrimary, lineHeight: 1.2, fontFamily: FONT_FAMILY, letterSpacing: '-0.01em' }}>
                {item.value}
              </Typography>
              <Typography sx={{ fontSize: { xs: '0.6rem', sm: '0.65rem' }, color: tokens.textTertiary, fontFamily: FONT_FAMILY, fontWeight: 500 }}>
                {item.name}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const OverviewCharts = ({ isMobile }) => {
  const { isDarkMode } = useTheme();
  const { charts, loading } = useSelector((state) => state.metrics);
  const [activeSection, setActiveSection] = useState('revenue');

  // Design tokens matching Forms/Reports
  const tokens = {
    bg: isDarkMode ? '#09090b' : '#fafafa',
    bgSubtle: isDarkMode ? '#18181b88' : '#ffffff',
    border: isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
    textPrimary: isDarkMode ? '#fafafa' : '#09090b',
    textSecondary: isDarkMode ? 'rgba(250,250,250,0.5)' : 'rgba(9,9,11,0.5)',
    textTertiary: isDarkMode ? 'rgba(250,250,250,0.35)' : 'rgba(9,9,11,0.35)',
    accent: '#10b981',
    accentMuted: isDarkMode ? 'rgba(16,185,129,0.15)' : 'rgba(16,185,129,0.1)',
  };

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];
  const gridColor = isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';

  const sections = [
    { key: 'revenue', label: 'Revenue' },
    { key: 'appointments', label: 'Appointments' },
    { key: 'ai', label: 'AI' },
    { key: 'patients', label: 'Patients' },
  ];

  return (
    <Box>
      {/* Section Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5, mb: 2.5 }}>
        <Typography sx={{ fontWeight: 700, color: tokens.textPrimary, fontSize: { xs: '0.9375rem', sm: '1.0625rem' }, letterSpacing: '-0.025em', fontFamily: FONT_FAMILY }}>
          Analytics
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 0.5, p: 0.5, borderRadius: '12px', background: tokens.bg, border: `1px solid ${tokens.border}` }}>
          {sections.map((section) => (
            <TabButton key={section.key} active={activeSection === section.key} onClick={() => setActiveSection(section.key)} tokens={tokens}>
              {section.label}
            </TabButton>
          ))}
        </Box>
      </Box>

      {/* Revenue Section */}
      {activeSection === 'revenue' && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: { xs: 2, sm: 2 } }}>
          <ChartCard title="Monthly Revenue" subtitle="Revenue trends over the past 12 months" loading={loading} tokens={tokens} height={280} isDarkMode={isDarkMode}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={charts.monthlyRevenue || []}>
                <defs>
                  <linearGradient id="revenueGradientChart" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={tokens.accent} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={tokens.accent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={gridColor} strokeDasharray="none" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: tokens.textTertiary, fontFamily: FONT_FAMILY }} dy={8} interval="preserveStartEnd" />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: tokens.textTertiary, fontFamily: FONT_FAMILY }} tickFormatter={(v) => `$${v/1000}k`} dx={-5} width={40} />
                <Tooltip content={<CustomTooltip tokens={tokens} formatter={(v) => `$${v.toLocaleString()}`} />} />
                <Area type="monotone" dataKey="revenue" stroke={tokens.accent} strokeWidth={2} fill="url(#revenueGradientChart)" />
                <Line type="monotone" dataKey="revenue" stroke={tokens.accent} strokeWidth={2} dot={false} activeDot={{ r: 5, fill: tokens.accent, stroke: tokens.bgSubtle, strokeWidth: 2 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Top Procedures" subtitle="By revenue contribution" loading={loading} tokens={tokens} height={280} isDarkMode={isDarkMode}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.procedurePrimary || []} layout="vertical">
                <CartesianGrid stroke={gridColor} strokeDasharray="none" horizontal={false} />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: tokens.textTertiary, fontFamily: FONT_FAMILY }} />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: tokens.textTertiary, fontFamily: FONT_FAMILY }} width={70} />
                <Tooltip content={<CustomTooltip tokens={tokens} />} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {(charts.procedurePrimary || []).map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Box>
      )}

      {/* Appointments Section */}
      {activeSection === 'appointments' && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: { xs: 2, sm: 2 } }}>
          <ChartCard title="Appointment Types" subtitle="Distribution by category" loading={loading} tokens={tokens} height={240} isDarkMode={isDarkMode}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.appointmentType || []} layout="vertical">
                <CartesianGrid stroke={gridColor} strokeDasharray="none" horizontal={false} />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: tokens.textTertiary, fontFamily: FONT_FAMILY }} />
                <YAxis type="category" dataKey="type" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: tokens.textTertiary, fontFamily: FONT_FAMILY }} width={70} />
                <Tooltip content={<CustomTooltip tokens={tokens} />} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} fill={COLORS[1]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Booking Status" subtitle="Current appointment distribution" loading={loading} tokens={tokens} height={240} isDarkMode={isDarkMode}>
            <HorizontalDistribution data={charts.appointmentBooked || []} tokens={tokens} />
          </ChartCard>

          <ChartCard title="Booking Outcomes" subtitle="Results from scheduling attempts" loading={loading} tokens={tokens} height={240} isDarkMode={isDarkMode}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.bookingOutcome || []}>
                <CartesianGrid stroke={gridColor} strokeDasharray="none" vertical={false} />
                <XAxis dataKey="outcome" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: tokens.textTertiary, fontFamily: FONT_FAMILY }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: tokens.textTertiary, fontFamily: FONT_FAMILY }} />
                <Tooltip content={<CustomTooltip tokens={tokens} />} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {(charts.bookingOutcome || []).map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Communication Channels" subtitle="Conversations by platform" loading={loading} tokens={tokens} height={240} isDarkMode={isDarkMode}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.conversationChannel || []}>
                <CartesianGrid stroke={gridColor} strokeDasharray="none" vertical={false} />
                <XAxis dataKey="channel" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: tokens.textTertiary, fontFamily: FONT_FAMILY }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: tokens.textTertiary, fontFamily: FONT_FAMILY }} />
                <Tooltip content={<CustomTooltip tokens={tokens} />} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} fill={COLORS[2]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Box>
      )}

      {/* AI Performance Section */}
      {activeSection === 'ai' && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: { xs: 2, sm: 2 } }}>
          <ChartCard title="AI vs Manual" subtitle="Conversation handling" loading={loading} tokens={tokens} height={180} isDarkMode={isDarkMode}>
            <HorizontalDistribution data={charts.aiHandled || []} tokens={tokens} />
          </ChartCard>

          <ChartCard title="Human Handoff" subtitle="Escalation rate" loading={loading} tokens={tokens} height={180} isDarkMode={isDarkMode}>
            <HorizontalDistribution data={charts.humanHandoff || []} tokens={tokens} />
          </ChartCard>

          <ChartCard title="Resolution Rate" subtitle="Conversation outcomes" loading={loading} tokens={tokens} height={180} isDarkMode={isDarkMode}>
            <HorizontalDistribution data={charts.conversationResolved || []} tokens={tokens} />
          </ChartCard>

          <Box sx={{ gridColumn: { xs: '1', sm: 'span 3' } }}>
            <ChartCard title="Channel Efficiency" subtitle="Average messages per conversation by channel" loading={loading} tokens={tokens} height={240} isDarkMode={isDarkMode}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.avgMessagesByChannel || []}>
                  <CartesianGrid stroke={gridColor} strokeDasharray="none" vertical={false} />
                  <XAxis dataKey="channel" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: tokens.textTertiary, fontFamily: FONT_FAMILY }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: tokens.textTertiary, fontFamily: FONT_FAMILY }} />
                  <Tooltip content={<CustomTooltip tokens={tokens} />} />
                  <Bar dataKey="avgMessages" radius={[6, 6, 0, 0]} fill={tokens.accent} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </Box>
        </Box>
      )}

      {/* Patients Section */}
      {activeSection === 'patients' && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: { xs: 2, sm: 2 } }}>
          <ChartCard title="Patient Types" subtitle="New vs returning patients" loading={loading} tokens={tokens} height={180} isDarkMode={isDarkMode}>
            <HorizontalDistribution data={charts.patientType || []} tokens={tokens} />
          </ChartCard>

          <ChartCard title="Treatment Plans" subtitle="Plans presented to patients" loading={loading} tokens={tokens} height={180} isDarkMode={isDarkMode}>
            <HorizontalDistribution data={charts.treatmentPlan || []} tokens={tokens} />
          </ChartCard>

          <ChartCard title="Case Acceptance" subtitle="Acceptance rate for presented cases" loading={loading} tokens={tokens} height={180} isDarkMode={isDarkMode}>
            <HorizontalDistribution data={charts.caseAccepted || []} tokens={tokens} />
          </ChartCard>

          <ChartCard title="Insurance Discussions" subtitle="Conversations mentioning insurance" loading={loading} tokens={tokens} height={180} isDarkMode={isDarkMode}>
            <HorizontalDistribution data={charts.insuranceMentioned || []} tokens={tokens} />
          </ChartCard>

          <Box sx={{ gridColumn: { xs: '1', sm: 'span 2' } }}>
            <ChartCard title="Insurance Providers" subtitle="Most common carriers" loading={loading} tokens={tokens} height={240} isDarkMode={isDarkMode}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.insuranceProvider || []} layout="vertical">
                  <CartesianGrid stroke={gridColor} strokeDasharray="none" horizontal={false} />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: tokens.textTertiary, fontFamily: FONT_FAMILY }} />
                  <YAxis type="category" dataKey="provider" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: tokens.textTertiary, fontFamily: FONT_FAMILY }} width={100} />
                  <Tooltip content={<CustomTooltip tokens={tokens} />} />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]} fill={COLORS[3]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default OverviewCharts;