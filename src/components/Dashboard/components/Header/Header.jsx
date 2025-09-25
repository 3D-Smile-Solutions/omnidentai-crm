// 6. src/components/Dashboard/components/Header/Header.jsx
// ===========================================
import React from 'react';
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
import { DRAWER_WIDTH } from '../../utils/constants';

const Header = ({ 
  currentUser, 
  anchorEl, 
  onDrawerToggle, 
  onMenuOpen, 
  onMenuClose, 
  onLogout 
}) => {
  return (
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
          Welcome, {currentUser.firstName} {currentUser.lastName}
        </Typography>
        <IconButton color="inherit" onClick={onMenuOpen}>
          <Avatar sx={{ width: 32, height: 32 }}>
            {currentUser.firstName?.charAt(0)}
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