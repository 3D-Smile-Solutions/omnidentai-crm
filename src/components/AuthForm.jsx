import React from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton,
  AppBar,
  Toolbar
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Visibility, VisibilityOff, Email, Lock, Brightness4, Brightness7 } from '@mui/icons-material';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import LogoDark from '../assets/LogoDark.png';
import OmniDentLogo from '../assets/LogoLight.png';

const AuthForm = ({
  title,
  fields,
  error,
  onSubmit,
  submitLabel,
  submitting,
  redirectText,
  redirectPath
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* Header - matching Dashboard style */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: isDarkMode 
            ? 'rgba(17, 24, 39, 0.8)' 
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: isDarkMode
            ? '1px solid rgba(100, 255, 218, 0.1)'
            : '1px solid rgba(62, 228, 200, 0.3)',
          boxShadow: isDarkMode
            ? 'none'
            : '0 4px 20px rgba(62, 228, 200, 0.15)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3 } }}>
          {/* Logo/Brand */}
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
            }}
          >
            <Box
              component="img"
              src={isDarkMode ? LogoDark : OmniDentLogo}
              alt="OmniDent Logo"
              sx={{
                height: { xs: 32, sm: 40 },
                width: 'auto',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                }
              }}
            />
          </Box>

          {/* Theme Toggle */}
          <IconButton
            onClick={toggleDarkMode}
            sx={{
              color: isDarkMode ? '#64ffda' : '#3EE4C8',
              backgroundColor: isDarkMode
                ? 'rgba(100, 255, 218, 0.1)'
                : 'rgba(62, 228, 200, 0.1)',
              '&:hover': {
                backgroundColor: isDarkMode
                  ? 'rgba(100, 255, 218, 0.2)'
                  : 'rgba(62, 228, 200, 0.2)',
              },
            }}
          >
            {isDarkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main Content Area */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: { xs: 2, sm: 3 },
          paddingTop: { xs: 10, sm: 12 }, // Account for fixed header
        }}
      >
        {/* Animated gradient orbs for background effect - hidden on mobile */}
        <Box
          sx={{
            position: 'absolute',
            top: '20%',
            left: '10%',
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: isDarkMode 
              ? 'radial-gradient(circle, rgba(100, 255, 218, 0.15) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(62, 228, 200, 0.1) 0%, transparent 70%)',
            filter: 'blur(40px)',
            animation: 'float 6s ease-in-out infinite',
            '@keyframes float': {
              '0%, 100%': { transform: 'translateY(0)' },
              '50%': { transform: 'translateY(-20px)' },
            },
            zIndex: 0,
            display: { xs: 'none', md: 'block' },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '20%',
            right: '10%',
            width: 250,
            height: 250,
            borderRadius: '50%',
            background: isDarkMode
              ? 'radial-gradient(circle, rgba(167, 139, 250, 0.15) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
            filter: 'blur(40px)',
            animation: 'float 8s ease-in-out infinite reverse',
            zIndex: 0,
            display: { xs: 'none', md: 'block' },
          }}
        />

        <Paper
          elevation={0}
          sx={{
            position: 'relative',
            maxWidth: 440,
            width: '100%',
            padding: { xs: 3, sm: 4 },
            backdropFilter: 'blur(20px)',
            backgroundColor: isDarkMode 
              ? 'rgba(17, 24, 39, 0.5)' 
              : 'rgba(255, 255, 255, 0.9)',
            border: isDarkMode 
              ? '1px solid rgba(100, 255, 218, 0.2)' 
              : '1px solid rgba(62, 228, 200, 0.3)',
            borderRadius: 3,
            boxShadow: isDarkMode
              ? '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.06)'
              : '0 8px 40px rgba(62, 228, 200, 0.25), 0 4px 20px rgba(59, 130, 246, 0.15)',
            transition: 'all 0.3s ease',
            zIndex: 1,
            '&:hover': {
              boxShadow: isDarkMode
                ? '0 12px 48px rgba(100, 255, 218, 0.2)'
                : '0 12px 56px rgba(62, 228, 200, 0.35), 0 8px 28px rgba(59, 130, 246, 0.2)',
              transform: 'translateY(-2px)',
            }
          }}
        >
          {/* Logo or Brand Icon - removed since we have header now */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              textAlign: 'center',
              mb: 1,
              fontSize: { xs: '1.75rem', sm: '2.125rem' },
              background: isDarkMode
                ? 'linear-gradient(135deg, #64ffda 0%, #a78bfa 100%)'
                : 'linear-gradient(135deg, #0B1929 0%, #3EE4C8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              textAlign: 'center',
              mb: { xs: 2, sm: 3 },
              color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(11, 25, 41, 0.7)',
            }}
          >
            Welcome to Dental Records System
          </Typography>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 2,
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
              }}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={onSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {fields.map((field) => (
               <TextField
                  key={field.name}
                  name={field.name}
                  label={field.label}
                  type={field.type === 'password' && showPassword ? 'text' : field.type}
                  value={field.value}
                  onChange={field.onChange}
                  required={field.required}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {field.type === 'email' ? (
                          <Email sx={{ color: 'text.secondary', fontSize: 20 }} />
                        ) : field.type === 'password' ? (
                          <Lock sx={{ color: 'text.secondary', fontSize: 20 }} />
                        ) : null}
                      </InputAdornment>
                    ),
                    endAdornment: field.type === 'password' && (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: isDarkMode
                        ? 'rgba(255, 255, 255, 0.03)'
                        : 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease',
                      overflow: 'hidden',
                      '& .MuiInputAdornment-root': {
                        backgroundColor: 'transparent',
                        marginRight: 0,
                        marginLeft: 0,
                      },
                      '& input': {
                        color: isDarkMode ? '#ffffff' : '#0B1929',
                        '&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus, &:-webkit-autofill:active': {
                          WebkitBoxShadow: isDarkMode 
                            ? '0 0 0 30px rgba(17, 24, 39, 0.9) inset !important'
                            : '0 0 0 30px rgba(255, 255, 255, 0.95) inset !important',
                          WebkitTextFillColor: isDarkMode ? '#ffffff !important' : '#0B1929 !important',
                          caretColor: isDarkMode ? '#ffffff' : '#0B1929',
                          transition: 'background-color 5000s ease-in-out 0s',
                        },
                      },
                      '&:hover': {
                        backgroundColor: isDarkMode
                          ? 'rgba(255, 255, 255, 0.05)'
                          : 'rgba(255, 255, 255, 0.95)',
                      },
                      '&.Mui-focused': {
                        backgroundColor: isDarkMode
                          ? 'rgba(100, 255, 218, 0.05)'
                          : 'rgba(255, 255, 255, 1)',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: isDarkMode ? '#64ffda' : '#3EE4C8',
                          borderWidth: '1.5px',
                        }
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: isDarkMode
                          ? 'rgba(255, 255, 255, 0.1)'
                          : 'rgba(0, 0, 0, 0.2)',
                      }
                    },
                    '& .MuiInputLabel-root': {
                      color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(11, 25, 41, 0.7)',
                      '&.Mui-focused': {
                        color: isDarkMode ? '#64ffda' : '#0B1929',
                      }
                    }
                  }}
                />
              ))}
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={submitting}
              sx={{
                mt: { xs: 2, sm: 3 },
                py: 1.5,
                position: 'relative',
                background: isDarkMode
                  ? 'linear-gradient(135deg, #64ffda 0%, #a78bfa 100%)'
                  : 'linear-gradient(135deg, #3EE4C8 0%, #0B1929 100%)',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'none',
                borderRadius: 2,
                boxShadow: isDarkMode
                  ? '0 4px 15px rgba(100, 255, 218, 0.3)'
                  : '0 4px 15px rgba(62, 228, 200, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: isDarkMode
                    ? '0 6px 25px rgba(100, 255, 218, 0.4)'
                    : '0 6px 25px rgba(62, 228, 200, 0.4)',
                },
                '&:disabled': {
                  background: 'rgba(156, 163, 175, 0.5)',
                }
              }}
            >
              {submitting ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : (
                submitLabel
              )}
            </Button>
          </form>

          <Box sx={{ mt: { xs: 2, sm: 3 }, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(11, 25, 41, 0.7)' }}>
              {redirectText.split('?')[0]}?{' '}
              <Link
                component={RouterLink}
                to={redirectPath}
                sx={{
                  color: isDarkMode ? '#64ffda' : '#0B1929',
                  textDecoration: 'none',
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    textDecoration: 'underline',
                    opacity: 0.8,
                  }
                }}
              >
                {redirectText.split('?')[1]}
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default AuthForm;