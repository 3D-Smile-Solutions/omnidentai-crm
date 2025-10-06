// frontend/src/components/Dashboard/components/Settings/AppearanceSettings.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Slider,
  Button,
  Alert,
  Divider
} from '@mui/material';
import {
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Brightness4 as AutoModeIcon,
  FormatSize as FontSizeIcon,
  ViewModule as CompactIcon,
  ViewStream as ComfortableIcon
} from '@mui/icons-material';

const AppearanceOption = ({ icon: Icon, title, description, selected, onClick }) => (
  <Paper
    onClick={onClick}
    elevation={0}
    sx={{
      p: 2.5,
      cursor: 'pointer',
      border: '2px solid',
      borderColor: selected ? '#3EE4C8' : 'divider',
      borderRadius: 2,
      transition: 'all 0.2s',
      '&:hover': {
        borderColor: selected ? '#3EE4C8' : 'rgba(62, 228, 200, 0.5)',
        boxShadow: selected ? '0 4px 12px rgba(62, 228, 200, 0.2)' : '0 2px 8px rgba(62, 228, 200, 0.1)'
      }
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      <Box
        sx={{
          p: 1,
          borderRadius: 1,
          bgcolor: selected ? 'rgba(62, 228, 200, 0.1)' : 'rgba(0, 0, 0, 0.04)',
          color: selected ? '#3EE4C8' : 'text.secondary',
          mr: 1.5
        }}
      >
        <Icon />
      </Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
    </Box>
    <Typography variant="body2" color="text.secondary" sx={{ ml: 6 }}>
      {description}
    </Typography>
  </Paper>
);

const AppearanceSettings = () => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('appearanceSettings');
    return saved ? JSON.parse(saved) : {
      theme: 'light',
      fontSize: 14,
      density: 'comfortable'
    };
  });

  const [success, setSuccess] = useState(false);

  const handleThemeChange = (theme) => {
    setSettings({ ...settings, theme });
  };

  const handleDensityChange = (density) => {
    setSettings({ ...settings, density });
  };

  const handleFontSizeChange = (event, newValue) => {
    setSettings({ ...settings, fontSize: newValue });
  };

  const handleSave = async () => {
    try {
      localStorage.setItem('appearanceSettings', JSON.stringify(settings));
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving appearance settings:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Appearance Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Customize how the dashboard looks and feels
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Appearance settings saved successfully!
        </Alert>
      )}

      {/* Theme Selection */}
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
        Theme
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2, mb: 4 }}>
        <AppearanceOption
          icon={LightModeIcon}
          title="Light"
          description="Clean and bright interface"
          selected={settings.theme === 'light'}
          onClick={() => handleThemeChange('light')}
        />
        <AppearanceOption
          icon={DarkModeIcon}
          title="Dark"
          description="Easy on the eyes in low light"
          selected={settings.theme === 'dark'}
          onClick={() => handleThemeChange('dark')}
        />
        <AppearanceOption
          icon={AutoModeIcon}
          title="Auto"
          description="Follows system preferences"
          selected={settings.theme === 'auto'}
          onClick={() => handleThemeChange('auto')}
        />
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Font Size */}
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
        Font Size
      </Typography>

      <Paper elevation={0} sx={{ p: 3, mb: 4, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FontSizeIcon sx={{ mr: 2, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            Adjust the text size throughout the dashboard
          </Typography>
        </Box>
        <Box sx={{ px: 2 }}>
          <Slider
            value={settings.fontSize}
            onChange={handleFontSizeChange}
            min={12}
            max={18}
            step={1}
            marks={[
              { value: 12, label: 'Small' },
              { value: 14, label: 'Medium' },
              { value: 16, label: 'Large' },
              { value: 18, label: 'Extra Large' }
            ]}
            sx={{
              color: '#3EE4C8',
              '& .MuiSlider-thumb': {
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: '0 0 0 8px rgba(62, 228, 200, 0.16)'
                }
              }
            }}
          />
        </Box>
        <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(62, 228, 200, 0.05)', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ fontSize: `${settings.fontSize}px` }}>
            Preview: This is how text will look at {settings.fontSize}px
          </Typography>
        </Box>
      </Paper>

      <Divider sx={{ my: 3 }} />

      {/* Density/Layout */}
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
        Layout Density
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2, mb: 4 }}>
        <AppearanceOption
          icon={CompactIcon}
          title="Compact"
          description="More information in less space"
          selected={settings.density === 'compact'}
          onClick={() => handleDensityChange('compact')}
        />
        <AppearanceOption
          icon={ComfortableIcon}
          title="Comfortable"
          description="Spacious layout with more breathing room"
          selected={settings.density === 'comfortable'}
          onClick={() => handleDensityChange('comfortable')}
        />
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
          Save Changes
        </Button>
      </Box>
    </Box>
  );
};

export default AppearanceSettings;