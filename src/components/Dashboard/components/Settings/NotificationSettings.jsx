// frontend/src/components/Dashboard/components/Settings/NotificationSettings.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  FormGroup,
  Divider,
  Paper,
  Button,
  Alert
} from '@mui/material';
import {
  Email as EmailIcon,
  Notifications as NotificationsIcon,
  VolumeUp as VolumeUpIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';

const NotificationCard = ({ icon: Icon, title, description, checked, onChange, name }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2.5,
      mb: 2,
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 2,
      transition: 'all 0.2s',
      '&:hover': {
        borderColor: '#3EE4C8',
        boxShadow: '0 2px 8px rgba(62, 228, 200, 0.1)'
      }
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}>
        <Box
          sx={{
            p: 1,
            borderRadius: 1,
            bgcolor: 'rgba(62, 228, 200, 0.1)',
            color: '#3EE4C8',
            mr: 2,
            mt: 0.5
          }}
        >
          <Icon />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Box>
      </Box>
      <Switch
        checked={checked}
        onChange={onChange}
        name={name}
        sx={{
          '& .MuiSwitch-switchBase.Mui-checked': {
            color: '#3EE4C8'
          },
          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
            backgroundColor: '#3EE4C8'
          }
        }}
      />
    </Box>
  </Paper>
);

const NotificationSettings = () => {
  const [notifications, setNotifications] = useState({
    emailNewMessages: true,
    emailDailySummary: false,
    emailWeeklyReport: true,
    desktopNewMessages: true,
    desktopNewPatients: true,
    soundAlerts: true,
    soundNewMessages: false
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (event) => {
    setNotifications({
      ...notifications,
      [event.target.name]: event.target.checked
    });
  };

  const handleSave = async () => {
    // TODO: Save notification preferences to backend
    try {
      const response = await fetch('https://omnidentai-crm.onrender.com/api/settings/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(notifications)
      });

      if (!response.ok) {
        throw new Error('Failed to update notifications');
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating notifications:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Notification Preferences
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Choose how you want to be notified about important events
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Notification preferences saved successfully!
        </Alert>
      )}

      {/* Email Notifications */}
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
        Email Notifications
      </Typography>

      <NotificationCard
        icon={EmailIcon}
        title="New Messages"
        description="Receive email notifications when you get new messages from patients"
        checked={notifications.emailNewMessages}
        onChange={handleChange}
        name="emailNewMessages"
      />

      <NotificationCard
        icon={ScheduleIcon}
        title="Daily Summary"
        description="Get a daily summary of your conversations and appointments"
        checked={notifications.emailDailySummary}
        onChange={handleChange}
        name="emailDailySummary"
      />

      <NotificationCard
        icon={ScheduleIcon}
        title="Weekly Report"
        description="Receive weekly analytics and performance reports"
        checked={notifications.emailWeeklyReport}
        onChange={handleChange}
        name="emailWeeklyReport"
      />

      <Divider sx={{ my: 3 }} />

      {/* Desktop Notifications */}
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
        Desktop Notifications
      </Typography>

      <NotificationCard
        icon={NotificationsIcon}
        title="New Messages"
        description="Show desktop notifications for incoming messages while you're online"
        checked={notifications.desktopNewMessages}
        onChange={handleChange}
        name="desktopNewMessages"
      />

      <NotificationCard
        icon={NotificationsIcon}
        title="New Patients"
        description="Get notified when a new patient starts a conversation"
        checked={notifications.desktopNewPatients}
        onChange={handleChange}
        name="desktopNewPatients"
      />

      <Divider sx={{ my: 3 }} />

      {/* Sound Alerts */}
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
        Sound Alerts
      </Typography>

      <NotificationCard
        icon={VolumeUpIcon}
        title="Enable Sound Alerts"
        description="Play a sound when you receive notifications"
        checked={notifications.soundAlerts}
        onChange={handleChange}
        name="soundAlerts"
      />

      <NotificationCard
        icon={VolumeUpIcon}
        title="Message Sound"
        description="Play a sound for each new message (can be noisy)"
        checked={notifications.soundNewMessages}
        onChange={handleChange}
        name="soundNewMessages"
      />

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
          Save Preferences
        </Button>
      </Box>
    </Box>
  );
};

export default NotificationSettings;