// frontend/src/components/Dashboard/components/Settings/IntegrationSettings.jsx
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
  IconButton,
  InputAdornment
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  CalendarMonth as CalendarIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

const IntegrationCard = ({ 
  icon: Icon, 
  title, 
  description, 
  connected, 
  onToggle, 
  children 
}) => (
  <Paper
    elevation={0}
    sx={{
      p: 2.5,
      mb: 3,
      border: '1px solid',
      borderColor: connected ? 'rgba(62, 228, 200, 0.3)' : 'divider',
      borderRadius: 2,
      transition: 'all 0.2s',
      '&:hover': {
        borderColor: '#3EE4C8',
        boxShadow: '0 2px 8px rgba(62, 228, 200, 0.1)'
      }
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
        <Box
          sx={{
            p: 1,
            borderRadius: 1,
            bgcolor: connected ? 'rgba(62, 228, 200, 0.1)' : 'rgba(0, 0, 0, 0.04)',
            color: connected ? '#3EE4C8' : 'text.secondary',
            mr: 2
          }}
        >
          <Icon />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
            {connected ? (
              <Chip
                icon={<CheckCircleIcon />}
                label="Connected"
                size="small"
                sx={{
                  bgcolor: 'rgba(62, 228, 200, 0.1)',
                  color: '#3EE4C8',
                  fontWeight: 500
                }}
              />
            ) : (
              <Chip
                icon={<ErrorIcon />}
                label="Not Connected"
                size="small"
                variant="outlined"
                sx={{
                  borderColor: 'rgba(0, 0, 0, 0.23)',
                  color: 'text.secondary'
                }}
              />
            )}
          </Box>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Box>
      </Box>
      <Switch
        checked={connected}
        onChange={onToggle}
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
    
    {connected && children && (
      <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        {children}
      </Box>
    )}
  </Paper>
);

const IntegrationSettings = () => {
  const [integrations, setIntegrations] = useState({
    twilio: {
      enabled: false,
      accountSid: '',
      authToken: '',
      phoneNumber: ''
    },
    email: {
      enabled: false,
      smtpHost: '',
      smtpPort: '',
      smtpUser: '',
      smtpPassword: '',
      fromEmail: ''
    },
    calendar: {
      enabled: false,
      provider: 'google',
      syncEnabled: true
    }
  });

  const [showPasswords, setShowPasswords] = useState({
    twilioAuthToken: false,
    smtpPassword: false
  });

  const [success, setSuccess] = useState(false);
  const [testingConnection, setTestingConnection] = useState({
    twilio: false,
    email: false
  });

  const handleToggleIntegration = (integration) => {
    setIntegrations({
      ...integrations,
      [integration]: {
        ...integrations[integration],
        enabled: !integrations[integration].enabled
      }
    });
  };

  const handleFieldChange = (integration, field, value) => {
    setIntegrations({
      ...integrations,
      [integration]: {
        ...integrations[integration],
        [field]: value
      }
    });
  };

  const handleTestConnection = async (integration) => {
    setTestingConnection({ ...testingConnection, [integration]: true });
    
    try {
      const response = await fetch(`http://localhost:5000/api/settings/test/${integration}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(integrations[integration])
      });

      const data = await response.json();
      
      if (response.ok) {
        alert(`${integration} connection successful!`);
      } else {
        alert(`${integration} connection failed: ${data.error}`);
      }
    } catch (error) {
      alert(`Error testing ${integration}: ${error.message}`);
    } finally {
      setTestingConnection({ ...testingConnection, [integration]: false });
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/settings/integrations', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(integrations)
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error saving integration settings:', error);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field]
    });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Integrations
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Connect third-party services to enhance your practice management
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Integration settings saved successfully!
        </Alert>
      )}

      {/* Twilio Integration */}
      <IntegrationCard
        icon={PhoneIcon}
        title="Twilio Voice & SMS"
        description="Enable phone calls and SMS messaging directly from the dashboard"
        connected={integrations.twilio.enabled}
        onToggle={() => handleToggleIntegration('twilio')}
      >
        <TextField
          fullWidth
          label="Account SID"
          value={integrations.twilio.accountSid}
          onChange={(e) => handleFieldChange('twilio', 'accountSid', e.target.value)}
          margin="normal"
          size="small"
          placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        />
        <TextField
          fullWidth
          label="Auth Token"
          type={showPasswords.twilioAuthToken ? 'text' : 'password'}
          value={integrations.twilio.authToken}
          onChange={(e) => handleFieldChange('twilio', 'authToken', e.target.value)}
          margin="normal"
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => togglePasswordVisibility('twilioAuthToken')}
                  edge="end"
                  size="small"
                >
                  {showPasswords.twilioAuthToken ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <TextField
          fullWidth
          label="Twilio Phone Number"
          value={integrations.twilio.phoneNumber}
          onChange={(e) => handleFieldChange('twilio', 'phoneNumber', e.target.value)}
          margin="normal"
          size="small"
          placeholder="+1234567890"
        />
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleTestConnection('twilio')}
            disabled={testingConnection.twilio}
            sx={{
              borderColor: '#3EE4C8',
              color: '#0B1929',
              '&:hover': {
                borderColor: '#2BC4A8',
                backgroundColor: 'rgba(62, 228, 200, 0.05)'
              }
            }}
          >
            {testingConnection.twilio ? 'Testing...' : 'Test Connection'}
          </Button>
        </Box>
      </IntegrationCard>

      {/* Email Integration */}
      <IntegrationCard
        icon={EmailIcon}
        title="Email Service (SMTP)"
        description="Send automated emails, notifications, and appointment reminders"
        connected={integrations.email.enabled}
        onToggle={() => handleToggleIntegration('email')}
      >
        <TextField
          fullWidth
          label="SMTP Host"
          value={integrations.email.smtpHost}
          onChange={(e) => handleFieldChange('email', 'smtpHost', e.target.value)}
          margin="normal"
          size="small"
          placeholder="smtp.gmail.com"
        />
        <TextField
          fullWidth
          label="SMTP Port"
          value={integrations.email.smtpPort}
          onChange={(e) => handleFieldChange('email', 'smtpPort', e.target.value)}
          margin="normal"
          size="small"
          placeholder="587"
        />
        <TextField
          fullWidth
          label="SMTP Username"
          value={integrations.email.smtpUser}
          onChange={(e) => handleFieldChange('email', 'smtpUser', e.target.value)}
          margin="normal"
          size="small"
          placeholder="your-email@gmail.com"
        />
        <TextField
          fullWidth
          label="SMTP Password"
          type={showPasswords.smtpPassword ? 'text' : 'password'}
          value={integrations.email.smtpPassword}
          onChange={(e) => handleFieldChange('email', 'smtpPassword', e.target.value)}
          margin="normal"
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => togglePasswordVisibility('smtpPassword')}
                  edge="end"
                  size="small"
                >
                  {showPasswords.smtpPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <TextField
          fullWidth
          label="From Email"
          value={integrations.email.fromEmail}
          onChange={(e) => handleFieldChange('email', 'fromEmail', e.target.value)}
          margin="normal"
          size="small"
          placeholder="noreply@yourpractice.com"
        />
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleTestConnection('email')}
            disabled={testingConnection.email}
            sx={{
              borderColor: '#3EE4C8',
              color: '#0B1929',
              '&:hover': {
                borderColor: '#2BC4A8',
                backgroundColor: 'rgba(62, 228, 200, 0.05)'
              }
            }}
          >
            {testingConnection.email ? 'Testing...' : 'Test Connection'}
          </Button>
        </Box>
      </IntegrationCard>

      {/* Calendar Integration */}
      <IntegrationCard
        icon={CalendarIcon}
        title="Calendar Sync"
        description="Sync appointments with Google Calendar or Outlook"
        connected={integrations.calendar.enabled}
        onToggle={() => handleToggleIntegration('calendar')}
      >
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Connect your calendar to automatically sync appointments
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              sx={{
                borderColor: '#3EE4C8',
                color: '#0B1929',
                '&:hover': {
                  borderColor: '#2BC4A8',
                  backgroundColor: 'rgba(62, 228, 200, 0.05)'
                }
              }}
            >
              Connect Google Calendar
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: 'divider',
                color: 'text.primary',
                '&:hover': {
                  borderColor: 'text.primary',
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              Connect Outlook
            </Button>
          </Box>
          <FormControlLabel
            control={
              <Switch
                checked={integrations.calendar.syncEnabled}
                onChange={(e) => handleFieldChange('calendar', 'syncEnabled', e.target.checked)}
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
            label="Enable automatic sync"
            sx={{ mt: 2 }}
          />
        </Box>
      </IntegrationCard>

      <Divider sx={{ my: 3 }} />

      {/* Coming Soon */}
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
        Coming Soon
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        <Chip label="QuickBooks" variant="outlined" />
        <Chip label="Stripe Payments" variant="outlined" />
        <Chip label="Mailchimp" variant="outlined" />
        <Chip label="Zapier" variant="outlined" />
        <Chip label="Slack" variant="outlined" />
      </Box>

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
          Save Integration Settings
        </Button>
      </Box>
    </Box>
  );
};

export default IntegrationSettings;