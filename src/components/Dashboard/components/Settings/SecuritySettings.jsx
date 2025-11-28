// frontend/src/components/Dashboard/components/Settings/SecuritySettings.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useWebSocket from '../hooks/useWebSocket';
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
  CircularProgress,
  Chip
} from '@mui/material';
import {
  Lock as LockIcon,
  History as HistoryIcon,
  Logout as LogoutIcon,
  Security as ShieldIcon,
  VpnKey as KeyIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import { changePassword } from '../../../../redux/slices/settingsSlice';
import { logout } from '../../../../redux/slices/authSlice';
import { useTheme } from '../../../../context/ThemeContext';

const SecurityCard = ({ icon: Icon, title, description, buttonText, buttonColor = 'primary', onClick, disabled = false, isDarkMode, isLast = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Paper
      elevation={0}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        p: 3,
        mb: isLast ? 0 : 2,
        background: isDarkMode 
          ? 'rgba(17, 24, 39, 0.25)'
          : 'rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(20px)',
        border: isDarkMode 
          ? '1px solid rgba(100, 255, 218, 0.1)' 
          : '1px solid rgba(62, 228, 200, 0.1)',
        borderRadius: '12px',
        transition: 'all 0.25s ease',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-2px)',
          border: isDarkMode 
            ? '1px solid rgba(100, 255, 218, 0.2)' 
            : '1px solid rgba(62, 228, 200, 0.2)',
          boxShadow: isDarkMode
            ? '0 8px 24px rgba(100, 255, 218, 0.1)'
            : '0 8px 24px rgba(62, 228, 200, 0.1)'
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isDarkMode
            ? 'linear-gradient(135deg, rgba(100, 255, 218, 0.03) 0%, transparent 100%)'
            : 'linear-gradient(135deg, rgba(62, 228, 200, 0.05) 0%, transparent 100%)',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.25s ease',
          pointerEvents: 'none',
        }
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        flexWrap: 'wrap', 
        gap: 2,
        position: 'relative',
        zIndex: 1
      }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '10px',
              backgroundColor: buttonColor === 'error'
                ? (isDarkMode ? 'rgba(248, 113, 113, 0.1)' : 'rgba(239, 68, 68, 0.1)')
                : (isDarkMode ? 'rgba(100, 255, 218, 0.1)' : 'rgba(62, 228, 200, 0.1)'),
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
              border: buttonColor === 'error'
                ? (isDarkMode ? '1px solid rgba(248, 113, 113, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)')
                : (isDarkMode ? '1px solid rgba(100, 255, 218, 0.2)' : '1px solid rgba(62, 228, 200, 0.2)'),
              transition: 'all 0.25s ease',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            }}
          >
            <Icon sx={{ 
              color: buttonColor === 'error' 
                ? (isDarkMode ? '#f87171' : '#dc2626')
                : (isDarkMode ? '#64ffda' : '#3EE4C8'),
              fontSize: 22
            }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 600, 
                mb: 0.5,
                color: isDarkMode ? '#ffffff' : '#0B1929'
              }}
            >
              {title}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{
                color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(11, 25, 41, 0.6)'
              }}
            >
              {description}
            </Typography>
          </Box>
        </Box>
        <Button
          variant={buttonColor === 'error' ? 'outlined' : 'contained'}
          onClick={onClick}
          disabled={disabled}
          sx={buttonColor === 'error' ? {
            borderColor: isDarkMode ? '#f87171' : '#dc2626',
            color: isDarkMode ? '#f87171' : '#dc2626',
            '&:hover': {
              borderColor: isDarkMode ? '#f87171' : '#dc2626',
              backgroundColor: isDarkMode 
                ? 'rgba(248, 113, 113, 0.1)' 
                : 'rgba(239, 68, 68, 0.1)',
            }
          } : {
            backgroundColor: isDarkMode ? '#64ffda' : '#3EE4C8',
            color: isDarkMode ? '#0B1929' : '#ffffff',
            fontWeight: 600,
            boxShadow: isDarkMode
              ? '0 4px 12px rgba(100, 255, 218, 0.2)'
              : '0 4px 12px rgba(62, 228, 200, 0.2)',
            '&:hover': {
              backgroundColor: isDarkMode ? '#52d4c2' : '#2BC4A8',
              transform: 'translateY(-1px)',
              boxShadow: isDarkMode
                ? '0 6px 16px rgba(100, 255, 218, 0.3)'
                : '0 6px 16px rgba(62, 228, 200, 0.3)',
            }
          }}
        >
          {buttonText}
        </Button>
      </Box>
    </Paper>
  );
};

