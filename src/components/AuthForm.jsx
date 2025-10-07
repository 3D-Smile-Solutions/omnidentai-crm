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
  IconButton
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

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
  const { isDarkMode } = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
        position: 'relative',
      }}
    >
      {/* Animated gradient orbs for background effect */}
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
          }
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
        }}
      />

      <Paper
        elevation={0}
        sx={{
          position: 'relative',
          maxWidth: 440,
          width: '100%',
          padding: 4,
          backdropFilter: 'blur(20px)',
          backgroundColor: isDarkMode 
            ? 'rgba(17, 24, 39, 0.5)' 
            : 'rgba(255, 255, 255, 0.5)',
          border: isDarkMode 
            ? '1px solid rgba(100, 255, 218, 0.2)' 
            : '1px solid rgba(62, 228, 200, 0.2)',
          borderRadius: 3,
          boxShadow: isDarkMode
            ? '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.06)'
            : '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: isDarkMode
              ? '0 12px 48px rgba(100, 255, 218, 0.2)'
              : '0 12px 48px rgba(62, 228, 200, 0.15)',
            transform: 'translateY(-2px)',
          }
        }}
      >
        {/* Logo or Brand Icon */}
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: 2,
            background: isDarkMode
              ? 'linear-gradient(135deg, rgba(100, 255, 218, 0.2) 0%, rgba(167, 139, 250, 0.2) 100%)'
              : 'linear-gradient(135deg, rgba(62, 228, 200, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)',
            border: isDarkMode
              ? '1px solid rgba(100, 255, 218, 0.3)'
              : '1px solid rgba(62, 228, 200, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: 'primary.main',
          }}
        >
          DR
        </Box>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            textAlign: 'center',
            mb: 1,
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
            mb: 3,
            color: 'text.secondary',
            opacity: 0.8,
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
                      : 'rgba(0, 0, 0, 0.02)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    overflow: 'hidden', // Ensures consistent background across the entire field
                    '& .MuiInputAdornment-root': {
                      backgroundColor: 'transparent', // Makes icon area transparent
                      marginRight: 0,
                      marginLeft: 0,
                    },
                    '&:hover': {
                      backgroundColor: isDarkMode
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(0, 0, 0, 0.03)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: isDarkMode
                        ? 'rgba(100, 255, 218, 0.05)'
                        : 'rgba(62, 228, 200, 0.05)',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: isDarkMode ? '#64ffda' : '#3EE4C8',
                        borderWidth: '1.5px',
                      }
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: isDarkMode
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'rgba(0, 0, 0, 0.1)',
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
              mt: 3,
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

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {redirectText.split('?')[0]}?{' '}
            <Link
              component={RouterLink}
              to={redirectPath}
              sx={{
                color: isDarkMode ? '#64ffda' : '#263532ff',
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
  );
};

export default AuthForm;