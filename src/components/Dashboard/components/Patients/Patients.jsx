// 11. src/components/Dashboard/components/Patients/Patients.jsx
// ===========================================
import React from 'react';
import { Box, Button } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import PatientList from '../../../PatientList';
import ChatInterface from '../../../ChatInterface';

const Patients = ({ 
  patients, 
  selectedPatient, 
  onSelectPatient, 
  onSendMessage, 
  isMobile 
}) => {
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
        <Box sx={{ mb: 1, px: 2, pt: 1 }}>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => onSelectPatient(null)}
            size="small"
            sx={{
              backgroundColor: '#3EE4C8',
              color: '#0B1929',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 2,
              px: 2,
              py: 0.5,
              fontSize: '0.875rem',
              boxShadow: '0 2px 8px rgba(62, 228, 200, 0.2)',
              '&:hover': {
                backgroundColor: '#35ccb3',
                boxShadow: '0 4px 12px rgba(62, 228, 200, 0.3)',
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.2s ease'
            }}
          >
            Back to Patients
          </Button>
        </Box>
      )}
      
      {/* Main content area */}
      <Box sx={{ 
        display: 'flex',
        flex: 1,
        overflow: 'hidden',
        borderRadius: '12px',
        boxShadow: isMobile ? 'none' : '0 2px 12px rgba(0,0,0,0.08)',
        background: 'transparent',
        margin: isMobile ? '8px' : 2,
        height: isMobile && selectedPatient ? 'calc(100vh - 200px)' : 'calc(100vh - 180px)'
      }}>
        {/* Patient List - hide on mobile when patient is selected */}
        <Box sx={{ 
          display: isMobile && selectedPatient ? 'none' : 'block',
          width: isMobile ? '100%' : 'auto'
        }}>
          <PatientList 
            patients={patients}
            selectedPatient={selectedPatient}
            onSelectPatient={onSelectPatient}
            isMobile={isMobile}
          />
        </Box>
        
        {/* Chat Interface - full width on mobile, show only when patient selected */}
        <Box sx={{ 
          display: isMobile && !selectedPatient ? 'none' : 'block',
          width: isMobile ? '100%' : 'auto',
          flex: isMobile ? 'none' : 1
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