// frontend/src/components/Dashboard/components/Settings/Settings.jsx
import React, { useState } from 'react';
import {
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import {
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  Palette as PaletteIcon,
  Security as SecurityIcon,
  Chat as ChatIcon,
  Extension as ExtensionIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import ProfileSettings from './ProfileSettings';
import NotificationSettings from './NotificationSettings';
import AppearanceSettings from './AppearanceSettings';
import SecuritySettings from './SecuritySettings';
import ChatWidgetSettings from './ChatWidgetSettings';
import IntegrationSettings from './IntegrationSettings';

const Settings = ({ onViewSessions }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const tabs = [
    { label: 'Profile', icon: <PersonIcon />, component: <ProfileSettings /> },
    // { label: 'Notifications', icon: <NotificationsIcon />, component: <NotificationSettings /> },
    { label: 'Appearance', icon: <PaletteIcon />, component: <AppearanceSettings /> },
    { label: 'Security', icon: <SecurityIcon />, component: <SecuritySettings onViewSessions={onViewSessions} /> },
    // { label: 'Chat Widget', icon: <ChatIcon />, component: <ChatWidgetSettings /> },
    // { label: 'Integrations', icon: <ExtensionIcon />, component: <IntegrationSettings /> }
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
        Settings
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Manage your practice settings, preferences, and integrations
      </Typography>

      <Paper elevation={0} sx={{ 
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden'
      }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              minHeight: 64,
              textTransform: 'none',
              fontSize: '0.95rem',
              fontWeight: 500
            },
            '& .Mui-selected': {
              color: '#3EE4C8'
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#3EE4C8'
            }
          }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={tab.label}
              icon={tab.icon}
              iconPosition="start"
            />
          ))}
        </Tabs>

        <Box sx={{ p: 3 }}>
          {tabs[activeTab].component}
        </Box>
      </Paper>
    </Box>
  );
};

export default Settings;