// src/components/Dashboard/components/Sidebar/Sidebar.jsx
import React from 'react';
import {
  Box,
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  People as PeopleIcon,
  Description as FormsIcon,
  Assessment as ReportsIcon,
  TrendingUp as EnhancerIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon
} from '@mui/icons-material';
import OmniDentLogo from '../../../../assets/OmniDent AI Logo (1).svg';
import { DRAWER_WIDTH, SIDEBAR_ITEMS } from '../../utils/constants';
import { useTheme } from '../../../../context/ThemeContext';

const iconMap = {
  DashboardIcon: <DashboardIcon />,
  PeopleIcon: <PeopleIcon />,
  FormsIcon: <FormsIcon />,
  ReportsIcon: <ReportsIcon />,
  EnhancerIcon: <EnhancerIcon />,
  SettingsIcon: <SettingsIcon />
};

const Sidebar = ({ 
  mobileOpen, 
  selectedIndex, 
  onDrawerToggle, 
  onSelectIndex, 
  onMobileClose 
}) => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  const drawer = (
    <Box sx={{ 
      height: '100%', 
      display: 'flex',
      flexDirection: 'column',
      background: isDarkMode 
        ? 'rgba(17, 24, 39, 0.25)'
        : 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(20px)',
      borderRight: isDarkMode 
        ? '1px solid rgba(100, 255, 218, 0.1)' 
        : '1px solid rgba(62, 228, 200, 0.2)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle background gradient */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isDarkMode
            ? 'linear-gradient(180deg, rgba(100, 255, 218, 0.02) 0%, rgba(167, 139, 250, 0.02) 100%)'
            : 'linear-gradient(180deg, rgba(62, 228, 200, 0.05) 0%, rgba(43, 196, 168, 0.02) 100%)',
          pointerEvents: 'none',
        }}
      />
      
      {/* Logo Section */}
      <Toolbar sx={{ 
        borderBottom: isDarkMode 
          ? '1px solid rgba(100, 255, 218, 0.1)'
          : '1px solid rgba(62, 228, 200, 0.15)',
        display: 'flex',
        justifyContent: 'flex-start',
        py: 2,
        px: 2,
        position: 'relative',
        zIndex: 1,
        minHeight: 80,
      }}>
        <img 
          src={OmniDentLogo} 
          alt="OmniDent AI" 
          style={{ 
            height: '48px',
            width: 'auto',
            objectFit: 'contain',
          }}
        />
      </Toolbar>
      
      {/* Navigation Items */}
      <List sx={{ 
        px: 2, 
        py: 2.5, 
        position: 'relative', 
        zIndex: 1,
        flex: 1,
        overflow: 'auto',
        // Hide scrollbar but keep functionality
        scrollbarWidth: 'none', // Firefox
        msOverflowStyle: 'none', // IE/Edge
        '&::-webkit-scrollbar': {
          display: 'none', // Chrome, Safari, Opera
        },
      }}>
        {SIDEBAR_ITEMS.map((item, index) => {
          const isSelected = selectedIndex === item.index;
          
          return (
            <ListItem 
              key={item.text}
              onClick={() => {
                onSelectIndex(item.index);
                onMobileClose();
              }}
              sx={{
                borderRadius: '10px',
                mb: 1,
                px: 2,
                py: 1.5,
                position: 'relative',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                
                // Background
                backgroundColor: isSelected 
                  ? (isDarkMode 
                    ? 'rgba(100, 255, 218, 0.12)' 
                    : 'rgba(62, 228, 200, 0.18)')
                  : 'transparent',
                
                // Text color - FIXED for light mode
                color: isSelected 
                  ? (isDarkMode ? '#64ffda' : '#0B1929')
                  : (isDarkMode ? 'rgba(255, 255, 255, 0.65)' : 'rgba(11, 25, 41, 0.7)'),
                
                // Border for selected state
                border: isSelected 
                  ? (isDarkMode 
                    ? '1px solid rgba(100, 255, 218, 0.2)' 
                    : '1px solid rgba(62, 228, 200, 0.3)')
                  : '1px solid transparent',
                
                // Hover effects
                '&:hover': {
                  backgroundColor: isSelected 
                    ? (isDarkMode 
                      ? 'rgba(100, 255, 218, 0.15)' 
                      : 'rgba(62, 228, 200, 0.22)')
                    : (isDarkMode 
                      ? 'rgba(100, 255, 218, 0.05)' 
                      : 'rgba(62, 228, 200, 0.1)'),
                  color: isDarkMode ? '#64ffda' : '#0B1929',
                  '& .MuiListItemIcon-root': {
                    color: isDarkMode ? '#64ffda' : '#3EE4C8',
                  }
                },

                // Icon styling
                '& .MuiListItemIcon-root': {
                  minWidth: 40,
                  color: isSelected 
                    ? (isDarkMode ? '#64ffda' : '#3EE4C8')
                    : (isDarkMode ? 'rgba(255, 255, 255, 0.55)' : 'rgba(11, 25, 41, 0.6)'),
                  transition: 'color 0.25s ease',
                },

                // Left accent bar for selected state
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '3px',
                  height: isSelected ? '60%' : '0%',
                  backgroundColor: isDarkMode ? '#64ffda' : '#3EE4C8',
                  borderRadius: '0 2px 2px 0',
                  transition: 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                },
              }}
            >
              <ListItemIcon>
                {React.cloneElement(iconMap[item.icon], {
                  sx: { 
                    fontSize: 21,
                    strokeWidth: isSelected ? 2.5 : 2,
                  }
                })}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  sx: {
                    fontWeight: isSelected ? 600 : 500,
                    fontSize: '0.925rem',
                    letterSpacing: '0.15px',
                  }
                }}
              />
            </ListItem>
          );
        })}
      </List>
      
      {/* Theme Switcher at Bottom */}
      <Box sx={{ 
        p: 2,
        borderTop: isDarkMode 
          ? '1px solid rgba(100, 255, 218, 0.1)'
          : '1px solid rgba(62, 228, 200, 0.15)',
        position: 'relative',
        zIndex: 1,
      }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 1.5,
            borderRadius: '10px',
            backgroundColor: isDarkMode 
              ? 'rgba(100, 255, 218, 0.05)' 
              : 'rgba(62, 228, 200, 0.1)',
            border: isDarkMode 
              ? '1px solid rgba(100, 255, 218, 0.1)' 
              : '1px solid rgba(62, 228, 200, 0.15)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isDarkMode ? (
              <DarkModeIcon sx={{ 
                fontSize: 20, 
                color: '#64ffda' 
              }} />
            ) : (
              <LightModeIcon sx={{ 
                fontSize: 20, 
                color: '#3EE4C8' 
              }} />
            )}
            <Typography sx={{ 
              fontSize: '0.875rem',
              fontWeight: 500,
              color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(11, 25, 41, 0.8)',
            }}>
              {isDarkMode ? 'Dark' : 'Light'} Mode
            </Typography>
          </Box>
          
          <IconButton
            onClick={toggleDarkMode}
            size="small"
            sx={{
              backgroundColor: isDarkMode 
                ? 'rgba(100, 255, 218, 0.1)' 
                : 'rgba(62, 228, 200, 0.15)',
              color: isDarkMode ? '#64ffda' : '#3EE4C8',
              '&:hover': {
                backgroundColor: isDarkMode 
                  ? 'rgba(100, 255, 218, 0.2)' 
                  : 'rgba(62, 228, 200, 0.25)',
                transform: 'rotate(180deg)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: DRAWER_WIDTH,
            backgroundColor: 'transparent',
            boxShadow: isDarkMode
              ? '0 8px 32px rgba(0, 0, 0, 0.4)'
              : '0 8px 32px rgba(62, 228, 200, 0.15)',
          },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: DRAWER_WIDTH,
            backgroundColor: 'transparent',
            border: 'none',
            boxShadow: isDarkMode
              ? '4px 0 24px rgba(0, 0, 0, 0.15)'
              : '4px 0 24px rgba(62, 228, 200, 0.1)',
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;