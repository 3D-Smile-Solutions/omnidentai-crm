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

const ProfileSettings = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { updateProfileStatus, error: settingsError } = useSelector((state) => state.settings);
  
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: ''
  });

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

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Profile Information
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Update your personal information
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Profile updated successfully!
        </Alert>
      )}

      {settingsError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {settingsError}
        </Alert>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Avatar
          sx={{
            width: 80,
            height: 80,
            bgcolor: '#3EE4C8',
            color: '#0B1929',
            fontSize: '2rem',
            fontWeight: 600,
            mr: 2
          }}
        >
          {getInitials()}
        </Avatar>
        <Box>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {formData.firstName} {formData.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.email}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

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
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              value={user?.email || ''}
              disabled
              helperText="Email is managed through Supabase Auth and cannot be changed here"
            />
          </Grid>

          <Grid item xs={12} sx={{ mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={updateProfileStatus === 'loading' ? <CircularProgress size={20} /> : <SaveIcon />}
              disabled={updateProfileStatus === 'loading'}
              sx={{
                bgcolor: '#3EE4C8',
                color: '#0B1929',
                px: 4,
                '&:hover': {
                  bgcolor: '#2BC4A8'
                }
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