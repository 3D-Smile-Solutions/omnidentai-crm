import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Button,
  IconButton,
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
  ArrowBack as ArrowBackIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  Badge as BadgeIcon,
  Business as BusinessIcon,
  LocalHospital as LocalHospitalIcon,
  Edit as EditIcon,
  Palette as PaletteIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon
} from '@mui/icons-material';

const Profile = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.auth);
  const { isDarkMode, toggleDarkMode, backgroundTheme, changeBackgroundTheme } = useTheme();

  const backgroundOptions = [
    { value: 'none', label: 'None', description: 'No animated background' },
    { value: 'lightRays', label: 'Light Rays', description: 'Dynamic light rays effect' },
    { value: 'gradientBlinds', label: 'Gradient Blinds', description: 'Animated gradient blinds' },
    { value: 'threads', label: 'Threads', description: 'Flowing threads animation' },
    { value: 'orb', label: 'Orb', description: 'Floating orb effect' },
  ];

  if (!currentUser) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  const getInitials = () => {
    const firstName = currentUser.first_name || currentUser.firstName || '';
    const lastName = currentUser.last_name || currentUser.lastName || '';
    
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    } else if (firstName) {
      return firstName.slice(0, 2).toUpperCase();
    } else if (currentUser.email) {
      return currentUser.email[0].toUpperCase();
    }
    return 'DR';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const firstName = currentUser.first_name || currentUser.firstName || '';
  const lastName = currentUser.last_name || currentUser.lastName || '';
  const fullName = firstName && lastName ? `Dr. ${firstName} ${lastName}` : 
                   firstName ? `Dr. ${firstName}` : 
                   'Doctor';

  return (
    <Box sx={{ 
      minHeight: '100vh',
      py: 4,
      position: 'relative'
    }}>
      {/* Animated gradient orbs for background effect */}
      <Box
        sx={{
          position: 'fixed',
          top: '10%',
          right: '15%',
          width: 350,
          height: 350,
          borderRadius: '50%',
          background: isDarkMode 
            ? 'radial-gradient(circle, rgba(167, 139, 250, 0.15) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'float 8s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0) translateX(0)' },
            '50%': { transform: 'translateY(-30px) translateX(30px)' },
          }
        }}
      />
      <Box
        sx={{
          position: 'fixed',
          bottom: '15%',
          left: '10%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: isDarkMode
            ? 'radial-gradient(circle, rgba(100, 255, 218, 0.15) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(62, 228, 200, 0.1) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'float 10s ease-in-out infinite reverse',
        }}
      />

      <Container maxWidth="md">
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard')}
          sx={{ 
            mb: 3,
            color: 'text.primary',
            backdropFilter: 'blur(10px)',
            backgroundColor: isDarkMode 
              ? 'rgba(255, 255, 255, 0.05)' 
              : 'rgba(255, 255, 255, 0.5)',
            border: isDarkMode
              ? '1px solid rgba(255, 255, 255, 0.1)'
              : '1px solid rgba(255, 255, 255, 0.5)',
            '&:hover': {
              backgroundColor: isDarkMode
                ? 'rgba(100, 255, 218, 0.1)'
                : 'rgba(255, 255, 255, 1)',
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          Back to Dashboard
        </Button>

        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            backdropFilter: 'blur(20px)',
            backgroundColor: isDarkMode 
              ? 'rgba(17, 24, 39, 0.5)' 
              : 'rgba(255, 255, 255, 0.5)',
            border: isDarkMode 
              ? '1px solid rgba(100, 255, 218, 0.2)' 
              : '1px solid rgba(62, 228, 200, 0.2)',
            boxShadow: isDarkMode
              ? '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.06)'
              : '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
            transition: 'all 0.3s ease',
          }}
        >
          {/* Header Section */}
          <Box
            sx={{
              background: isDarkMode 
                ? 'linear-gradient(135deg, rgba(100, 255, 218, 0.1) 0%, rgba(167, 139, 250, 0.1) 100%)'
                : 'linear-gradient(135deg, rgba(62, 228, 200, 0.15) 0%, rgba(43, 196, 168, 0.15) 100%)',
              backdropFilter: 'blur(10px)',
              p: 4,
              position: 'relative',
              borderBottom: isDarkMode 
                ? '1px solid rgba(100, 255, 218, 0.2)' 
                : '1px solid rgba(62, 228, 200, 0.2)',
            }}
          >


            <Box sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{
                  background: isDarkMode
                    ? 'linear-gradient(135deg, #64ffda 0%, #a78bfa 100%)'
                    : 'linear-gradient(135deg, #3EE4C8 0%, #0B1929 100%)',
                  width: 100,
                  height: 100,
                  fontSize: '2.5rem',
                  fontWeight: 600,
                  margin: '0 auto 16px',
                  border: '4px solid rgba(255,255,255,0.2)',
                  boxShadow: isDarkMode
                    ? '0 8px 24px rgba(100, 255, 218, 0.3)'
                    : '0 8px 24px rgba(62, 228, 200, 0.3)',
                }}
              >
                {getInitials()}
              </Avatar>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700,
                  mb: 1,
                  background: isDarkMode
                    ? 'linear-gradient(135deg, #64ffda 0%, #a78bfa 100%)'
                    : 'linear-gradient(135deg, #0B1929 0%, #3EE4C8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {fullName}
              </Typography>
              <Chip 
                icon={<LocalHospitalIcon sx={{ fontSize: 18 }} />}
                label="Dentist" 
                sx={{ 
                  backgroundColor: isDarkMode ?  'rgba(255, 255, 255, 0.1)' :  'rgba(71, 71, 71, 0.23)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: isDarkMode ? '#64ffda' : '#18574cff',
                  fontWeight: 600,
                  fontSize: '0.875rem'
                }}
              />
            </Box>
          </Box>

          {/* Content Section */}
          <Box sx={{ p: 4 }}>
            {/* Theme Settings Section */}
            <Card sx={{ 
              mb: 4,
              backdropFilter: 'blur(20px)',
              backgroundColor: isDarkMode
                ? 'rgba(255, 255, 255, 0.03)'
                : 'rgba(0, 0, 0, 0.02)',
              border: isDarkMode
                ? '1px solid rgba(100, 255, 218, 0.1)'
                : '1px solid rgba(62, 228, 200, 0.1)',
              boxShadow: 'none',
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ 
                  fontWeight: 600, 
                  mb: 3, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  color: isDarkMode ? '#64ffda' : '#144940ff',
                }}>
                  <PaletteIcon /> Theme Settings
                </Typography>

                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isDarkMode}
                        onChange={toggleDarkMode}
                        icon={<LightModeIcon />}
                        checkedIcon={<DarkModeIcon />}
                        sx={{
                          '& .MuiSwitch-track': {
                            backgroundColor: isDarkMode
                              ? 'rgba(100, 255, 218, 0.2)'
                              : 'rgba(62, 228, 200, 0.2)',
                          },
                          '& .MuiSwitch-thumb': {
                            backgroundColor: isDarkMode ? '#64ffda' : '#3EE4C8',
                          }
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ ml: 1 }}>
                        {isDarkMode ? "Dark Mode" : "Light Mode"}
                      </Typography>
                    }
                    sx={{ mb: 3 }}
                  />
                  
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Background Theme</InputLabel>
                    <Select
                      value={backgroundTheme}
                      onChange={(e) => changeBackgroundTheme(e.target.value)}
                      label="Background Theme"
                      sx={{
                        backgroundColor: isDarkMode
                          ? 'rgba(255, 255, 255, 0.03)'
                          : 'rgba(0, 0, 0, 0.02)',
                        backdropFilter: 'blur(10px)',
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
                        }
                      }}
                    >
                      {backgroundOptions.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          <Box>
                            <Typography>{option.label}</Typography>
                            <Typography variant="caption" color="text.secondary">
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

            {/* Personal Information */}
            <Typography variant="h6" sx={{ 
              fontWeight: 600, 
              color: isDarkMode ? '#64ffda' : '#3EE4C8',
              mb: 2 
            }}>
              Personal Information
            </Typography>

            <List sx={{ mb: 3 }}>
              {/* Doctor ID */}
              <ListItem sx={{ px: 0, py: 2 }}>
                <ListItemIcon sx={{ minWidth: 48 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: isDarkMode
                        ? 'rgba(100, 255, 218, 0.1)'
                        : 'rgba(62, 228, 200, 0.1)',
                      backdropFilter: 'blur(10px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid',
                      borderColor: isDarkMode
                        ? 'rgba(100, 255, 218, 0.2)'
                        : 'rgba(62, 228, 200, 0.2)',
                    }}
                  >
                    <BadgeIcon sx={{ color: isDarkMode ? '#64ffda' : 'rgba(0, 0, 0, 0.42)', fontSize: 20 }} />
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                      Doctor ID
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 500, fontFamily: 'monospace', mt: 0.5 }}>
                      {currentUser.id}
                    </Typography>
                  }
                />
              </ListItem>

              <Divider sx={{ borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' }} />

              {/* Email */}
              {currentUser.email && (
                <>
                  <ListItem sx={{ px: 0, py: 2 }}>
                    <ListItemIcon sx={{ minWidth: 48 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          backgroundColor: isDarkMode
                            ? 'rgba(100, 255, 218, 0.1)'
                            : 'rgba(62, 228, 200, 0.1)',
                          backdropFilter: 'blur(10px)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid',
                          borderColor: isDarkMode
                            ? 'rgba(100, 255, 218, 0.2)'
                            : 'rgba(62, 228, 200, 0.2)',
                        }}
                      >
                        <EmailIcon sx={{ color: isDarkMode ? '#64ffda' : 'rgba(0, 0, 0, 0.42)', fontSize: 20 }} />
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                          Email Address
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 500, mt: 0.5 }}>
                          {currentUser.email}
                        </Typography>
                      }
                    />
                  </ListItem>
                  <Divider sx={{ borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' }} />
                </>
              )}

              {/* Phone */}
              {currentUser.phone && (
                <>
                  <ListItem sx={{ px: 0, py: 2 }}>
                    <ListItemIcon sx={{ minWidth: 48 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          backgroundColor: isDarkMode
                            ? 'rgba(100, 255, 218, 0.1)'
                            : 'rgba(62, 228, 200, 0.1)',
                          backdropFilter: 'blur(10px)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid',
                          borderColor: isDarkMode
                            ? 'rgba(100, 255, 218, 0.2)'
                            : 'rgba(62, 228, 200, 0.2)',
                        }}
                      >
                        <PhoneIcon sx={{ color: isDarkMode ? '#64ffda' : '#3EE4C8', fontSize: 20 }} />
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                          Phone Number
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 500, mt: 0.5 }}>
                          {currentUser.phone}
                        </Typography>
                      }
                    />
                  </ListItem>
                  <Divider sx={{ borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' }} />
                </>
              )}

              {/* Practice Name */}
              {currentUser.practice_name && (
                <>
                  <ListItem sx={{ px: 0, py: 2 }}>
                    <ListItemIcon sx={{ minWidth: 48 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          backgroundColor: isDarkMode
                            ? 'rgba(100, 255, 218, 0.1)'
                            : 'rgba(62, 228, 200, 0.1)',
                          backdropFilter: 'blur(10px)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid',
                          borderColor: isDarkMode
                            ? 'rgba(100, 255, 218, 0.2)'
                            : 'rgba(62, 228, 200, 0.2)',
                        }}
                      >
                        <BusinessIcon sx={{ color: isDarkMode ? '#64ffda' : 'rgba(0, 0, 0, 0.42)', fontSize: 20 }} />
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                          Practice Name
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 500, mt: 0.5 }}>
                          {currentUser.practice_name}
                        </Typography>
                      }
                    />
                  </ListItem>
                  <Divider sx={{ borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.42)' }} />
                </>
              )}

              {/* Member Since */}
              {currentUser.created_at && (
                <ListItem sx={{ px: 0, py: 2 }}>
                  <ListItemIcon sx={{ minWidth: 48 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: isDarkMode
                          ? 'rgba(100, 255, 218, 0.1)'
                          : 'rgba(0, 255, 213, 0.1)',
                        backdropFilter: 'blur(10px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid',
                        borderColor: isDarkMode
                          ? 'rgba(100, 255, 218, 0.2)'
                          : 'rgba(62, 228, 200, 0.2)',
                      }}
                    >
                      <CalendarIcon sx={{ color: isDarkMode ? '#64ffda' : 'rgba(0, 0, 0, 0.42)', fontSize: 20 }} />
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                        Member Since
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 500, mt: 0.5 }}>
                        {formatDate(currentUser.created_at)}
                      </Typography>
                    }
                  />
                </ListItem>
              )}
            </List>

            {/* Account Status Section */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 600, 
                color: isDarkMode ? '#64ffda' : '#3EE4C8',
                mb: 2 
              }}>
                Account Status
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  backgroundColor: isDarkMode
                    ? 'rgba(255, 255, 255, 0.03)'
                    : 'rgba(0, 0, 0, 0.02)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: isDarkMode
                    ? 'rgba(100, 255, 218, 0.2)'
                    : 'rgba(62, 228, 200, 0.2)',
                  textAlign: 'center'
                }}
              >
                <Chip 
                  label="Active" 
                  sx={{ 
                    background: isDarkMode
                      ? 'linear-gradient(135deg, #64ffda 0%, #a78bfa 100%)'
                      : 'linear-gradient(135deg, #3EE4C8 0%, #10b981 100%)',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    px: 2,
                    boxShadow: isDarkMode
                      ? '0 4px 12px rgba(100, 255, 218, 0.3)'
                      : '0 4px 12px rgba(62, 228, 200, 0.3)',
                  }}
                />
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
                  Your account is in good standing
                </Typography>
              </Paper>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Profile;