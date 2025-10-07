// 11. src/components/Dashboard/components/Patients/Patients.jsx
// ===========================================
import React from 'react';
import { Box, Button } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import PatientList from '../../../PatientList';
import ChatInterface from '../../../ChatInterface';
import { useTheme } from '../../../../context/ThemeContext';

const Patients = ({ 
  patients, 
  selectedPatient, 
  onSelectPatient, 
  onSendMessage, 
  isMobile 
}) => {
  const { isDarkMode } = useTheme();

  return (
    <Box sx={{ 
      height: 'calc(100vh - 140px)',
      display: 'flex',
      flexDirection: 'column',
      ml: -3,
      mr: -3,
      mt: -2,
      position: 'relative'
    }}>
      {/* Mobile back button when patient is selected */}
      {isMobile && selectedPatient && (
        <Box sx={{ 
          mb: 1, 
          px: 2, 
          pt: 1,
          position: 'relative',
          zIndex: 10,
        }}>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => onSelectPatient(null)}
            size="small"
            sx={{
              background: isDarkMode
                ? 'linear-gradient(135deg, rgba(100, 255, 218, 0.15) 0%, rgba(100, 255, 218, 0.1) 100%)'
                : 'linear-gradient(135deg, rgba(62, 228, 200, 0.2) 0%, rgba(62, 228, 200, 0.15) 100%)',
              backdropFilter: 'blur(10px)',
              color: isDarkMode ? '#64ffda' : '#0B1929',
              border: isDarkMode 
                ? '1px solid rgba(100, 255, 218, 0.2)' 
                : '1px solid rgba(62, 228, 200, 0.2)',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: '10px',
              px: 2.5,
              py: 0.75,
              fontSize: '0.875rem',
              boxShadow: isDarkMode
                ? '0 4px 16px rgba(100, 255, 218, 0.15)'
                : '0 4px 16px rgba(62, 228, 200, 0.2)',
              '&:hover': {
                background: isDarkMode
                  ? 'linear-gradient(135deg, rgba(100, 255, 218, 0.2) 0%, rgba(100, 255, 218, 0.15) 100%)'
                  : 'linear-gradient(135deg, rgba(62, 228, 200, 0.25) 0%, rgba(62, 228, 200, 0.2) 100%)',
                boxShadow: isDarkMode
                  ? '0 6px 20px rgba(100, 255, 218, 0.2)'
                  : '0 6px 20px rgba(62, 228, 200, 0.3)',
                transform: 'translateY(-1px)',
                border: isDarkMode 
                  ? '1px solid rgba(100, 255, 218, 0.3)' 
                  : '1px solid rgba(62, 228, 200, 0.3)',
              },
              '&:active': {
                transform: 'translateY(0)',
              },
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            Back to Patients
          </Button>
        </Box>
      )}
      
      {/* Main content area with glassmorphic container */}
      <Box sx={{ 
        display: 'flex',
        flex: 1,
        overflow: 'hidden',
        borderRadius: '16px',
        background: isDarkMode 
          ? 'rgba(17, 24, 39, 0.25)'
          : 'rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(20px)',
        border: isDarkMode 
          ? '1px solid rgba(100, 255, 218, 0.1)' 
          : '1px solid rgba(62, 228, 200, 0.1)',
        boxShadow: isDarkMode
          ? '0 8px 32px rgba(0, 0, 0, 0.3)'
          : '0 8px 32px rgba(0, 0, 0, 0.08)',
        margin: isMobile ? '8px' : 2,
        height: isMobile && selectedPatient ? 'calc(100vh - 200px)' : 'calc(100vh - 180px)',
        position: 'relative',
      }}>
        {/* Subtle background gradient overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: isDarkMode
              ? 'linear-gradient(135deg, rgba(100, 255, 218, 0.02) 0%, rgba(167, 139, 250, 0.02) 100%)'
              : 'linear-gradient(135deg, rgba(62, 228, 200, 0.03) 0%, rgba(43, 196, 168, 0.03) 100%)',
            pointerEvents: 'none',
            borderRadius: '16px',
            zIndex: 0,
          }}
        />

        {/* Animated accent lines */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '2px',
            background: isDarkMode
              ? 'linear-gradient(90deg, transparent, rgba(100, 255, 218, 0.5), transparent)'
              : 'linear-gradient(90deg, transparent, rgba(62, 228, 200, 0.6), transparent)',
            opacity: 0.5,
            animation: 'slideAccent 3s ease-in-out infinite',
            '@keyframes slideAccent': {
              '0%': { transform: 'translateX(-100%)' },
              '100%': { transform: 'translateX(100%)' },
            },
            borderRadius: '16px 16px 0 0',
            zIndex: 1,
          }}
        />
        
        {/* Patient List - with glassmorphic styling */}
        <Box sx={{ 
          display: isMobile && selectedPatient ? 'none' : 'block',
          width: isMobile ? '100%' : 'auto',
          position: 'relative',
          zIndex: 2,
          borderRight: !isMobile && isDarkMode 
            ? '1px solid rgba(100, 255, 218, 0.1)' 
            : !isMobile && '1px solid rgba(62, 228, 200, 0.1)',
          background: !isMobile && (isDarkMode
            ? 'rgba(17, 24, 39, 0.1)'
            : 'rgba(255, 255, 255, 0.1)'),
        }}>
          <PatientList 
            patients={patients}
            selectedPatient={selectedPatient}
            onSelectPatient={onSelectPatient}
            isMobile={isMobile}
          />
        </Box>
        
        {/* Chat Interface - with glassmorphic styling */}
        <Box sx={{ 
          display: isMobile && !selectedPatient ? 'none' : 'block',
          width: isMobile ? '100%' : 'auto',
          flex: isMobile ? 'none' : 1,
          position: 'relative',
          zIndex: 2,
          background: isDarkMode
            ? 'rgba(17, 24, 39, 0.05)'
            : 'rgba(255, 255, 255, 0.05)',
        }}>
          <ChatInterface 
            patient={selectedPatient}
            onSendMessage={onSendMessage}
            isMobile={isMobile}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Patients;