// frontend/src/components/Dashboard/components/Settings/AppearanceSettings.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Slider,
  Button,
  Alert,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormGroup,
  FormControlLabel,
  Card,
  CardContent
} from '@mui/material';
import {
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Brightness4 as AutoModeIcon,
  FormatSize as FontSizeIcon,
  ViewModule as CompactIcon,
  ViewStream as ComfortableIcon,
  Palette as PaletteIcon,
  Brightness7 as BrightnessIcon
} from '@mui/icons-material';
import { useTheme } from '../../../../context/ThemeContext';

const AppearanceOption = ({ icon: Icon, title, description, selected, onClick, isDarkMode }) => (
  <Paper
    onClick={onClick}
    elevation={0}
    sx={{
      p: 2.5,
      cursor: 'pointer',
      background: isDarkMode 
        ? 'rgba(17, 24, 39, 0.25)'
        : 'rgba(255, 255, 255, 0.25)',
      backdropFilter: 'blur(20px)',
      border: '2px solid',
      borderColor: selected 
        ? (isDarkMode ? '#64ffda' : '#3EE4C8')
        : (isDarkMode ? 'rgba(100, 255, 218, 0.1)' : 'rgba(62, 228, 200, 0.1)'),
      borderRadius: '12px',
      transition: 'all 0.25s ease',
      '&:hover': {
        borderColor: selected 
          ? (isDarkMode ? '#64ffda' : '#3EE4C8')
          : (isDarkMode ? 'rgba(100, 255, 218, 0.3)' : 'rgba(62, 228, 200, 0.3)'),
        transform: 'translateY(-2px)',
        boxShadow: isDarkMode
          ? '0 8px 32px rgba(100, 255, 218, 0.15)'
          : '0 8px 32px rgba(62, 228, 200, 0.15)'
      }
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      <Box
        sx={{
          p: 1,
          borderRadius: '8px',
          backgroundColor: selected 
            ? (isDarkMode ? 'rgba(100, 255, 218, 0.1)' : 'rgba(62, 228, 200, 0.1)')
            : (isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'),
          color: selected 
            ? (isDarkMode ? '#64ffda' : '#3EE4C8')
            : (isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(11, 25, 41, 0.6)'),
          mr: 1.5,
          border: '1px solid',
          borderColor: selected
            ? (isDarkMode ? 'rgba(100, 255, 218, 0.2)' : 'rgba(62, 228, 200, 0.2)')
            : 'transparent'
        }}
      >
        <Icon />
      </Box>
      <Typography 
        variant="subtitle1" 
        sx={{ 
          fontWeight: 600,
          color: isDarkMode ? '#ffffff' : '#0B1929'
        }}
      >
        {title}
      </Typography>
    </Box>
    <Typography 
      variant="body2" 
      sx={{ 
        ml: 6,
        color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(11, 25, 41, 0.6)'
      }}
    >
      {description}
    </Typography>
  </Paper>
);

const AppearanceSettings = () => {
  const { isDarkMode, toggleDarkMode, backgroundTheme, changeBackgroundTheme } = useTheme();
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('appearanceSettings');
    return saved ? JSON.parse(saved) : {
      fontSize: 14,
      density: 'comfortable'
    };
  });

  const [success, setSuccess] = useState(false);

  const backgroundOptions = [
    { value: 'none', label: 'None', description: 'Clean interface without animations' },
    { value: 'lightRays', label: 'Light Rays', description: 'Dynamic light rays effect' },
    { value: 'gradientBlinds', label: 'Gradient Blinds', description: 'Animated gradient blinds' },
    { value: 'threads', label: 'Threads', description: 'Flowing threads animation' },
    { value: 'orb', label: 'Orb', description: 'Floating orb effect' },
  ];

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
      <Typography 
        variant="h6" 
        gutterBottom 
        sx={{ 
          fontWeight: 600,
          color: isDarkMode ? '#ffffff' : '#0B1929'
        }}
      >
        Appearance Settings
      </Typography>
      <Typography 
        variant="body2" 
        sx={{ 
          mb: 3,
          color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(11, 25, 41, 0.6)'
        }}
      >
        Customize how the dashboard looks and feels
      </Typography>

      {success && (
        <Alert 
          severity="success" 
          sx={{ 
            mb: 3,
            backgroundColor: isDarkMode 
              ? 'rgba(52, 211, 153, 0.1)' 
              : 'rgba(76, 175, 80, 0.1)',
            color: isDarkMode ? '#34d399' : '#388E3C',
            border: isDarkMode 
              ? '1px solid rgba(52, 211, 153, 0.2)' 
              : '1px solid rgba(76, 175, 80, 0.2)',
          }}
        >
          Appearance settings saved successfully!
        </Alert>
      )}

      {/* Theme Settings Card */}
      <Card sx={{ 
        mb: 4,
        background: isDarkMode 
          ? 'rgba(17, 24, 39, 0.25)'
          : 'rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(20px)',
        border: isDarkMode 
          ? '1px solid rgba(100, 255, 218, 0.1)' 
          : '1px solid rgba(62, 228, 200, 0.1)',
        boxShadow: 'none',
        borderRadius: '12px',
      }}>
        <CardContent>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600, 
              mb: 3, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              color: isDarkMode ? '#64ffda' : '#3EE4C8',
            }}
          >
            <PaletteIcon /> Theme Preferences
          </Typography>

          <FormGroup>
            {/* Dark Mode Toggle */}
            <Box 
              sx={{ 
                mb: 3, 
                p: 2,
                background: isDarkMode 
                  ? 'rgba(255, 255, 255, 0.02)'
                  : 'rgba(0, 0, 0, 0.02)',
                borderRadius: '8px',
                border: isDarkMode 
                  ? '1px solid rgba(100, 255, 218, 0.1)' 
                  : '1px solid rgba(62, 228, 200, 0.1)',
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={isDarkMode}
                    onChange={toggleDarkMode}
                    sx={{
                      '& .MuiSwitch-track': {
                        backgroundColor: isDarkMode
                          ? 'rgba(100, 255, 218, 0.2)'
                          : 'rgba(62, 228, 200, 0.2)',
                      },
                      '& .MuiSwitch-thumb': {
                        backgroundColor: isDarkMode ? '#64ffda' : '#3EE4C8',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: isDarkMode
                          ? 'rgba(100, 255, 218, 0.3)'
                          : 'rgba(62, 228, 200, 0.3)',
                      },
                    }}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {isDarkMode ? (
                      <DarkModeIcon sx={{ color: isDarkMode ? '#64ffda' : '#3EE4C8' }} />
                    ) : (
                      <LightModeIcon sx={{ color: isDarkMode ? '#64ffda' : '#3EE4C8' }} />
                    )}
                    <Box>
                      <Typography sx={{ 
                        fontWeight: 600,
                        color: isDarkMode ? '#ffffff' : '#0B1929'
                      }}>
                        {isDarkMode ? "Dark Mode" : "Light Mode"}
                      </Typography>
                      <Typography variant="caption" sx={{ 
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(11, 25, 41, 0.5)'
                      }}>
                        {isDarkMode 
                          ? "Easier on the eyes in low light"
                          : "Best for well-lit environments"}
                      </Typography>
                    </Box>
                  </Box>
                }
                sx={{
                  margin: 0,
                  '& .MuiFormControlLabel-label': {
                    color: isDarkMode ? '#ffffff' : '#0B1929',
                  }
                }}
              />
            </Box>
            
            {/* Background Theme Selector */}
            <FormControl fullWidth variant="outlined">
              <InputLabel 
                sx={{
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(11, 25, 41, 0.6)',
                  '&.Mui-focused': {
                    color: isDarkMode ? '#64ffda' : '#3EE4C8',
                  },
                }}
              >
                Background Animation
              </InputLabel>
              <Select
                value={backgroundTheme}
                onChange={(e) => changeBackgroundTheme(e.target.value)}
                label="Background Animation"
                sx={{
                  backgroundColor: isDarkMode
                    ? 'rgba(255, 255, 255, 0.03)'
                    : 'rgba(0, 0, 0, 0.02)',
                  backdropFilter: 'blur(10px)',
                  color: isDarkMode ? '#ffffff' : '#0B1929',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: isDarkMode
                      ? 'rgba(100, 255, 218, 0.2)'
                      : 'rgba(62, 228, 200, 0.2)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: isDarkMode ? '#64ffda' : '#3EE4C8',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: isDarkMode ? '#64ffda' : '#3EE4C8',
                  },
                  '& .MuiSelect-icon': {
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(11, 25, 41, 0.6)',
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: isDarkMode ? '#1a2332' : '#ffffff',
                      backgroundImage: 'none',
                      border: isDarkMode 
                        ? '1px solid rgba(100, 255, 218, 0.1)' 
                        : '1px solid rgba(62, 228, 200, 0.2)',
                      boxShadow: isDarkMode
                        ? '0 8px 32px rgba(0, 0, 0, 0.4)'
                        : '0 8px 32px rgba(0, 0, 0, 0.1)',
                      '& .MuiMenuItem-root': {
                        color: isDarkMode ? '#ffffff' : '#0B1929',
                        '&:hover': {
                          backgroundColor: isDarkMode 
                            ? 'rgba(100, 255, 218, 0.1)' 
                            : 'rgba(62, 228, 200, 0.1)',
                        },
                        '&.Mui-selected': {
                          backgroundColor: isDarkMode 
                            ? 'rgba(100, 255, 218, 0.15)' 
                            : 'rgba(62, 228, 200, 0.15)',
                          '&:hover': {
                            backgroundColor: isDarkMode 
                              ? 'rgba(100, 255, 218, 0.2)' 
                              : 'rgba(62, 228, 200, 0.2)',
                          },
                        },
                      },
                    },
                  },
                }}
              >
                {backgroundOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    <Box>
                      <Typography sx={{ 
                        color: isDarkMode ? '#ffffff' : '#0B1929',
                        fontWeight: 500
                      }}>
                        {option.label}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: isDarkMode 
                            ? 'rgba(255, 255, 255, 0.5)' 
                            : 'rgba(11, 25, 41, 0.5)'
                        }}
                      >
                        {option.description}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </FormGroup>
        </CardContent>
      </Card>

      <Divider sx={{ 
        my: 3,
        borderColor: isDarkMode 
          ? 'rgba(100, 255, 218, 0.1)' 
          : 'rgba(62, 228, 200, 0.1)',
      }} />

      {/* Font Size 
      <Typography 
        variant="subtitle1" 
        sx={{ 
          fontWeight: 600, 
          mb: 2,
          color: isDarkMode ? '#ffffff' : '#0B1929'
        }}
      >
        Font Size
      </Typography>

      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 4, 
          background: isDarkMode 
            ? 'rgba(17, 24, 39, 0.25)'
            : 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(20px)',
          border: isDarkMode 
            ? '1px solid rgba(100, 255, 218, 0.1)' 
            : '1px solid rgba(62, 228, 200, 0.1)',
          borderRadius: '12px'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FontSizeIcon sx={{ 
            mr: 2, 
            color: isDarkMode ? '#64ffda' : '#3EE4C8' 
          }} />
          <Typography 
            variant="body2" 
            sx={{
              color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(11, 25, 41, 0.6)'
            }}
          >
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
              color: isDarkMode ? '#64ffda' : '#3EE4C8',
              '& .MuiSlider-thumb': {
                backgroundColor: isDarkMode ? '#64ffda' : '#3EE4C8',
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: isDarkMode
                    ? '0 0 0 8px rgba(100, 255, 218, 0.16)'
                    : '0 0 0 8px rgba(62, 228, 200, 0.16)'
                }
              },
              '& .MuiSlider-track': {
                backgroundColor: isDarkMode ? '#64ffda' : '#3EE4C8',
              },
              '& .MuiSlider-rail': {
                backgroundColor: isDarkMode 
                  ? 'rgba(100, 255, 218, 0.2)' 
                  : 'rgba(62, 228, 200, 0.2)',
              }
            }}
          />
        </Box>
        <Box sx={{ 
          mt: 2, 
          p: 2, 
          backgroundColor: isDarkMode 
            ? 'rgba(100, 255, 218, 0.05)' 
            : 'rgba(62, 228, 200, 0.05)',
          border: isDarkMode 
            ? '1px solid rgba(100, 255, 218, 0.1)' 
            : '1px solid rgba(62, 228, 200, 0.1)',
          borderRadius: '8px'
        }}>
          <Typography 
            variant="body2" 
            sx={{ 
              fontSize: `${settings.fontSize}px`,
              color: isDarkMode ? '#ffffff' : '#0B1929'
            }}
          >
            Preview: This is how text will look at {settings.fontSize}px
          </Typography>
        </Box>
      </Paper>

      <Divider sx={{ 
        my: 3,
        borderColor: isDarkMode 
          ? 'rgba(100, 255, 218, 0.1)' 
          : 'rgba(62, 228, 200, 0.1)',
      }} />*/}

      {/* Density/Layout 
      <Typography 
        variant="subtitle1" 
        sx={{ 
          fontWeight: 600, 
          mb: 2,
          color: isDarkMode ? '#ffffff' : '#0B1929'
        }}
      >
        Layout Density
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2, mb: 4 }}>
        <AppearanceOption
          icon={CompactIcon}
          title="Compact"
          description="More information in less space"
          selected={settings.density === 'compact'}
          onClick={() => handleDensityChange('compact')}
          isDarkMode={isDarkMode}
        />
        <AppearanceOption
          icon={ComfortableIcon}
          title="Comfortable"
          description="Spacious layout with more breathing room"
          selected={settings.density === 'comfortable'}
          onClick={() => handleDensityChange('comfortable')}
          isDarkMode={isDarkMode}
        />
      </Box>*/}

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-start' }}>
        <Button
          variant="contained"
          onClick={handleSave}
          sx={{
            backgroundColor: isDarkMode ? '#64ffda' : '#3EE4C8',
            color: '#0B1929',
            fontWeight: 600,
            px: 4,
            py: 1.5,
            borderRadius: '10px',
            textTransform: 'none',
            boxShadow: isDarkMode
              ? '0 4px 20px rgba(100, 255, 218, 0.3)'
              : '0 4px 20px rgba(62, 228, 200, 0.3)',
            '&:hover': {
              backgroundColor: isDarkMode ? '#52d4c2' : '#2BC4A8',
              transform: 'translateY(-2px)',
              boxShadow: isDarkMode
                ? '0 6px 24px rgba(100, 255, 218, 0.4)'
                : '0 6px 24px rgba(62, 228, 200, 0.4)',
            },
            transition: 'all 0.25s ease',
          }}
        >
          Save Changes
        </Button>
      </Box>
    </Box>
  );
};

export default AppearanceSettings;