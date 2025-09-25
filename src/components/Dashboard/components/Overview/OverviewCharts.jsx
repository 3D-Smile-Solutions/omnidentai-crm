// 9. src/components/Dashboard/components/Overview/OverviewCharts.jsx
// ===========================================
import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import {
  LineChart,
  Line,
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
import GoogleMapComponent from '../../../GoogleMapComponent';
import {
  revenueData,
  bookingsData,
  conversationsData,
  appointmentTypes,
  popularProcedures,
  insuranceProviders,
  appointmentsByGender,
  patientTypes,
  revenueByType,
  patientSatisfaction
} from '../../data/chartData';

const ChartContainer = ({ title, children, height = 250, ...props }) => (
  <Paper elevation={0} sx={{ 
    p: 3,
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fffe 100%)',
    border: '1px solid rgba(62, 228, 200, 0.2)',
    ...props.sx
  }}>
    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#0B1929' }}>
      {title}
    </Typography>
    <ResponsiveContainer width="100%" height={height}>
      {children}
    </ResponsiveContainer>
  </Paper>
);

const OverviewCharts = ({ isMobile }) => {
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

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Analytics Dashboard
      </Typography>
      
      {/* Revenue Chart */}
      <ChartContainer title="Monthly Revenue Trends" height={300} sx={{ mb: 3 }}>
        <AreaChart data={revenueData} margin={{ bottom: isMobile ? 5 : 5, left: isMobile ? -20 : 5 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3EE4C8" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3EE4C8" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(62, 228, 200, 0.1)" />
          <XAxis dataKey="month" {...getXAxisProps()} />
          <YAxis {...getYAxisProps(true)} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="revenue" 
            stroke="#3EE4C8" 
            fillOpacity={1} 
            fill="url(#colorRevenue)" 
            strokeWidth={2}
            name="Revenue"
          />
          <Line 
            type="monotone" 
            dataKey="target" 
            stroke="#0B1929" 
            strokeDasharray="5 5"
            strokeWidth={2}
            dot={false}
            name="Target"
          />
        </AreaChart>
      </ChartContainer>

      {/* Two column layout for smaller charts */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        {/* Bookings Chart */}
        <ChartContainer title="Weekly Bookings">
          <BarChart data={bookingsData} margin={{ bottom: isMobile ? 5 : 5, left: isMobile ? -20 : 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(62, 228, 200, 0.1)" />
            <XAxis dataKey="day" {...getXAxisProps()} />
            <YAxis {...getYAxisProps()} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend />
            <Bar dataKey="bookings" fill="#3EE4C8" name="Bookings" radius={[8, 8, 0, 0]} />
            <Bar dataKey="cancellations" fill="#FF6B6B" name="Cancellations" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ChartContainer>

        {/* Appointment Types Chart */}
        <ChartContainer title="Appointment Types">
          <BarChart data={appointmentTypes} margin={{ bottom: isMobile ? 40 : 5, left: isMobile ? -20 : 5 }}>
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
            <Bar dataKey="count" fill="#3EE4C8" name="Count" radius={[8, 8, 0, 0]} />
            <Bar dataKey="revenue" fill="#45B7D1" name="Revenue ($)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </Box>

      {/* Conversations by Channel */}
      <ChartContainer title="Conversations by Channel" sx={{ mt: 3 }}>
        <BarChart data={conversationsData} margin={{ bottom: isMobile ? 5 : 5, left: isMobile ? -20 : 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(62, 228, 200, 0.1)" />
          <XAxis dataKey="channel" {...getXAxisProps()} />
          <YAxis {...getYAxisProps()} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="count" fill="#3EE4C8" name="Messages" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ChartContainer>

      {/* Additional Charts Row 1 */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mt: 3 }}>
        {/* Popular Procedures */}
        <ChartContainer title="Most Popular Procedures">
          <BarChart data={popularProcedures} margin={{ bottom: isMobile ? 80 : 60, left: isMobile ? -20 : 5 }}>
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
            <Bar dataKey="value" fill="#3EE4C8" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ChartContainer>

        {/* Insurance Providers */}
        <ChartContainer title="Insurance Verifications">
          <BarChart data={insuranceProviders} margin={{ bottom: isMobile ? 70 : 20, left: isMobile ? -20 : 5 }}>
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
            <Bar dataKey="count" fill="#3EE4C8" name="Verified Patients" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </Box>

      {/* Additional Charts Row 2 */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mt: 3 }}>
        {/* Appointments by Gender */}
        <ChartContainer title="Appointment Types by Gender">
          <BarChart data={appointmentsByGender} margin={{ bottom: isMobile ? 40 : 5, left: isMobile ? -20 : 5 }}>
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
            <Bar dataKey="male" fill="#45B7D1" name="Male" radius={[8, 8, 0, 0]} />
            <Bar dataKey="female" fill="#3EE4C8" name="Female" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ChartContainer>

        {/* Patient Types */}
        <ChartContainer title="Patient Types">
          <PieChart>
            <Pie
              data={patientTypes}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => isMobile ? `${value}%` : `${name}: ${value}%`}
              outerRadius={isMobile ? 60 : 80}
              fill="#8884d8"
              dataKey="value"
            >
              {patientTypes.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ChartContainer>
      </Box>

      {/* Revenue by Appointment Type */}
      <ChartContainer title="Total Revenue by Appointment Type" height={300} sx={{ mt: 3 }}>
        <PieChart>
          <Pie
            data={revenueByType}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => isMobile ? `${(value/1000).toFixed(1)}k` : `${name}: ${value.toLocaleString()}`}
            outerRadius={isMobile ? 80 : 100}
            fill="#8884d8"
            dataKey="value"
          >
            {revenueByType.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={tooltipStyle}
            formatter={(value) => `${value.toLocaleString()}`}
          />
          <Legend />
        </PieChart>
      </ChartContainer>

      {/* Patient Satisfaction Radar Chart */}
      <ChartContainer title="OmniDent AI Patient Satisfaction Metrics" height={isMobile ? 300 : 400} sx={{ mt: 3 }}>
        <RadarChart data={patientSatisfaction}>
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
            name="Satisfaction Score" 
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

      {/* Google Maps Patient Distribution */}
      <GoogleMapComponent isMobile={isMobile} />
    </Box>
  );
};

export default OverviewCharts;
