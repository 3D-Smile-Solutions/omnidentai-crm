// frontend/src/components/Dashboard/components/Settings/SecuritySettings.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Alert,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import {
  Lock as LockIcon,
  History as HistoryIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { changePassword } from '../../../../redux/slices/settingsSlice';
import { logout } from '../../../../redux/slices/authSlice';

const SecurityCard = ({ icon: Icon, title, description, buttonText, buttonColor = 'primary', onClick, disabled = false }) => (
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
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
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
      <Button
        variant="outlined"
        onClick={onClick}
        disabled={disabled}
        sx={{
          borderColor: buttonColor === 'error' ? 'error.main' : '#3EE4C8',
          color: buttonColor === 'error' ? 'error.main' : '#0B1929',
          '&:hover': {
            borderColor: buttonColor === 'error' ? 'error.dark' : '#2BC4A8',
            backgroundColor: buttonColor === 'error' ? 'rgba(211, 47, 47, 0.05)' : 'rgba(62, 228, 200, 0.05)'
          }
        }}
      >
        {buttonText}
      </Button>
    </Box>
  </Paper>
);

const SecuritySettings = ({ onViewSessions }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { changePasswordStatus, error: settingsError } = useSelector((state) => state.settings);
  
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return;
    }

    if (passwordData.newPassword.length < 8) {
      return;
    }

    try {
      // Dispatch Redux action
      await dispatch(changePassword({
        newPassword: passwordData.newPassword
      })).unwrap();

      setSuccess(true);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      
      setTimeout(() => {
        setSuccess(false);
        setChangePasswordOpen(false);
      }, 2000);
    } catch (err) {
      console.error('Password change error:', err);
    }
  };

  const handleLogout = async () => {
    if (!window.confirm('Are you sure you want to logout?')) {
      return;
    }

    try {
      await dispatch(logout()).unwrap();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const passwordMismatch = passwordData.newPassword && passwordData.confirmPassword && 
                          passwordData.newPassword !== passwordData.confirmPassword;
  const passwordTooShort = passwordData.newPassword && passwordData.newPassword.length < 8;

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Security & Privacy
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Manage your account security settings
      </Typography>

      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
        Password
      </Typography>

      <SecurityCard
        icon={LockIcon}
        title="Change Password"
        description="Update your password to keep your account secure"
        buttonText="Change Password"
        onClick={() => setChangePasswordOpen(true)}
      />

      <Divider sx={{ my: 3 }} />

      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
        Session Management
      </Typography>

      <SecurityCard
        icon={HistoryIcon}
        title="Session History"
        description="View all your login sessions and activity"
        buttonText="View Sessions"
        onClick={onViewSessions}
      />

      <SecurityCard
        icon={LogoutIcon}
        title="Logout"
        description="Sign out from your current session"
        buttonText="Logout"
        buttonColor="error"
        onClick={handleLogout}
      />

      <Dialog 
        open={changePasswordOpen} 
        onClose={() => setChangePasswordOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LockIcon sx={{ mr: 1, color: '#3EE4C8' }} />
            Change Password
          </Box>
        </DialogTitle>
        <DialogContent>
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Password changed successfully!
            </Alert>
          )}
          {settingsError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {settingsError}
            </Alert>
          )}
          {passwordMismatch && (
            <Alert severity="error" sx={{ mb: 2 }}>
              New passwords do not match
            </Alert>
          )}
          {passwordTooShort && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Password must be at least 8 characters long
            </Alert>
          )}
          
          <TextField
            fullWidth
            type="password"
            label="New Password"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            margin="normal"
            required
            helperText="Must be at least 8 characters long"
          />
          <TextField
            fullWidth
            type="password"
            label="Confirm New Password"
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            margin="normal"
            required
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setChangePasswordOpen(false)} disabled={changePasswordStatus === 'loading'}>
            Cancel
          </Button>
          <Button
            onClick={handleChangePassword}
            variant="contained"
            disabled={
              changePasswordStatus === 'loading' || 
              !passwordData.newPassword || 
              !passwordData.confirmPassword ||
              passwordMismatch ||
              passwordTooShort
            }
            sx={{
              bgcolor: '#3EE4C8',
              color: '#0B1929',
              '&:hover': {
                bgcolor: '#2BC4A8'
              }
            }}
          >
            {changePasswordStatus === 'loading' ? <CircularProgress size={24} /> : 'Change Password'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SecuritySettings;