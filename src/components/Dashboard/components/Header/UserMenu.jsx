// frontend/src/components/Dashboard/components/Header/UserMenu.jsx
import React from 'react';
import {
  Menu,
  MenuItem,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  Person as PersonIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';

const UserMenu = ({ anchorEl, onClose, onLogout, onProfileClick }) => {
  const handleProfileClick = () => {
    onClose();
    if (onProfileClick) {
      onProfileClick();
    }
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
    >
      <MenuItem onClick={handleProfileClick}>
        <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
        Profile
      </MenuItem>
      <MenuItem onClick={onClose}>
        <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
        Settings
      </MenuItem>
      <Divider />
      <MenuItem onClick={onLogout}>
        <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  );
};

export default UserMenu;