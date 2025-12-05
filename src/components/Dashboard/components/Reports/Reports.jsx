// frontend/src/components/Dashboard/components/Reports/Reports.jsx
import React, { useState } from 'react';
import { 
  Typography, 
  Box, 
  Paper
} from '@mui/material';
import { 
  Assessment as ReportsIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  AccountBalance as AccountBalanceIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';
import DocumentViewer from '../DocumentViewer/DocumentViewer';
import { useTheme } from '../../../../context/ThemeContext';

const ReportCard = ({ title, description, category, onUpload, icon: Icon = ReportsIcon, color }) => {
  const { isDarkMode } = useTheme();
  const [viewerOpen, setViewerOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Default colors if not provided
  const iconColor = color || (isDarkMode ? '#64ffda' : '#3EE4C8');

  return (
    <>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3,
          position: 'relative',
          background: isDarkMode 
            ? 'rgba(17, 24, 39, 0.5)'
            : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          border: isDarkMode 
            ? '1px solid rgba(100, 255, 218, 0.15)' 
            : '1px solid rgba(62, 228, 200, 0.2)',
          borderRadius: '16px',
          cursor: 'pointer',
          transition: 'all 0.25s ease',
          overflow: 'hidden',
          boxShadow: isDarkMode
            ? '0 4px 20px rgba(0, 0, 0, 0.2)'
            : '0 4px 20px rgba(62, 228, 200, 0.1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            border: isDarkMode 
              ? '1px solid rgba(100, 255, 218, 0.3)' 
              : '1px solid rgba(62, 228, 200, 0.4)',
            boxShadow: isDarkMode
              ? '0 8px 32px rgba(100, 255, 218, 0.15)'
              : '0 8px 32px rgba(62, 228, 200, 0.2)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: isDarkMode
              ? 'linear-gradient(135deg, rgba(100, 255, 218, 0.03) 0%, rgba(167, 139, 250, 0.03) 100%)'
              : 'linear-gradient(135deg, rgba(62, 228, 200, 0.05) 0%, rgba(43, 196, 168, 0.02) 100%)',
            pointerEvents: 'none',
            zIndex: 0,
          }
        }}
        onClick={() => setViewerOpen(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              backgroundColor: isDarkMode 
                ? `${iconColor}20`
                : `${iconColor}18`,
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2.5,
              border: isDarkMode 
                ? `1px solid ${iconColor}30`
                : `1px solid ${iconColor}35`,
              transition: 'all 0.25s ease',
              transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1)',
            }}
          >
            <Icon 
              sx={{ 
                color: iconColor,
                fontSize: 28,
                filter: isHovered ? 'brightness(1.2)' : 'brightness(1)',
                transition: 'all 0.25s ease',
              }} 
            />
          </Box>
          
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600, 
              color: isDarkMode ? '#ffffff' : '#0B1929',
              mb: 1,
              letterSpacing: '-0.01em',
            }}
          >
            {title}
          </Typography>
          
          <Typography 
            variant="body2" 
            sx={{ 
              color: isDarkMode 
                ? 'rgba(255, 255, 255, 0.6)' 
                : 'rgba(11, 25, 41, 0.65)',
              lineHeight: 1.5,
            }}
          >
            {description}
          </Typography>

          {/* Animated accent line on hover */}
          {isHovered && (
            <Box
              sx={{
                position: 'absolute',
                bottom: -2,
                left: 0,
                right: 0,
                height: '3px',
                background: `linear-gradient(90deg, 
                  ${iconColor} 0%, 
                  ${isDarkMode ? '#a78bfa' : '#2BC4A8'} 100%)`,
                animation: 'slideIn 0.3s ease',
                '@keyframes slideIn': {
                  from: { transform: 'translateX(-100%)' },
                  to: { transform: 'translateX(0)' },
                },
              }}
            />
          )}
        </Box>
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
  const { isDarkMode } = useTheme();
  
  const reportTypes = [
    { 
      title: 'Financial Reports', 
      description: 'Production, collections, and accounts receivable', 
      category: 'financial_report',
      icon: AccountBalanceIcon,
      color: isDarkMode ? '#64ffda' : '#3EE4C8'
    },
    { 
      title: 'Patient Reports', 
      description: 'Demographics, retention, and satisfaction', 
      category: 'patient_report',
      icon: PeopleIcon,
      color: isDarkMode ? '#60a5fa' : '#1976D2'
    },
    { 
      title: 'Insurance Analysis', 
      description: 'Claims, payments, and aging reports', 
      category: 'insurance_analysis',
      icon: TrendingUpIcon,
      color: isDarkMode ? '#a78bfa' : '#7B1FA2'
    },
    { 
      title: 'Operational Metrics', 
      description: 'Appointment utilization and staff productivity', 
      category: 'operational_metrics',
      icon: SpeedIcon,
      color: isDarkMode ? '#34d399' : '#2E7D32'
    }
  ];

  const handleReportUpload = (document) => {
    console.log('New report uploaded:', document);
  };

  return (
    <Box sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header Section */}
      <Box sx={{ mb: 3 }}>
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            fontWeight: 600,
            color: isDarkMode ? '#ffffff' : '#0B1929',
            letterSpacing: '-0.02em',
            mb: 1.5,
            fontSize: { xs: '1.75rem', sm: '2.125rem' },
          }}
        >
          Reports & Analytics
        </Typography>
        <Typography 
          paragraph 
          sx={{
            color: isDarkMode 
              ? 'rgba(255, 255, 255, 0.6)' 
              : 'rgba(11, 25, 41, 0.65)',
            fontSize: '0.95rem',
            lineHeight: 1.6,
            mb: 0,
          }}
        >
          Generate comprehensive reports for financial, operational, and clinical insights.
        </Typography>
      </Box>
      
      {/* Report Cards Grid */}
      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
          gap: { xs: 2, sm: 3 },
          flex: 1,
          alignContent: 'start',
        }}
      >
        {reportTypes.map((report, index) => (
          <ReportCard 
            key={index}
            title={report.title}
            description={report.description}
            category={report.category}
            icon={report.icon}
            color={report.color}
            onUpload={handleReportUpload}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Reports;