// 13. src/components/Dashboard/components/Reports/Reports.jsx
// ===========================================
import React from 'react';
import { Typography, Box, Paper, Button } from '@mui/material';
import { Assessment as ReportsIcon } from '@mui/icons-material';

const ReportCard = ({ title, description }) => (
  <Paper elevation={0} sx={{ 
    p: 3,
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fffe 100%)',
    border: '1px solid rgba(62, 228, 200, 0.2)',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
    '&:hover': {
      boxShadow: '0 4px 20px rgba(62, 228, 200, 0.15)',
      transform: 'translateY(-2px)'
    }
  }}>
    <ReportsIcon sx={{ color: '#3EE4C8', fontSize: 40, mb: 2 }} />
    <Typography variant="h6" sx={{ fontWeight: 600, color: '#0B1929' }}>{title}</Typography>
    <Typography variant="body2" sx={{ color: 'rgba(11, 25, 41, 0.6)', mt: 1 }}>
      {description}
    </Typography>
  </Paper>
);

const Reports = () => {
  const reportTypes = [
    { title: 'Financial Reports', description: 'Production, collections, and accounts receivable' },
    { title: 'Patient Reports', description: 'Demographics, retention, and satisfaction' },
    { title: 'Insurance Analysis', description: 'Claims, payments, and aging reports' },
    { title: 'Operational Metrics', description: 'Appointment utilization and staff productivity' }
  ];

  return (
    <>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Reports & Analytics
      </Typography>
      <Typography paragraph color="text.secondary">
        Generate comprehensive reports for financial, operational, and clinical insights.
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 2, mt: 3 }}>
        {reportTypes.map((report, index) => (
          <ReportCard 
            key={index}
            title={report.title}
            description={report.description}
          />
        ))}
      </Box>
    </>
  );
};

export default Reports;