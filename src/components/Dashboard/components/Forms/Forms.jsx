// frontend/src/components/Dashboard/components/Forms/Forms.jsx
import React, { useState } from 'react';
import { Typography, Box, Paper } from '@mui/material';
import { Description as FormsIcon } from '@mui/icons-material';
import DocumentViewer from '../DocumentViewer/DocumentViewer';
import { useTheme } from '../../../../context/ThemeContext';

const FormCard = ({ title, description, category, onUpload, icon: Icon = FormsIcon, color }) => {
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
              transform: isHovered ? 'scale(1.1)' : 'scale(1)',
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
        documentType="form"
        onUpload={onUpload}
      />
    </>
  );
};

const Forms = () => {
  const { isDarkMode } = useTheme();
  
  const formTypes = [
    { 
      title: 'Patient Intake', 
      description: 'New patient information form', 
      category: 'patient_intake',
      color: isDarkMode ? '#64ffda' : '#3EE4C8'
    },
    { 
      title: 'Medical History', 
      description: 'Comprehensive health questionnaire', 
      category: 'medical_history',
      color: isDarkMode ? '#60a5fa' : '#1976D2'
    },
    { 
      title: 'Consent Forms', 
      description: 'Treatment consent documents', 
      category: 'consent_forms',
      color: isDarkMode ? '#a78bfa' : '#7B1FA2'
    },
    { 
      title: 'Insurance Forms', 
      description: 'Insurance verification docs', 
      category: 'insurance_forms',
      color: isDarkMode ? '#34d399' : '#2E7D32'
    }
  ];

  const handleFormUpload = (document) => {
    console.log('New form uploaded:', document);
  };

  return (
    <Box sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Box sx={{ mb: 3 }}>
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            fontWeight: 600,
            color: isDarkMode ? '#ffffff' : '#ffffff',
            letterSpacing: '-0.02em',
            mb: 1.5,
            fontSize: { xs: '1.75rem', sm: '2.125rem' },
          }}
        >
          Digital Forms
        </Typography>
        <Typography 
          paragraph 
          sx={{
            color: isDarkMode 
              ? 'rgba(255, 255, 255, 0.6)' 
              : 'rgba(255, 255, 255, 0.6)',
            fontSize: '0.95rem',
            lineHeight: 1.6,
            mb: 0,
          }}
        >
          Create, manage, and track digital forms for patient intake, consent, and medical history.
        </Typography>
      </Box>
      
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
        {formTypes.map((form, index) => (
          <FormCard 
            key={index}
            title={form.title}
            description={form.description}
            category={form.category}
            color={form.color}
            onUpload={handleFormUpload}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Forms;