// frontend/src/components/Dashboard/components/Reports/Reports.jsx
import React, { useState } from 'react';
import { Typography, Box, Paper } from '@mui/material';
import { Assessment as ReportsIcon } from '@mui/icons-material';
import DocumentViewer from '../DocumentViewer/DocumentViewer';

const ReportCard = ({ title, description, category, onUpload }) => {
  const [viewerOpen, setViewerOpen] = useState(false);

  return (
    <>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3,
          position: 'relative',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fffe 100%)',
          border: '1px solid rgba(62, 228, 200, 0.2)',
          cursor: 'pointer',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          '&:hover': {
            boxShadow: '0 4px 20px rgba(62, 228, 200, 0.15)',
            transform: 'translateY(-2px)',
            borderColor: '#3EE4C8'
          }
        }}
        onClick={() => setViewerOpen(true)}
      >
        <ReportsIcon sx={{ color: '#3EE4C8', fontSize: 40, mb: 2 }} />
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#0B1929', pr: 5 }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(11, 25, 41, 0.6)', mt: 1 }}>
          {description}
        </Typography>
      </Paper>

      <DocumentViewer
        open={viewerOpen}
        onClose={() => setViewerOpen(false)}
        category={category}
        title={title}
        documentType="report"
        onUpload={onUpload}
      />
    </>
  );
};

const Reports = () => {
  const reportTypes = [
    { title: 'Financial Reports', description: 'Production, collections, and accounts receivable', category: 'financial_report' },
    { title: 'Patient Reports', description: 'Demographics, retention, and satisfaction', category: 'patient_report' },
    { title: 'Insurance Analysis', description: 'Claims, payments, and aging reports', category: 'insurance_analysis' },
    { title: 'Operational Metrics', description: 'Appointment utilization and staff productivity', category: 'operational_metrics' }
  ];

  const handleReportUpload = (document) => {
    console.log('New report uploaded:', document);
  };

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
            category={report.category}
            onUpload={handleReportUpload}
          />
        ))}
      </Box>
    </>
  );
};

export default Reports;