const SecuritySettings = ({ onViewSessions }) => {
  const { isDarkMode } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { disconnect } = useWebSocket();
  const { changePasswordStatus, error: settingsError } = useSelector((state) => state.settings);
  
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false
  });
  
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
      disconnect();
      await dispatch(logout()).unwrap();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const passwordMismatch = passwordData.newPassword && passwordData.confirmPassword && 
                          passwordData.newPassword !== passwordData.confirmPassword;
  const passwordTooShort = passwordData.newPassword && passwordData.newPassword.length < 8;
  
  // Password strength indicator
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '' };
    if (password.length < 8) return { strength: 1, label: 'Weak', color: '#f87171' };
    if (password.length < 12) return { strength: 2, label: 'Medium', color: '#fbbf24' };
    if (password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)) {
      return { strength: 3, label: 'Strong', color: '#34d399' };
    }
    return { strength: 2, label: 'Medium', color: '#fbbf24' };
  };

  const passwordStrength = getPasswordStrength(passwordData.newPassword);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <ShieldIcon sx={{ color: isDarkMode ? '#64ffda' : '#3EE4C8', fontSize: 28 }} />
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600,
              color: isDarkMode ? '#ffffff' : '#0B1929'
            }}
          >
            Security & Privacy
          </Typography>
        </Box>
        <Typography 
          variant="body2" 
          sx={{
            color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(11, 25, 41, 0.6)'
          }}
        >
          Manage your account security settings and access controls
        </Typography>
      </Box>

      {/* Password Section */}
      <Box sx={{ mb: 3 }}>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            fontWeight: 600, 
            mb: 2,
            color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(11, 25, 41, 0.9)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontSize: '0.75rem'
          }}
        >
          Password Management
        </Typography>

        <SecurityCard
          icon={LockIcon}
          title="Change Password"
          description="Update your password to keep your account secure"
          buttonText="Change Password"
          onClick={() => setChangePasswordOpen(true)}
          isDarkMode={isDarkMode}
        />
      </Box>

      <Divider sx={{ 
        my: 3,
        borderColor: isDarkMode 
          ? 'rgba(100, 255, 218, 0.1)' 
          : 'rgba(62, 228, 200, 0.1)',
      }} />

      {/* Session Section */}
      <Box>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            fontWeight: 600, 
            mb: 2,
            color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(11, 25, 41, 0.9)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontSize: '0.75rem'
          }}
        >
          Session Management
        </Typography>

        <SecurityCard
          icon={HistoryIcon}
          title="Session History"
          description="View all your login sessions and activity"
          buttonText="View Sessions"
          onClick={onViewSessions}
          isDarkMode={isDarkMode}
        />

        <SecurityCard
          icon={LogoutIcon}
          title="Sign Out"
          description="End your current session and logout"
          buttonText="Logout"
          buttonColor="error"
          onClick={handleLogout}
          isDarkMode={isDarkMode}
          isLast={true}
        />
      </Box>

      {/* Change Password Dialog */}
      <Dialog 
        open={changePasswordOpen} 
        onClose={() => setChangePasswordOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            background: isDarkMode 
              ? 'rgba(17, 24, 39, 0.95)'
              : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: isDarkMode 
              ? '1px solid rgba(100, 255, 218, 0.1)' 
              : '1px solid rgba(62, 228, 200, 0.1)',
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: isDarkMode 
            ? '1px solid rgba(100, 255, 218, 0.1)' 
            : '1px solid rgba(62, 228, 200, 0.1)',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                backgroundColor: isDarkMode 
                  ? 'rgba(100, 255, 218, 0.1)' 
                  : 'rgba(62, 228, 200, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
                border: isDarkMode 
                  ? '1px solid rgba(100, 255, 218, 0.2)' 
                  : '1px solid rgba(62, 228, 200, 0.2)',
              }}
            >
              <KeyIcon sx={{ color: isDarkMode ? '#64ffda' : '#3EE4C8', fontSize: 20 }} />
            </Box>
            <Typography sx={{ 
              fontWeight: 600, 
              color: isDarkMode ? '#ffffff' : '#0B1929' 
            }}>
              Change Password
            </Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ mt: 2 }}>
          {success && (
            <Alert 
              severity="success" 
              icon={<CheckIcon />}
              sx={{ 
                mb: 2,
                backgroundColor: isDarkMode 
                  ? 'rgba(52, 211, 153, 0.1)' 
                  : 'rgba(76, 175, 80, 0.1)',
                color: isDarkMode ? '#34d399' : '#388E3C',
                border: isDarkMode 
                  ? '1px solid rgba(52, 211, 153, 0.2)' 
                  : '1px solid rgba(76, 175, 80, 0.2)',
              }}
            >
              Password changed successfully!
            </Alert>
          )}
          
          {settingsError && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 2,
                backgroundColor: isDarkMode 
                  ? 'rgba(248, 113, 113, 0.1)' 
                  : 'rgba(239, 68, 68, 0.1)',
                color: isDarkMode ? '#f87171' : '#dc2626',
                border: isDarkMode 
                  ? '1px solid rgba(248, 113, 113, 0.2)' 
                  : '1px solid rgba(239, 68, 68, 0.2)',
              }}
            >
              {settingsError}
            </Alert>
          )}
          
          <TextField
            fullWidth
            type={showPassword.new ? 'text' : 'password'}
            label="New Password"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            margin="normal"
            required
            InputProps={{
              endAdornment: (
                <Button
                  size="small"
                  onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                  sx={{ minWidth: 'auto', p: 1 }}
                >
                  {showPassword.new ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </Button>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: isDarkMode 
                  ? 'rgba(255, 255, 255, 0.03)'
                  : 'rgba(0, 0, 0, 0.02)',
                '& fieldset': {
                  borderColor: isDarkMode 
                    ? 'rgba(100, 255, 218, 0.2)' 
                    : 'rgba(62, 228, 200, 0.2)',
                },
                '&:hover fieldset': {
                  borderColor: isDarkMode ? '#64ffda' : '#3EE4C8',
                },
                '&.Mui-focused fieldset': {
                  borderColor: isDarkMode ? '#64ffda' : '#3EE4C8',
                },
              },
            }}
          />
          
          {passwordData.newPassword && (
            <Box sx={{ mt: 1, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="caption" sx={{ 
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(11, 25, 41, 0.6)' 
                }}>
                  Password Strength:
                </Typography>
                <Chip
                  size="small"
                  label={passwordStrength.label}
                  sx={{
                    height: 20,
                    fontSize: '0.7rem',
                    backgroundColor: `${passwordStrength.color}20`,
                    color: passwordStrength.color,
                    border: `1px solid ${passwordStrength.color}40`,
                  }}
                />
              </Box>
              <Box sx={{ 
                display: 'flex', 
                gap: 0.5,
                height: 4,
                borderRadius: 2,
                overflow: 'hidden'
              }}>
                {[1, 2, 3].map((level) => (
                  <Box
                    key={level}
                    sx={{
                      flex: 1,
                      backgroundColor: level <= passwordStrength.strength 
                        ? passwordStrength.color 
                        : (isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'),
                      transition: 'all 0.3s ease',
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}
          
          <TextField
            fullWidth
            type={showPassword.confirm ? 'text' : 'password'}
            label="Confirm New Password"
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            margin="normal"
            required
            error={passwordMismatch}
            helperText={passwordMismatch ? "Passwords do not match" : ""}
            InputProps={{
              endAdornment: (
                <Button
                  size="small"
                  onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                  sx={{ minWidth: 'auto', p: 1 }}
                >
                  {showPassword.confirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </Button>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: isDarkMode 
                  ? 'rgba(255, 255, 255, 0.03)'
                  : 'rgba(0, 0, 0, 0.02)',
                '& fieldset': {
                  borderColor: passwordMismatch 
                    ? '#f87171'
                    : (isDarkMode ? 'rgba(100, 255, 218, 0.2)' : 'rgba(62, 228, 200, 0.2)'),
                },
                '&:hover fieldset': {
                  borderColor: passwordMismatch 
                    ? '#f87171'
                    : (isDarkMode ? '#64ffda' : '#3EE4C8'),
                },
                '&.Mui-focused fieldset': {
                  borderColor: passwordMismatch 
                    ? '#f87171'
                    : (isDarkMode ? '#64ffda' : '#3EE4C8'),
                },
              },
            }}
          />
        </DialogContent>
        
        <DialogActions sx={{ 
          px: 3, 
          pb: 3,
          gap: 1,
          borderTop: isDarkMode 
            ? '1px solid rgba(100, 255, 218, 0.1)' 
            : '1px solid rgba(62, 228, 200, 0.1)',
          pt: 2,
          mt: 2
        }}>
          <Button 
            onClick={() => setChangePasswordOpen(false)} 
            disabled={changePasswordStatus === 'loading'}
            sx={{
              color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(11, 25, 41, 0.6)',
            }}
          >
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
              backgroundColor: isDarkMode ? '#64ffda' : '#3EE4C8',
              color: isDarkMode ? '#0B1929' : '#ffffff',
              fontWeight: 600,
              px: 3,
              '&:hover': {
                backgroundColor: isDarkMode ? '#52d4c2' : '#2BC4A8',
              },
              '&:disabled': {
                backgroundColor: isDarkMode 
                  ? 'rgba(100, 255, 218, 0.3)' 
                  : 'rgba(62, 228, 200, 0.3)',
              }
            }}
          >
            {changePasswordStatus === 'loading' ? (
              <CircularProgress size={24} sx={{ color: isDarkMode ? '#0B1929' : '#ffffff' }} />
            ) : (
              'Change Password'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SecuritySettings;