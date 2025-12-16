// src/components/Dashboard/Dashboard.jsx
import React, { useState, useMemo, useCallback } from 'react';
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
import SessionHistory from './components/Settings/SessionHistory';
import RevenueAnalytics from './components/Analytics/Revenueanalytics.jsx';
import AppointmentsAnalytics from './components/Analytics/Appointmentsanalytics.jsx';
import AIPerformanceAnalytics from './components/Analytics/Aiperformanceanalytics.jsx';
import PatientAnalytics from './components/Analytics/Patientanalytics.jsx';
import { useDashboard } from './hooks/useDashboard';
import { DRAWER_WIDTH } from './utils/constants';
import { useTheme } from '../../context/ThemeContext';

const Dashboard = () => {
  const { isDarkMode } = useTheme();
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  
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
    setMobileOpen,
    forms = [],
    reports = [],
  } = useDashboard();

  // Settings items - static searchable content
  const settingsItems = useMemo(() => [
    { id: 'profile', title: 'Profile Settings', subtitle: 'Update your personal information', type: 'settings' },
    { id: 'notifications', title: 'Notification Preferences', subtitle: 'Manage email and push notifications', type: 'settings' },
    { id: 'security', title: 'Security Settings', subtitle: 'Password, two-factor authentication', type: 'settings' },
    { id: 'practice', title: 'Practice Information', subtitle: 'Update practice details and branding', type: 'settings' },
    { id: 'billing', title: 'Billing & Subscription', subtitle: 'Manage your subscription and payment methods', type: 'settings' },
    { id: 'integrations', title: 'Integrations', subtitle: 'Connect third-party services', type: 'settings' },
    { id: 'team', title: 'Team Members', subtitle: 'Manage staff accounts and permissions', type: 'settings' },
    { id: 'sessions', title: 'Session History', subtitle: 'View login history and active sessions', type: 'settings' },
  ], []);

  // Forms items
  const formsItems = useMemo(() => {
    if (forms && forms.length > 0) {
      return forms.map(form => ({
        id: form.id,
        title: form.name || form.title || 'Untitled Form',
        subtitle: form.description || form.type || 'Form',
        type: 'form',
        data: form
      }));
    }
    return [
      { id: 'new-patient', title: 'New Patient Registration', subtitle: 'Patient intake form', type: 'form' },
      { id: 'medical-history', title: 'Medical History Form', subtitle: 'Health questionnaire', type: 'form' },
      { id: 'consent', title: 'Treatment Consent', subtitle: 'Consent documentation', type: 'form' },
      { id: 'insurance', title: 'Insurance Verification', subtitle: 'Insurance details form', type: 'form' },
      { id: 'hipaa', title: 'HIPAA Authorization', subtitle: 'Privacy authorization form', type: 'form' },
      { id: 'dental-history', title: 'Dental History', subtitle: 'Previous dental work form', type: 'form' },
    ];
  }, [forms]);

  // Reports items
  const reportsItems = useMemo(() => {
    if (reports && reports.length > 0) {
      return reports.map(report => ({
        id: report.id,
        title: report.name || report.title || 'Untitled Report',
        subtitle: report.description || report.type || 'Report',
        type: 'report',
        data: report
      }));
    }
    return [
      { id: 'revenue-report', title: 'Revenue Report', subtitle: 'Monthly income analysis', type: 'report' },
      { id: 'patient-report', title: 'Patient Analytics', subtitle: 'Patient demographics and trends', type: 'report' },
      { id: 'appointment-report', title: 'Appointment Report', subtitle: 'Scheduling analytics', type: 'report' },
      { id: 'treatment-report', title: 'Treatment Summary', subtitle: 'Procedures performed', type: 'report' },
      { id: 'collections-report', title: 'Collections Report', subtitle: 'Outstanding balances', type: 'report' },
      { id: 'referral-report', title: 'Referral Analytics', subtitle: 'Patient referral sources', type: 'report' },
    ];
  }, [reports]);

  // Global search function
  const searchResults = useMemo(() => {
    if (!globalSearchQuery.trim()) {
      return { patients: [], forms: [], reports: [], settings: [] };
    }

    const query = globalSearchQuery.toLowerCase().trim();
    
    const matchesQuery = (item, fields) => {
      return fields.some(field => {
        const value = item[field];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(query);
        }
        return false;
      });
    };

    const filteredPatients = (patients || []).filter(patient => {
      const firstName = patient.first_name || patient.firstName || '';
      const lastName = patient.last_name || patient.lastName || '';
      const fullName = `${firstName} ${lastName}`.toLowerCase();
      const email = (patient.email || '').toLowerCase();
      const phone = (patient.phone || patient.phone_number || '').toLowerCase();
      
      return (
        fullName.includes(query) ||
        firstName.toLowerCase().includes(query) ||
        lastName.toLowerCase().includes(query) ||
        email.includes(query) ||
        phone.includes(query)
      );
    }).map(patient => ({
      ...patient,
      title: `${patient.first_name || patient.firstName || ''} ${patient.last_name || patient.lastName || ''}`.trim(),
      subtitle: patient.email || patient.phone || ''
    }));

    const filteredForms = formsItems.filter(form => matchesQuery(form, ['title', 'subtitle', 'type']));
    const filteredReports = reportsItems.filter(report => matchesQuery(report, ['title', 'subtitle', 'type']));
    const filteredSettings = settingsItems.filter(item => matchesQuery(item, ['title', 'subtitle', 'type']));

    return {
      patients: filteredPatients,
      forms: filteredForms,
      reports: filteredReports,
      settings: filteredSettings
    };
  }, [globalSearchQuery, patients, formsItems, reportsItems, settingsItems]);

  const handleSearchChange = useCallback((query) => {
    setGlobalSearchQuery(query);
  }, []);

  const handleSearchResultClick = useCallback((navIndex, item, category) => {
    setSelectedIndex(navIndex);
    setGlobalSearchQuery('');

    if (item) {
      switch (category) {
        case 'patients':
          if (setSelectedPatient && item.id) {
            setSelectedPatient(item);
          }
          break;
        case 'settings':
          if (item.id === 'sessions') {
            setSelectedIndex(6);
          }
          break;
        default:
          break;
      }
    }
  }, [setSelectedIndex, setSelectedPatient]);

  const handleSelectIndex = useCallback((index) => {
    setSelectedIndex(index);
  }, [setSelectedIndex]);

  const renderContent = () => {
    switch (selectedIndex) {
      case 0:
        return <Overview isMobile={isMobile} />;
      case 1:
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
      // Analytics pages
      case 7:
        return <RevenueAnalytics />;
      case 8:
        return <AppointmentsAnalytics />;
      case 9:
        return <AIPerformanceAnalytics />;
      case 10:
        return <PatientAnalytics />;
      default:
        return null;
    }
  };

  // Check if current view needs full space (no padding/container)
  // Overview (0), Forms (2), Reports (3), Practice Enhancer (4), and Analytics pages (7-10) take full space
  const needsFullSpace = selectedIndex === 0 || selectedIndex === 2 || selectedIndex === 3 || selectedIndex === 4 || (selectedIndex >= 7 && selectedIndex <= 10);

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      
      <Header 
        currentUser={currentUser}
        anchorEl={anchorEl}
        onDrawerToggle={handleDrawerToggle}
        onMenuOpen={handleMenuOpen}
        onMenuClose={handleMenuClose}
        onLogout={handleLogout}
        searchQuery={globalSearchQuery}
        onSearchChange={handleSearchChange}
        searchResults={searchResults}
        onSearchResultClick={handleSearchResultClick}
      />
      
      <Sidebar 
        mobileOpen={mobileOpen}
        selectedIndex={selectedIndex}
        onDrawerToggle={handleDrawerToggle}
        onSelectIndex={handleSelectIndex}
        onMobileClose={() => setMobileOpen(false)}
      />
      
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: needsFullSpace ? 0 : 3, 
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: isDarkMode 
              ? 'rgba(0, 0, 0, 0.2)' 
              : 'rgba(255, 255, 255, 0.2)',
          },
          '&::-webkit-scrollbar-thumb': {
            background: isDarkMode 
              ? 'rgba(255, 255, 255, 0.2)' 
              : 'rgba(0, 0, 0, 0.2)',
            borderRadius: '4px',
            '&:hover': {
              background: isDarkMode 
                ? 'rgba(255, 255, 255, 0.3)' 
                : 'rgba(0, 0, 0, 0.3)',
            }
          },
          scrollbarWidth: 'thin',
          scrollbarColor: isDarkMode 
            ? 'rgba(255, 255, 255, 0.2) rgba(0, 0, 0, 0.2)' 
            : 'rgba(0, 0, 0, 0.2) rgba(255, 255, 255, 0.2)',
        }}
      >
        <Toolbar sx={{ flexShrink: 0 }} />
        
        {needsFullSpace ? (
          <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
            {renderContent()}
          </Box>
        ) : (
          <Container maxWidth="lg" sx={{ flex: 1, overflow: 'visible' }}>
            <Box sx={{ mt: 2, pb: 4 }}>
              {renderContent()}
            </Box>
          </Container>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;