// frontend/src/components/Dashboard/components/Settings/Settings.jsx
import React, { useState } from 'react';
import {
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  Divider,
  Chip
} from '@mui/material';
import {
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  Palette as PaletteIcon,
  Security as SecurityIcon,
  Chat as ChatIcon,
  Extension as ExtensionIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import ProfileSettings from './ProfileSettings';
import NotificationSettings from './NotificationSettings';
import AppearanceSettings from './AppearanceSettings';
import SecuritySettings from './SecuritySettings';
import ChatWidgetSettings from './ChatWidgetSettings';
import IntegrationSettings from './IntegrationSettings';
import { useTheme } from '../../../../context/ThemeContext';

const Settings = ({ onViewSessions }) => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const tabs = [
    { 
      label: 'Profile', 
      icon: <PersonIcon />, 
      component: <ProfileSettings />,
      color: isDarkMode ? '#64ffda' : '#3EE4C8'
    },
    // { 
    //   label: 'Notifications', 
    //   icon: <NotificationsIcon />, 
    //   component: <NotificationSettings />,
    //   color: isDarkMode ? '#fbbf24' : '#f59e0b'
    // },
    { 
      label: 'Appearance', 
      icon: <PaletteIcon />, 
      component: <AppearanceSettings />,
      color: isDarkMode ? '#a78bfa' : '#7B1FA2'
    },
    { 
      label: 'Security', 
      icon: <SecurityIcon />, 
      component: <SecuritySettings onViewSessions={onViewSessions} />,
      color: isDarkMode ? '#60a5fa' : '#1976D2'
    },
    // { 
    //   label: 'Chat Widget', 
    //   icon: <ChatIcon />, 
    //   component: <ChatWidgetSettings />,
    //   color: isDarkMode ? '#34d399' : '#2E7D32'
    // },
    // { 
    //   label: 'Integrations', 
    //   icon: <ExtensionIcon />, 
    //   component: <IntegrationSettings />,
    //   color: isDarkMode ? '#f87171' : '#dc2626'
    // }
  ];

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header Section */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              backgroundColor: isDarkMode 
                ? 'rgba(100, 255, 218, 0.1)' 
                : 'rgba(62, 228, 200, 0.1)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: isDarkMode 
                ? '1px solid rgba(100, 255, 218, 0.2)' 
                : '1px solid rgba(62, 228, 200, 0.2)',
            }}
          >
            <SettingsIcon 
              sx={{ 
                color: isDarkMode ? '#64ffda' : '#3EE4C8',
                fontSize: 24 
              }} 
            />
          </Box>
          <Box>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 600,
                color: isDarkMode ? '#ffffff' : '#0B1929',
                letterSpacing: '-0.02em',
              }}
            >
              Settings
            </Typography>
            <Typography 
              variant="body2" 
              sx={{
                color: isDarkMode 
                  ? 'rgba(255, 255, 255, 0.6)' 
                  : 'rgba(11, 25, 41, 0.6)',
                fontSize: '0.875rem',
              }}
            >
              Manage your practice settings, preferences, and integrations
            </Typography>
          </Box>
        </Box>
      </Box>

      <Paper 
        elevation={0} 
        sx={{ 
          flex: 1,
          borderRadius: '16px',
          background: isDarkMode 
            ? 'rgba(17, 24, 39, 0.25)'
            : 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(20px)',
          border: isDarkMode 
            ? '1px solid rgba(100, 255, 218, 0.1)' 
            : '1px solid rgba(62, 228, 200, 0.1)',
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: isDarkMode
              ? 'linear-gradient(135deg, rgba(100, 255, 218, 0.02) 0%, rgba(167, 139, 250, 0.02) 100%)'
              : 'linear-gradient(135deg, rgba(62, 228, 200, 0.03) 0%, rgba(43, 196, 168, 0.03) 100%)',
            pointerEvents: 'none',
            zIndex: 0,
          }
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            position: 'relative',
            zIndex: 1,
            borderBottom: isDarkMode 
              ? '1px solid rgba(100, 255, 218, 0.1)' 
              : '1px solid rgba(62, 228, 200, 0.1)',
            background: isDarkMode 
              ? 'rgba(17, 24, 39, 0.3)'
              : 'rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(10px)',
            '& .MuiTab-root': {
              minHeight: 64,
              textTransform: 'none',
              fontSize: '0.95rem',
              fontWeight: 500,
              color: isDarkMode 
                ? 'rgba(255, 255, 255, 0.7)' 
                : 'rgba(11, 25, 41, 0.7)',
              transition: 'all 0.25s ease',
              position: 'relative',
              '&:hover': {
                color: isDarkMode ? '#64ffda' : '#3EE4C8',
                backgroundColor: isDarkMode 
                  ? 'rgba(100, 255, 218, 0.05)' 
                  : 'rgba(62, 228, 200, 0.05)',
              },
              '& .MuiSvgIcon-root': {
                transition: 'all 0.25s ease',
              },
              '&.Mui-selected': {
                color: isDarkMode ? '#64ffda' : '#3EE4C8',
                '& .MuiSvgIcon-root': {
                  transform: 'scale(1.1)',
                  filter: 'brightness(1.2)',
                }
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: isDarkMode ? '#64ffda' : '#3EE4C8',
              height: 3,
              borderRadius: '3px 3px 0 0',
              boxShadow: isDarkMode
                ? '0 -4px 12px rgba(100, 255, 218, 0.3)'
                : '0 -4px 12px rgba(62, 228, 200, 0.3)',
            }
          }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 32,
                      height: 32,
                      borderRadius: '8px',
                      backgroundColor: activeTab === index
                        ? isDarkMode 
                          ? 'rgba(100, 255, 218, 0.1)' 
                          : 'rgba(62, 228, 200, 0.1)'
                        : 'transparent',
                      border: activeTab === index
                        ? isDarkMode 
                          ? '1px solid rgba(100, 255, 218, 0.2)' 
                          : '1px solid rgba(62, 228, 200, 0.2)'
                        : '1px solid transparent',
                      transition: 'all 0.25s ease',
                    }}
                  >
                    {React.cloneElement(tab.icon, {
                      sx: {
                        fontSize: 20,
                        color: activeTab === index ? tab.color : 'inherit'
                      }
                    })}
                  </Box>
                  <span>{tab.label}</span>
                  {activeTab === index && (
                    <Chip
                      size="small"
                      label="Active"
                      sx={{
                        height: 18,
                        fontSize: '0.65rem',
                        backgroundColor: isDarkMode 
                          ? 'rgba(100, 255, 218, 0.15)' 
                          : 'rgba(62, 228, 200, 0.15)',
                        color: isDarkMode ? '#64ffda' : '#3EE4C8',
                        border: 'none',
                        '& .MuiChip-label': {
                          px: 1,
                          fontWeight: 600,
                        }
                      }}
                    />
                  )}
                </Box>
              }
            />
          ))}
        </Tabs>

        <Box 
          sx={{ 
            p: 3,
            position: 'relative',
            zIndex: 1,
            height: 'calc(100% - 64px)',
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: isDarkMode 
                ? 'rgba(100, 255, 218, 0.05)' 
                : 'rgba(62, 228, 200, 0.05)',
            },
            '&::-webkit-scrollbar-thumb': {
              background: isDarkMode 
                ? 'rgba(100, 255, 218, 0.3)' 
                : 'rgba(62, 228, 200, 0.3)',
              borderRadius: '3px',
              '&:hover': {
                background: isDarkMode 
                  ? 'rgba(100, 255, 218, 0.5)' 
                  : 'rgba(62, 228, 200, 0.5)',
              },
            },
          }}
        >
          {/* Tab Panel Content */}
          <Box
            sx={{
              animation: 'fadeIn 0.3s ease',
              '@keyframes fadeIn': {
                from: { opacity: 0, transform: 'translateY(10px)' },
                to: { opacity: 1, transform: 'translateY(0)' },
              }
            }}
          >
            {tabs[activeTab].component}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Settings;