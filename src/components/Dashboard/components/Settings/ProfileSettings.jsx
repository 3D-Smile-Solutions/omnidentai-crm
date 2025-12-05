// frontend/src/components/Dashboard/components/Settings/ProfileSettings.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Alert,
  CircularProgress,
  Avatar,
  Divider
} from '@mui/material';
import {
  Save as SaveIcon
} from '@mui/icons-material';
import { updateProfile } from '../../../../redux/slices/settingsSlice';
import { fetchMe } from '../../../../redux/slices/authSlice';
import { useTheme } from '../../../../context/ThemeContext';

const ProfileSettings = () => {
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const { user } = useSelector((state) => state.auth);
  const { updateProfileStatus, error: settingsError } = useSelector((state) => state.settings);
  
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: ''
  });

  // Theme-aware colors
  const accentColor = isDarkMode ? '#64ffda' : '#3EE4C8';
  const accentHover = isDarkMode ? '#4fd1b0' : '#2BC4A8';
  const textPrimary = isDarkMode ? '#ffffff' : '#0B1929';
  const textSecondary = isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(11, 25, 41, 0.6)';
  const dividerColor = isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)';

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.first_name || '',
        lastName: user.last_name || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);

    try {
      // Dispatch Redux action
      await dispatch(updateProfile({
        first_name: formData.firstName,
        last_name: formData.lastName
      })).unwrap();

      // Refresh user data in Redux to update header immediately
      await dispatch(fetchMe()).unwrap();

      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error('Profile update error:', err);
    }
  };

  const getInitials = () => {
    const first = formData.firstName.charAt(0) || '';
    const last = formData.lastName.charAt(0) || '';
    return (first + last).toUpperCase() || 'D';
  };

  // Common TextField styles for theme support
  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      color: textPrimary,
      '& fieldset': {
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
      },
      '&:hover fieldset': {
        borderColor: accentColor,
      },
      '&.Mui-focused fieldset': {
        borderColor: accentColor,
      },
      '&.Mui-disabled': {
        '& fieldset': {
          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
        },
      },
    },
    '& .MuiInputLabel-root': {
      color: textSecondary,
      '&.Mui-focused': {
        color: accentColor,
      },
      '&.Mui-disabled': {
        color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.38)',
      },
    },
    '& .MuiOutlinedInput-input': {
      color: textPrimary,
      '&.Mui-disabled': {
        WebkitTextFillColor: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.38)',
      },
    },
    '& .MuiFormHelperText-root': {
      color: textSecondary,
    },
  };

  return (
    <Box>
      <Typography 
        variant="h6" 
        gutterBottom 
        sx={{ 
          fontWeight: 600,
          color: textPrimary
        }}
      >
        Profile Information
      </Typography>
      <Typography 
        variant="body2" 
        sx={{ 
          mb: 3,
          color: textSecondary
        }}
      >
        Update your personal information
      </Typography>

      {success && (
        <Alert 
          severity="success" 
          sx={{ 
            mb: 2,
            backgroundColor: isDarkMode ? 'rgba(46, 125, 50, 0.15)' : 'rgba(46, 125, 50, 0.1)',
            color: isDarkMode ? '#81c784' : '#2e7d32',
            '& .MuiAlert-icon': {
              color: isDarkMode ? '#81c784' : '#2e7d32',
            },
          }}
        >
          Profile updated successfully!
        </Alert>
      )}

      {settingsError && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 2,
            backgroundColor: isDarkMode ? 'rgba(211, 47, 47, 0.15)' : 'rgba(211, 47, 47, 0.1)',
            color: isDarkMode ? '#ef5350' : '#d32f2f',
            '& .MuiAlert-icon': {
              color: isDarkMode ? '#ef5350' : '#d32f2f',
            },
          }}
        >
          {settingsError}
        </Alert>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Avatar
          sx={{
            width: 80,
            height: 80,
            bgcolor: accentColor,
            color: '#0B1929',
            fontSize: '2rem',
            fontWeight: 600,
            mr: 2,
            boxShadow: isDarkMode 
              ? '0 4px 14px rgba(100, 255, 218, 0.25)' 
              : '0 4px 14px rgba(62, 228, 200, 0.3)',
          }}
        >
          {getInitials()}
        </Avatar>
        <Box>
          <Typography 
            variant="body1" 
            sx={{ 
              fontWeight: 500,
              color: textPrimary
            }}
          >
            {formData.firstName} {formData.lastName}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ color: textSecondary }}
          >
            {user?.email}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 3, borderColor: dividerColor }} />

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              sx={textFieldStyles}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              sx={textFieldStyles}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              value={user?.email || ''}
              disabled
              helperText="Email is managed through Supabase Auth and cannot be changed here"
              sx={textFieldStyles}
            />
          </Grid>

          <Grid item xs={12} sx={{ mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={updateProfileStatus === 'loading' ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              disabled={updateProfileStatus === 'loading'}
              sx={{
                bgcolor: accentColor,
                color: '#0B1929',
                px: 4,
                fontWeight: 600,
                boxShadow: isDarkMode 
                  ? '0 4px 14px rgba(100, 255, 218, 0.25)' 
                  : '0 4px 14px rgba(62, 228, 200, 0.3)',
                '&:hover': {
                  bgcolor: accentHover,
                  boxShadow: isDarkMode 
                    ? '0 6px 20px rgba(100, 255, 218, 0.35)' 
                    : '0 6px 20px rgba(62, 228, 200, 0.4)',
                },
                '&.Mui-disabled': {
                  bgcolor: isDarkMode ? 'rgba(100, 255, 218, 0.3)' : 'rgba(62, 228, 200, 0.4)',
                  color: isDarkMode ? 'rgba(11, 25, 41, 0.5)' : 'rgba(11, 25, 41, 0.6)',
                },
              }}
            >
              {updateProfileStatus === 'loading' ? 'Saving...' : 'Save Changes'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default ProfileSettings;