// frontend/src/components/Dashboard/components/Header/UserMenu.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography
} from '@mui/material';
import {
  Person as PersonIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';
import { useTheme } from '../../../../context/ThemeContext';

const UserMenu = ({ anchorEl, onClose, onLogout }) => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const handleProfileClick = () => {
    onClose();
    navigate('/profile');
  };

  const handleSettingsClick = () => {
    onClose();
    // Navigate to settings or handle settings action
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      PaperProps={{
        elevation: 0,
        sx: {
          mt: 1.5,
          minWidth: 200,
          borderRadius: '12px',
          overflow: 'hidden',
          backdropFilter: 'blur(20px)',
          backgroundColor: isDarkMode 
            ? 'rgba(17, 24, 39, 0.85)' 
            : 'rgba(255, 255, 255, 0.9)',
          border: isDarkMode 
            ? '1px solid rgba(100, 255, 218, 0.15)' 
            : '1px solid rgba(62, 228, 200, 0.15)',
          boxShadow: isDarkMode
            ? '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.06)'
            : '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
          '& .MuiList-root': {
            py: 1,
          },
          '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 16,
            width: 12,
            height: 12,
            bgcolor: isDarkMode 
              ? 'rgba(17, 24, 39, 0.85)' 
              : 'rgba(255, 255, 255, 0.9)',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
            border: isDarkMode 
              ? '1px solid rgba(100, 255, 218, 0.15)' 
              : '1px solid rgba(62, 228, 200, 0.15)',
            borderBottom: 'none',
            borderRight: 'none',
          },
        },
      }}
    >
      <MenuItem 
        onClick={handleProfileClick}
        sx={{
          px: 2.5,
          py: 1.5,
          mx: 1,
          borderRadius: '8px',
          mb: 0.5,
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: isDarkMode 
              ? 'rgba(100, 255, 218, 0.08)' 
              : 'rgba(62, 228, 200, 0.08)',
            '& .MuiListItemIcon-root': {
              color: isDarkMode ? '#64ffda' : '#3EE4C8',
            },
            '& .MuiListItemText-primary': {
              color: isDarkMode ? '#64ffda' : '#0B1929',
            }
          },
        }}
      >
        <ListItemIcon sx={{ 
          minWidth: 36,
          color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
        }}>
          <Box sx={{
            width: 28,
            height: 28,
            borderRadius: '6px',
            backgroundColor: isDarkMode 
              ? 'rgba(100, 255, 218, 0.1)' 
              : 'rgba(62, 228, 200, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <PersonIcon sx={{ fontSize: 18 }} />
          </Box>
        </ListItemIcon>
        <ListItemText 
          primary="Profile"
          primaryTypographyProps={{
            fontSize: '0.9rem',
            fontWeight: 500,
            color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.87)',
          }}
        />
      </MenuItem>

      <MenuItem 
        onClick={handleSettingsClick}
        sx={{
          px: 2.5,
          py: 1.5,
          mx: 1,
          borderRadius: '8px',
          mb: 0.5,
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: isDarkMode 
              ? 'rgba(100, 255, 218, 0.08)' 
              : 'rgba(62, 228, 200, 0.08)',
            '& .MuiListItemIcon-root': {
              color: isDarkMode ? '#64ffda' : '#3EE4C8',
            },
            '& .MuiListItemText-primary': {
              color: isDarkMode ? '#64ffda' : '#0B1929',
            }
          },
        }}
      >
        <ListItemIcon sx={{ 
          minWidth: 36,
          color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
        }}>
          <Box sx={{
            width: 28,
            height: 28,
            borderRadius: '6px',
            backgroundColor: isDarkMode 
              ? 'rgba(100, 255, 218, 0.1)' 
              : 'rgba(62, 228, 200, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <SettingsIcon sx={{ fontSize: 18 }} />
          </Box>
        </ListItemIcon>
        <ListItemText 
          primary="Settings"
          primaryTypographyProps={{
            fontSize: '0.9rem',
            fontWeight: 500,
            color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.87)',
          }}
        />
      </MenuItem>

      <Divider sx={{ 
        my: 0.5, 
        mx: 2,
        borderColor: isDarkMode 
          ? 'rgba(100, 255, 218, 0.1)' 
          : 'rgba(62, 228, 200, 0.1)',
      }} />

      <MenuItem 
        onClick={onLogout}
        sx={{
          px: 2.5,
          py: 1.5,
          mx: 1,
          mt: 0.5,
          borderRadius: '8px',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: isDarkMode 
              ? 'rgba(239, 68, 68, 0.08)' 
              : 'rgba(239, 68, 68, 0.05)',
            '& .MuiListItemIcon-root': {
              color: '#ef4444',
            },
            '& .MuiListItemText-primary': {
              color: '#ef4444',
            }
          },
        }}
      >
        <ListItemIcon sx={{ 
          minWidth: 36,
          color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
        }}>
          <Box sx={{
            width: 28,
            height: 28,
            borderRadius: '6px',
            backgroundColor: isDarkMode 
              ? 'rgba(239, 68, 68, 0.1)' 
              : 'rgba(239, 68, 68, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <LogoutIcon sx={{ fontSize: 18 }} />
          </Box>
        </ListItemIcon>
        <ListItemText 
          primary="Logout"
          primaryTypographyProps={{
            fontSize: '0.9rem',
            fontWeight: 500,
            color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.87)',
          }}
        />
      </MenuItem>
    </Menu>
  );
};

export default UserMenu;