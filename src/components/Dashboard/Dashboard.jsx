// ===========================================
// FILE 2: src/components/Dashboard/Dashboard.jsx
// ===========================================
import React from 'react';
import {
  Box,
  CssBaseline,
  Container,
  Toolbar,
  CircularProgress,
  Alert
} from '@mui/material';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Overview from './components/Overview/Overview';
import Patients from './components/Patients/Patients';
import Forms from './components/Forms/Forms';
import Reports from './components/Reports/Reports';
import PracticeEnhancer from './components/PracticeEnhancer/PracticeEnhancer';
import Settings from './components/Settings/Settings';
import SessionHistory from '../SessionHistory';
import { useDashboard } from './hooks/useDashboard';
import { DRAWER_WIDTH } from './utils/constants';

const Dashboard = () => {
  const {
    mobileOpen,
    selectedIndex,
    setSelectedIndex,
    anchorEl,
    selectedPatient,
    setSelectedPatient,
    isMobile,
    patients,
    currentUser,
    patientsStatus,
    handleDrawerToggle,
    handleMenuOpen,
    handleMenuClose,
    handleLogout,
    handleSendMessage,
    setMobileOpen
  } = useDashboard();

  const renderContent = () => {
    switch (selectedIndex) {
      case 0:
        return <Overview isMobile={isMobile} />;
      case 1:
        // Show loading state for patients page
        if (patientsStatus === 'loading') {
          return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
              <CircularProgress sx={{ color: '#3EE4C8' }} />
            </Box>
          );
        }
        
        if (patientsStatus === 'failed') {
          return (
            <Alert severity="error" sx={{ mt: 2 }}>
              Failed to load patients. Please try refreshing the page.
            </Alert>
          );
        }

        return (
          <Patients 
            patients={patients}
            selectedPatient={selectedPatient}
            onSelectPatient={setSelectedPatient}
            onSendMessage={handleSendMessage}
            isMobile={isMobile}
          />
        );
      case 2:
        return <Forms />;
      case 3:
        return <Reports />;
      case 4:
        return <PracticeEnhancer isMobile={isMobile} />;
      case 5:
        return <Settings onViewSessions={() => setSelectedIndex(6)} />;
      case 6:
        return <SessionHistory />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      <Header 
        currentUser={currentUser}
        anchorEl={anchorEl}
        onDrawerToggle={handleDrawerToggle}
        onMenuOpen={handleMenuOpen}
        onMenuClose={handleMenuClose}
        onLogout={handleLogout}
      />
      
      <Sidebar 
        mobileOpen={mobileOpen}
        selectedIndex={selectedIndex}
        onDrawerToggle={handleDrawerToggle}
        onSelectIndex={setSelectedIndex}
        onMobileClose={() => setMobileOpen(false)}
      />
      
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` } }}
      >
        <Toolbar />
        
        <Container maxWidth="lg">
          <Box sx={{ mt: 2 }}>
            {renderContent()}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;