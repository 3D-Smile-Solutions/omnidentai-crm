// 15. src/components/Dashboard/components/Settings/Settings.jsx
// ===========================================
import React from 'react';
import { Typography, Box, Paper, Button } from '@mui/material';

const SettingCard = ({ title, description, hasButton = false, buttonText, onButtonClick }) => (
  <Paper elevation={hasButton ? 0 : 1} sx={{ 
    p: 3, 
    mb: 2,
    ...(hasButton && {
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fffe 100%)',
      border: '1px solid rgba(62, 228, 200, 0.2)',
      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
      '&:hover': {
        boxShadow: '0 4px 20px rgba(62, 228, 200, 0.15)',
        transform: 'translateY(-2px)'
      }
    })
  }}>
    <Typography variant="h6" gutterBottom>{title}</Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: hasButton ? 2 : 0 }}>
      {description}
    </Typography>
    {hasButton && (
      <Button variant="outlined" onClick={onButtonClick} sx={{
        borderColor: '#3EE4C8',
        color: '#0B1929',
        '&:hover': {
          borderColor: '#2BC4A8',
          backgroundColor: 'rgba(62, 228, 200, 0.05)'
        }
      }}>
        {buttonText}
      </Button>
    )}
  </Paper>
);

const Settings = ({ onViewSessions }) => {
  const settingsOptions = [
    { title: 'Practice Information', description: 'Update practice details, hours, and contact information' },
    { title: 'User Management', description: 'Manage staff accounts, roles, and permissions' },
    { title: 'Billing & Insurance', description: 'Configure fee schedules, insurance plans, and payment settings' },
    { title: 'Integrations', description: 'Connect third-party services and APIs' }
  ];

  return (
    <>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Settings
      </Typography>
      <Typography paragraph color="text.secondary">
        Configure practice settings, user preferences, and system configurations.
      </Typography>
      <Box sx={{ mt: 3 }}>
        {settingsOptions.map((setting, index) => (
          <SettingCard 
            key={index}
            title={setting.title}
            description={setting.description}
          />
        ))}
        <SettingCard 
          title="Session History"
          description="View your login history and active sessions"
          hasButton={true}
          buttonText="View Sessions"
          onButtonClick={onViewSessions}
        />
      </Box>
    </>
  );
};

export default Settings;
