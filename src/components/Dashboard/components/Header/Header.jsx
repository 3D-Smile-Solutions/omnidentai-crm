// frontend/src/components/Dashboard/components/Header/Header.jsx
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar
} from '@mui/material';
import {
  Menu as MenuIcon
} from '@mui/icons-material';
import UserMenu from './UserMenu';
import DoctorProfileModal from '../DrDetails/DoctorProfileModal'; 
import { DRAWER_WIDTH } from '../../utils/constants';

const Header = ({ 
  currentUser, 
  anchorEl, 
  onDrawerToggle, 
  onMenuOpen, 
  onMenuClose, 
  onLogout 
}) => {
  const [profileModalOpen, setProfileModalOpen] = useState(false);

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
console.log('🔍 Header currentUser:', currentUser);
  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
          background: 'linear-gradient(90deg, #0B1929 0%, #1e3a5f 100%)',
          boxShadow: '0 2px 8px rgba(11, 25, 41, 0.15)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={onDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Welcome, {getDisplayName()}
          </Typography>
          <IconButton color="inherit" onClick={onMenuOpen}>
            <Avatar sx={{ width: 32, height: 32 }}>
              {getInitials()}
            </Avatar>
          </IconButton>
          <UserMenu 
          currentUser={currentUser}
            anchorEl={anchorEl}
            onClose={onMenuClose}
            onLogout={onLogout}
            onProfileClick={() => setProfileModalOpen(true)}
          />
        </Toolbar>
      </AppBar>

      {/* Doctor Profile Modal */}
      <DoctorProfileModal
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        doctor={currentUser}
      />
    </>
  );
};

export default Header;