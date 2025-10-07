// frontend/src/components/Dashboard/components/Header/Header.jsx
import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Box
} from '@mui/material';
import {
  Menu as MenuIcon
} from '@mui/icons-material';
import UserMenu from './UserMenu';
import { DRAWER_WIDTH } from '../../utils/constants';
import { useTheme } from '../../../../context/ThemeContext';

const Header = ({ 
  currentUser, 
  anchorEl, 
  onDrawerToggle, 
  onMenuOpen, 
  onMenuClose, 
  onLogout 
}) => {
  const { isDarkMode } = useTheme();

  const getDisplayName = () => {
    if (!currentUser) return 'Dentist';
    
    const firstName = currentUser.first_name || currentUser.firstName || '';
    const lastName = currentUser.last_name || currentUser.lastName || '';
    
    if (firstName && lastName) {
      return `Dr. ${firstName} ${lastName}`;
    } else if (firstName) {
      return `Dr. ${firstName}`;
    } else if (currentUser.email) {
      return currentUser.email.split('@')[0];
    }
    
    return 'Dentist';
  };

  const getInitials = () => {
    if (!currentUser) return 'D';
    
    const firstName = currentUser.first_name || currentUser.firstName || '';
    const lastName = currentUser.last_name || currentUser.lastName || '';
    
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    } else if (firstName) {
      return firstName.slice(0, 2).toUpperCase();
    } else if (currentUser.email) {
      return currentUser.email[0].toUpperCase();
    }
    
    return 'D';
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
        ml: { sm: `${DRAWER_WIDTH}px` },
        background: isDarkMode 
          ? 'rgba(17, 24, 39, 0.25)'
          : 'rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(20px)',
        borderBottom: isDarkMode 
          ? '1px solid rgba(100, 255, 218, 0.1)' 
          : '1px solid rgba(62, 228, 200, 0.1)',
        boxShadow: isDarkMode
          ? '0 4px 20px rgba(0, 0, 0, 0.15)'
          : '0 4px 20px rgba(0, 0, 0, 0.05)',
      }}
    >
      <Toolbar sx={{ 
        px: { xs: 2, sm: 3 },
        py: 1,
        minHeight: { xs: 64, sm: 70 },
      }}>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onDrawerToggle}
          sx={{ 
            mr: 2, 
            display: { sm: 'none' },
            color: isDarkMode ? '#64ffda' : '#0B1929',
            '&:hover': {
              backgroundColor: isDarkMode 
                ? 'rgba(100, 255, 218, 0.08)'
                : 'rgba(62, 228, 200, 0.08)',
            }
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Welcome Text */}
        <Box sx={{ flexGrow: 1 }}>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 600,
              fontSize: '1.125rem',
              background: isDarkMode
                ? 'rgba(0, 255, 213, 0.84)'
                : 'rgba(255, 255, 255, 0.8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Welcome, {getDisplayName()}
          </Typography>
        </Box>

        {/* User Avatar Button */}
        <IconButton 
          onClick={onMenuOpen}
          sx={{ 
            p: 0.5,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            }
          }}
        >
          <Avatar 
            sx={{ 
              width: 40, 
              height: 40,
              background: isDarkMode
                ? 'linear-gradient(135deg, #64ffda 0%, #a78bfa 100%)'
                : 'linear-gradient(135deg, #3EE4C8 0%, #0B1929 100%)',
              fontSize: '0.95rem',
              fontWeight: 600,
              border: '2px solid',
              borderColor: isDarkMode 
                ? 'rgba(100, 255, 218, 0.3)'
                : 'rgba(62, 228, 200, 0.3)',
              boxShadow: isDarkMode
                ? '0 4px 12px rgba(100, 255, 218, 0.2)'
                : '0 4px 12px rgba(62, 228, 200, 0.2)',
              '&:hover': {
                borderColor: isDarkMode 
                  ? 'rgba(100, 255, 218, 0.5)'
                  : 'rgba(62, 228, 200, 0.5)',
              }
            }}
          >
            {getInitials()}
          </Avatar>
        </IconButton>

        <UserMenu 
          anchorEl={anchorEl}
          onClose={onMenuClose}
          onLogout={onLogout}
        />
      </Toolbar>
    </AppBar>
  );
};

export default Header;