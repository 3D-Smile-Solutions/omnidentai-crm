import React from 'react'; 
import { AppBar, Toolbar, IconButton, Typography, Avatar, Menu, MenuItem, ListItemIcon, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

const DashboardHeader = ({ drawerWidth, handleDrawerToggle, currentUser, anchorEl, handleMenuOpen, handleMenuClose, handleLogout }) => (
  <AppBar
    position="fixed"
    sx={{
      width: { sm: `calc(100% - ${drawerWidth}px)` },
      ml: { sm: `${drawerWidth}px` },
      background: 'linear-gradient(90deg, #0B1929 0%, #1e3a5f 100%)',
      boxShadow: '0 2px 8px rgba(11, 25, 41, 0.15)',
    }}
  >
    <Toolbar>
      <IconButton
        color="inherit"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{ mr: 2, display: { sm: 'none' } }}
      >
        <MenuIcon />
      </IconButton>
      <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
        Welcome, {currentUser?.firstName ?? ''} {currentUser?.lastName ?? ''}
      </Typography>
      <IconButton color="inherit" onClick={handleMenuOpen}>
        <Avatar sx={{ width: 32, height: 32 }}>
          {currentUser?.firstName?.charAt(0) ?? '?'}
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Toolbar>
  </AppBar>
);

export default DashboardHeader;
