// src/components/Dashboard/components/Overview/OverviewCharts.jsx
import React from 'react';
import { Box, Paper, Typography, Skeleton } from '@mui/material';
import { useSelector } from 'react-redux';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
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

  const COLORS = ['#3EE4C8', '#45B7D1', '#96CEB4', '#F7B801', '#FF6B6B', '#9B59B6', '#3498DB', '#DDA77B'];

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Detailed Analytics
      </Typography>

      {/* ROW 1: Monthly Revenue */}
      {charts.monthlyRevenue && charts.monthlyRevenue.length > 0 && (
        <ChartContainer title="Monthly Revenue Trend" height={300} sx={{ mb: 3 }} loading={loading}>
          <LineChart data={charts.monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(62, 228, 200, 0.1)" />
            <XAxis dataKey="month" stroke="#0B1929" tick={{ fontSize: 12 }} />
            <YAxis stroke="#0B1929" tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={tooltipStyle} formatter={(value) => `$${value.toLocaleString()}`} />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#3EE4C8" strokeWidth={3} name="Revenue ($)" />
          </LineChart>
        </ChartContainer>
      )}

      {/* ROW 2: Appointment Status & Type */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
        {charts.appointmentBooked && charts.appointmentBooked.length > 0 && (
          <ChartContainer title="Appointment Booking Status" loading={loading}>
            <PieChart>
              <Pie
                data={charts.appointmentBooked}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={isMobile ? 60 : 80}
                dataKey="value"
              >
                {charts.appointmentBooked.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ChartContainer>
        )}

        {charts.appointmentType && charts.appointmentType.length > 0 && (
          <ChartContainer title="Appointment Types" loading={loading}>
            <BarChart data={charts.appointmentType}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(62, 228, 200, 0.1)" />
              <XAxis 
                dataKey="type" 
                stroke="#0B1929" 
                angle={-45} 
                textAnchor="end" 
                height={80}
                tick={{ fontSize: 10 }}
              />
              <YAxis stroke="#0B1929" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill="#3EE4C8" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ChartContainer>
        )}
      </Box>

      {/* ROW 3: Treatment & Case Status */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
        {charts.treatmentPlan && charts.treatmentPlan.length > 0 && (
          <ChartContainer title="Treatment Plan Presented" loading={loading}>
            <PieChart>
              <Pie
                data={charts.treatmentPlan}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={isMobile ? 60 : 80}
                dataKey="value"
              >
                {charts.treatmentPlan.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ChartContainer>
        )}

        {charts.caseAccepted && charts.caseAccepted.length > 0 && (
          <ChartContainer title="Case Acceptance Status" loading={loading}>
            <PieChart>
              <Pie
                data={charts.caseAccepted}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={isMobile ? 60 : 80}
                dataKey="value"
              >
                {charts.caseAccepted.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ChartContainer>
        )}
      </Box>

      {/* ROW 4: Patient Type & Channel */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
        {charts.patientType && charts.patientType.length > 0 && (
          <ChartContainer title="Patient Type Distribution" loading={loading}>
            <PieChart>
              <Pie
                data={charts.patientType}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={isMobile ? 60 : 80}
                dataKey="value"
              >
                {charts.patientType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ChartContainer>
        )}

        {charts.conversationChannel && charts.conversationChannel.length > 0 && (
          <ChartContainer title="Conversation Channels" loading={loading}>
            <BarChart data={charts.conversationChannel}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(62, 228, 200, 0.1)" />
              <XAxis dataKey="channel" stroke="#0B1929" tick={{ fontSize: 12 }} />
              <YAxis stroke="#0B1929" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill="#45B7D1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ChartContainer>
        )}
      </Box>

      {/* ROW 5: AI Metrics */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 3, mb: 3 }}>
        {charts.aiHandled && charts.aiHandled.length > 0 && (
          <ChartContainer title="AI Handled vs Manual" loading={loading}>
            <PieChart>
              <Pie
                data={charts.aiHandled}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={isMobile ? 50 : 70}
                dataKey="value"
              >
                {charts.aiHandled.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ChartContainer>
        )}

        {charts.humanHandoff && charts.humanHandoff.length > 0 && (
          <ChartContainer title="Human Handoff Rate" loading={loading}>
            <PieChart>
              <Pie
                data={charts.humanHandoff}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={isMobile ? 50 : 70}
                dataKey="value"
              >
                {charts.humanHandoff.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ChartContainer>
        )}

        {charts.conversationResolved && charts.conversationResolved.length > 0 && (
          <ChartContainer title="Resolution Rate" loading={loading}>
            <PieChart>
              <Pie
                data={charts.conversationResolved}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={isMobile ? 50 : 70}
                dataKey="value"
              >
                {charts.conversationResolved.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ChartContainer>
        )}
      </Box>

      {/* ROW 6: Insurance & Payment */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
        {charts.insuranceMentioned && charts.insuranceMentioned.length > 0 && (
          <ChartContainer title="Insurance Discussed" loading={loading}>
            <PieChart>
              <Pie
                data={charts.insuranceMentioned}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={isMobile ? 60 : 80}
                dataKey="value"
              >
                {charts.insuranceMentioned.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ChartContainer>
        )}

        {charts.paymentPlan && charts.paymentPlan.length > 0 && (
          <ChartContainer title="Payment Plan Discussed" loading={loading}>
            <PieChart>
              <Pie
                data={charts.paymentPlan}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={isMobile ? 60 : 80}
                dataKey="value"
              >
                {charts.paymentPlan.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ChartContainer>
        )}
      </Box>

      {/* ROW 7: Procedures & Outcomes */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
        {charts.insuranceProvider && charts.insuranceProvider.length > 0 && (
          <ChartContainer title="Insurance Providers" loading={loading}>
            <BarChart data={charts.insuranceProvider}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(62, 228, 200, 0.1)" />
              <XAxis 
                dataKey="provider" 
                stroke="#0B1929" 
                angle={-45} 
                textAnchor="end" 
                height={80}
                tick={{ fontSize: 10 }}
              />
              <YAxis stroke="#0B1929" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill="#96CEB4" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ChartContainer>
        )}

        {charts.procedurePrimary && charts.procedurePrimary.length > 0 && (
          <ChartContainer title="Most Common Procedures" loading={loading}>
            <BarChart data={charts.procedurePrimary}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(62, 228, 200, 0.1)" />
              <XAxis 
                dataKey="name" 
                stroke="#0B1929" 
                angle={-45} 
                textAnchor="end" 
                height={80}
                tick={{ fontSize: 10 }}
              />
              <YAxis stroke="#0B1929" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="value" fill="#F7B801" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ChartContainer>
        )}
      </Box>

      {/* ROW 8: Booking Outcomes & Avg Messages */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
        {charts.bookingOutcome && charts.bookingOutcome.length > 0 && (
          <ChartContainer title="Booking Outcomes" loading={loading}>
            <BarChart data={charts.bookingOutcome}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(62, 228, 200, 0.1)" />
              <XAxis 
                dataKey="outcome" 
                stroke="#0B1929" 
                angle={-45} 
                textAnchor="end" 
                height={80}
                tick={{ fontSize: 10 }}
              />
              <YAxis stroke="#0B1929" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill="#FF6B6B" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ChartContainer>
        )}

        {charts.avgMessagesByChannel && charts.avgMessagesByChannel.length > 0 && (
          <ChartContainer title="Avg Messages per Conversation by Channel" loading={loading}>
            <BarChart data={charts.avgMessagesByChannel}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(62, 228, 200, 0.1)" />
              <XAxis dataKey="channel" stroke="#0B1929" tick={{ fontSize: 12 }} />
              <YAxis stroke="#0B1929" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="avgMessages" fill="#9B59B6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ChartContainer>
        )}
      </Box>
    </Box>
  );
};

export default OverviewCharts;