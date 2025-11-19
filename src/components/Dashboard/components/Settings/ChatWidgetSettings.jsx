// frontend/src/components/Dashboard/components/Settings/ChatWidgetSettings.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Switch,
  FormControlLabel,
  Alert,
  Divider,
  Chip,
  Grid
} from '@mui/material';
import {
  ColorLens as ColorLensIcon,
  Schedule as ScheduleIcon,
  Message as MessageIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';

const ChatWidgetSettings = () => {
  const [settings, setSettings] = useState({
    widgetEnabled: true,
    primaryColor: '#3EE4C8',
    welcomeMessage: 'Hi! How can we help you today?',
    offlineMessage: 'We are currently offline. Leave us a message and we\'ll get back to you soon!',
    autoReplyEnabled: true,
    autoReplyMessage: 'Thanks for reaching out! We\'ll respond shortly.',
    businessHoursEnabled: true,
    mondayStart: '09:00',
    mondayEnd: '17:00',
    tuesdayStart: '09:00',
    tuesdayEnd: '17:00',
    wednesdayStart: '09:00',
    wednesdayEnd: '17:00',
    thursdayStart: '09:00',
    thursdayEnd: '17:00',
    fridayStart: '09:00',
    fridayEnd: '17:00',
    saturdayStart: '10:00',
    saturdayEnd: '14:00',
    sundayClosed: true
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (field, value) => {
    setSettings({
      ...settings,
      [field]: value
    });
  };

  const handleSave = async () => {
    try {
      // TODO: Save to backend
      const response = await fetch('https://omnidentai-crm.onrender.com/api/settings/chat-widget', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error saving chat widget settings:', error);
    }
  };

  const days = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Chat Widget Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Customize how your chat widget appears and behaves on your website
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Chat widget settings saved successfully!
        </Alert>
      )}

      {/* Widget Status */}
      <Paper elevation={0} sx={{ p: 2.5, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={settings.widgetEnabled}
              onChange={(e) => handleChange('widgetEnabled', e.target.checked)}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#3EE4C8'
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: '#3EE4C8'
                }
              }}
            />
          }
          label={
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Enable Chat Widget
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Show the chat widget on your website
              </Typography>
            </Box>
          }
        />
      </Paper>

      {/* Appearance */}
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
        <ColorLensIcon sx={{ fontSize: 20, mr: 1, verticalAlign: 'middle' }} />
        Appearance
      </Typography>

      <Paper elevation={0} sx={{ p: 2.5, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
            Primary Color
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              type="color"
              value={settings.primaryColor}
              onChange={(e) => handleChange('primaryColor', e.target.value)}
              sx={{ width: 80 }}
            />
            <TextField
              value={settings.primaryColor}
              onChange={(e) => handleChange('primaryColor', e.target.value)}
              placeholder="#3EE4C8"
              size="small"
              sx={{ width: 150 }}
            />
            <Chip
              label="Preview"
              sx={{
                bgcolor: settings.primaryColor,
                color: '#fff',
                fontWeight: 600
              }}
            />
          </Box>
        </Box>
      </Paper>

      <Divider sx={{ my: 3 }} />

      {/* Messages */}
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
        <MessageIcon sx={{ fontSize: 20, mr: 1, verticalAlign: 'middle' }} />
        Messages
      </Typography>

      <Paper elevation={0} sx={{ p: 2.5, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <TextField
          fullWidth
          label="Welcome Message"
          value={settings.welcomeMessage}
          onChange={(e) => handleChange('welcomeMessage', e.target.value)}
          margin="normal"
          multiline
          rows={2}
        />
        <TextField
          fullWidth
          label="Offline Message"
          value={settings.offlineMessage}
          onChange={(e) => handleChange('offlineMessage', e.target.value)}
          margin="normal"
          multiline
          rows={2}
        />
        
        <Box sx={{ mt: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.autoReplyEnabled}
                onChange={(e) => handleChange('autoReplyEnabled', e.target.checked)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#3EE4C8'
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#3EE4C8'
                  }
                }}
              />
            }
            label="Enable Auto-Reply"
          />
        </Box>

        {settings.autoReplyEnabled && (
          <TextField
            fullWidth
            label="Auto-Reply Message"
            value={settings.autoReplyMessage}
            onChange={(e) => handleChange('autoReplyMessage', e.target.value)}
            margin="normal"
            multiline
            rows={2}
          />
        )}
      </Paper>

      <Divider sx={{ my: 3 }} />

      {/* Business Hours */}
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
        <ScheduleIcon sx={{ fontSize: 20, mr: 1, verticalAlign: 'middle' }} />
        Business Hours
      </Typography>

      <Paper elevation={0} sx={{ p: 2.5, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={settings.businessHoursEnabled}
              onChange={(e) => handleChange('businessHoursEnabled', e.target.checked)}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#3EE4C8'
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: '#3EE4C8'
                }
              }}
            />
          }
          label="Enable Business Hours"
          sx={{ mb: 2 }}
        />

        {settings.businessHoursEnabled && (
          <Box>
            {days.map(({ key, label }) => {
              const closedKey = `${key}Closed`;
              const isClosed = settings[closedKey];
              
              return (
                <Grid container spacing={2} key={key} alignItems="center" sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {label}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <TextField
                      type="time"
                      size="small"
                      fullWidth
                      disabled={isClosed}
                      value={settings[`${key}Start`]}
                      onChange={(e) => handleChange(`${key}Start`, e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <TextField
                      type="time"
                      size="small"
                      fullWidth
                      disabled={isClosed}
                      value={settings[`${key}End`]}
                      onChange={(e) => handleChange(`${key}End`, e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={!isClosed}
                          onChange={(e) => handleChange(closedKey, !e.target.checked)}
                          size="small"
                        />
                      }
                      label={isClosed ? "Closed" : "Open"}
                    />
                  </Grid>
                </Grid>
              );
            })}
          </Box>
        )}
      </Paper>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-start' }}>
        <Button
          variant="contained"
          onClick={handleSave}
          sx={{
            bgcolor: '#3EE4C8',
            color: '#0B1929',
            px: 4,
            '&:hover': {
              bgcolor: '#2BC4A8'
            }
          }}
        >
          Save Widget Settings
        </Button>
      </Box>
    </Box>
  );
};

export default ChatWidgetSettings;