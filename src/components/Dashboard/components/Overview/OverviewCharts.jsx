// frontend/src/components/Dashboard/components/Overview/OverviewCharts.jsx
import React from 'react';
import { Box, Paper, Typography, Skeleton } from '@mui/material';
import { useSelector } from 'react-redux';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const ChartContainer = ({ title, children, height = 250, loading = false, ...props }) => (
  <Paper elevation={0} sx={{ 
    p: 3,
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fffe 100%)',
    border: '1px solid rgba(62, 228, 200, 0.2)',
    ...props.sx
  }}>
    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#0B1929' }}>
      {title}
    </Typography>
    {loading ? (
      <Skeleton variant="rectangular" width="100%" height={height} sx={{ borderRadius: 2 }} />
    ) : (
      <ResponsiveContainer width="100%" height={height}>
        {children}
      </ResponsiveContainer>
    )}
  </Paper>
);

const OverviewCharts = ({ isMobile }) => {
  const { charts, loading } = useSelector((state) => state.metrics);

  const tooltipStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
    border: '1px solid rgba(62, 228, 200, 0.3)',
    borderRadius: 8
  };

  const getXAxisProps = (rotateLabels = false) => ({
    stroke: "#0B1929",
    interval: isMobile && rotateLabels ? 1 : 0,
    tick: { fontSize: isMobile ? 10 : 12 },
    ...(rotateLabels && isMobile && {
      angle: -45,
      textAnchor: "end",
      height: 60
    })
  });

  const getYAxisProps = (formatK = false) => ({
    stroke: "#0B1929",
    tick: { fontSize: isMobile ? 10 : 12 },
    ...(formatK && isMobile && {
      tickFormatter: (value) => `${value/1000}k`
    })
  });

  // Colors for pie charts
  const patientTypeColors = {
    'New': '#3EE4C8',
    'Returning': '#45B7D1',
    'Existing': '#96CEB4'
  };

  const revenueColors = [
    '#3EE4C8', '#45B7D1', '#96CEB4', '#DDA77B', '#F7B801', '#FF6B6B', '#9B59B6', '#3498DB'
  ];

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Analytics Dashboard
      </Typography>
      
      {/* Revenue Chart */}
      {charts.revenueData && charts.revenueData.length > 0 && (
        <ChartContainer title="Monthly Revenue Trends" height={300} sx={{ mb: 3 }} loading={loading}>
          <AreaChart data={charts.revenueData} margin={{ bottom: isMobile ? 5 : 5, left: isMobile ? -20 : 5 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3EE4C8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3EE4C8" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(62, 228, 200, 0.1)" />
            <XAxis dataKey="month" {...getXAxisProps()} />
            <YAxis {...getYAxisProps(true)} />
            <Tooltip contentStyle={tooltipStyle} formatter={(value) => `$${value.toLocaleString()}`} />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#3EE4C8" 
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
              strokeWidth={2}
              name="Revenue ($)"
            />
          </AreaChart>
        </ChartContainer>
      )}

      {/* Two column layout for smaller charts */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        {/* Appointment Types Chart */}
        {charts.appointmentTypes && charts.appointmentTypes.length > 0 && (
          <ChartContainer title="Appointment Types" loading={loading}>
            <BarChart data={charts.appointmentTypes} margin={{ bottom: isMobile ? 40 : 5, left: isMobile ? -20 : 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(62, 228, 200, 0.1)" />
              <XAxis 
                dataKey="type" 
                stroke="#0B1929"
                angle={isMobile ? -45 : 0}
                textAnchor={isMobile ? "end" : "middle"}
                interval={0}
                tick={{ fontSize: isMobile ? 9 : 12 }}
                height={isMobile ? 60 : 30}
              />
              <YAxis {...getYAxisProps()} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Bar dataKey="count" fill="#3EE4C8" name="Bookings" radius={[8, 8, 0, 0]} />
              <Bar dataKey="revenue" fill="#45B7D1" name="Revenue ($)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ChartContainer>
        )}

        {/* Conversations by Channel */}
        {charts.conversationsByChannel && charts.conversationsByChannel.length > 0 && (
          <ChartContainer title="Conversations by Channel" loading={loading}>
            <BarChart data={charts.conversationsByChannel} margin={{ bottom: isMobile ? 5 : 5, left: isMobile ? -20 : 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(62, 228, 200, 0.1)" />
              <XAxis dataKey="channel" {...getXAxisProps()} />
              <YAxis {...getYAxisProps()} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill="#3EE4C8" name="Messages" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ChartContainer>
        )}
      </Box>

      {/* Popular Procedures and Insurance */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mt: 3 }}>
        {/* Popular Procedures */}
        {charts.popularProcedures && charts.popularProcedures.length > 0 && (
          <ChartContainer title="Most Popular Procedures" loading={loading}>
            <BarChart data={charts.popularProcedures} margin={{ bottom: isMobile ? 80 : 60, left: isMobile ? -20 : 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(62, 228, 200, 0.1)" />
              <XAxis 
                dataKey="name" 
                stroke="#0B1929" 
                angle={-45} 
                textAnchor="end" 
                height={80}
                interval={0}
                tick={{ fontSize: isMobile ? 8 : 12 }}
              />
              <YAxis {...getYAxisProps()} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="value" fill="#3EE4C8" name="Count" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ChartContainer>
        )}

        {/* Insurance Providers */}
        {charts.insuranceProviders && charts.insuranceProviders.length > 0 && (
          <ChartContainer title="Insurance Providers" loading={loading}>
            <BarChart data={charts.insuranceProviders} margin={{ bottom: isMobile ? 70 : 20, left: isMobile ? -20 : 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(62, 228, 200, 0.1)" />
              <XAxis 
                dataKey="provider" 
                stroke="#0B1929"
                interval={0}
                angle={isMobile ? -45 : -15}
                textAnchor="end"
                height={isMobile ? 80 : 60}
                tick={{ fontSize: isMobile ? 8 : 12 }}
              />
              <YAxis {...getYAxisProps()} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill="#3EE4C8" name="Patients" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ChartContainer>
        )}
      </Box>

      {/* Patient Types and Revenue Distribution */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mt: 3 }}>
        {/* Patient Types */}
        {charts.patientTypes && charts.patientTypes.length > 0 && (
          <ChartContainer title="Patient Types Distribution" loading={loading}>
            <PieChart>
              <Pie
                data={charts.patientTypes}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => isMobile ? `${value}%` : `${name}: ${value}%`}
                outerRadius={isMobile ? 60 : 80}
                fill="#8884d8"
                dataKey="value"
              >
                {charts.patientTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={patientTypeColors[entry.name] || revenueColors[index % revenueColors.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(value) => `${value}%`} />
            </PieChart>
          </ChartContainer>
        )}

        {/* Revenue by Type */}
        {charts.revenueByType && charts.revenueByType.length > 0 && (
          <ChartContainer title="Revenue by Appointment Type" loading={loading}>
            <PieChart>
              <Pie
                data={charts.revenueByType}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => isMobile ? `$${(value/1000).toFixed(1)}k` : `${name}: $${value.toLocaleString()}`}
                outerRadius={isMobile ? 60 : 80}
                fill="#8884d8"
                dataKey="value"
              >
                {charts.revenueByType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={revenueColors[index % revenueColors.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={tooltipStyle}
                formatter={(value) => `$${value.toLocaleString()}`}
              />
              <Legend />
            </PieChart>
          </ChartContainer>
        )}
      </Box>

      {/* Patient Satisfaction Radar Chart */}
      {charts.patientSatisfaction && charts.patientSatisfaction.length > 0 && (
        <ChartContainer title="OmniDent AI Performance Metrics" height={isMobile ? 300 : 400} sx={{ mt: 3 }} loading={loading}>
          <RadarChart data={charts.patientSatisfaction}>
            <PolarGrid 
              stroke="rgba(62, 228, 200, 0.3)" 
              strokeDasharray="3 3"
            />
            <PolarAngleAxis 
              dataKey="metric" 
              stroke="#0B1929"
              tick={{ fontSize: isMobile ? 9 : 12 }}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]} 
              stroke="rgba(62, 228, 200, 0.3)"
            />
            <Radar 
              name="Performance Score" 
              dataKey="score" 
              stroke="#3EE4C8" 
              fill="#3EE4C8" 
              fillOpacity={0.6}
              strokeWidth={2}
            />
            <Tooltip 
              contentStyle={tooltipStyle}
              formatter={(value) => `${value}%`}
            />
            <Legend />
          </RadarChart>
        </ChartContainer>
      )}
    </Box>
  );
};

export default OverviewCharts;