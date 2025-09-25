import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import GoogleMapComponent from '../../components/GoogleMapComponent';

const DashboardOverview = ({ patientTypes = [], revenueByType = [], patientSatisfaction = [], isMobile }) => (
  <Box>
    {/* Patient Types */}
    <Paper elevation={0} sx={{ p: 3, background: 'linear-gradient(135deg, #ffffff 0%, #f8fffe 100%)', border: '1px solid rgba(62, 228, 200, 0.2)' }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#0B1929' }}>Patient Types</Typography>
      <ResponsiveContainer width="100%" height={250}>
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
          <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid rgba(62, 228, 200, 0.3)', borderRadius: 8 }} />
        </PieChart>
      </ResponsiveContainer>
    </Paper>

    {/* Revenue by Appointment Type */}
    <Paper elevation={0} sx={{ p: 3, mt: 3, background: 'linear-gradient(135deg, #ffffff 0%, #f8fffe 100%)', border: '1px solid rgba(62, 228, 200, 0.2)' }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#0B1929' }}>Total Revenue by Appointment Type</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={revenueByType}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => isMobile ? `$${(value/1000).toFixed(1)}k` : `${name}: $${value.toLocaleString()}`}
            outerRadius={isMobile ? 80 : 100}
            fill="#8884d8"
            dataKey="value"
          >
            {revenueByType.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid rgba(62, 228, 200, 0.3)', borderRadius: 8 }} formatter={(value) => `$${value.toLocaleString()}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Paper>

    {/* Patient Satisfaction Radar Chart */}
    <Paper elevation={0} sx={{ p: 3, mt: 3, background: 'linear-gradient(135deg, #ffffff 0%, #f8fffe 100%)', border: '1px solid rgba(62, 228, 200, 0.2)' }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#0B1929' }}>OmniDent AI Patient Satisfaction Metrics</Typography>
      <ResponsiveContainer width="100%" height={isMobile ? 300 : 400}>
        <RadarChart data={patientSatisfaction}>
          <PolarGrid stroke="rgba(62, 228, 200, 0.3)" strokeDasharray="3 3" />
          <PolarAngleAxis dataKey="metric" stroke="#0B1929" tick={{ fontSize: isMobile ? 9 : 12 }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="rgba(62, 228, 200, 0.3)" />
          <Radar name="Satisfaction Score" dataKey="score" stroke="#3EE4C8" fill="#3EE4C8" fillOpacity={0.6} strokeWidth={2} />
          <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid rgba(62, 228, 200, 0.3)', borderRadius: 8 }} formatter={(value) => `${value}%`} />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </Paper>

    {/* Google Maps Patient Distribution */}
    <GoogleMapComponent isMobile={isMobile} />
  </Box>
);

export default DashboardOverview;

