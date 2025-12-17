// src/components/Dashboard/components/Sidebar/Sidebar.jsx
import React, { useState } from 'react';
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
  Collapse,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Description as FormsIcon,
  Assessment as ReportsIcon,
  TrendingUp as EnhancerIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Analytics as AnalyticsIcon,
  AttachMoney as RevenueIcon,
  EventNote as AppointmentsIcon,
  SmartToy as AIIcon,
  PersonSearch as PatientsAnalyticsIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import LogoDark from '../../../../assets/LogoDark.png';
import OmniDentLogo from '../../../../assets/LogoLight.png';
import { DRAWER_WIDTH } from '../../utils/constants';
import { useTheme } from '../../../../context/ThemeContext';

const Sidebar = ({ 
  mobileOpen, 
  selectedIndex, 
  onDrawerToggle, 
  onSelectIndex, 
  onMobileClose 
}) => {
  const { isDarkMode, toggleDarkMode, backgroundTheme, changeBackgroundTheme } = useTheme();
  const [analyticsExpanded, setAnalyticsExpanded] = useState(false);

  // Light mode compatible backgrounds
  const lightModeBackgrounds = ['none', 'lightRays', 'orb'];

  const handleToggleDarkMode = () => {
    // If switching to light mode and current background is gradientBlinds, switch to a random compatible one
    if (isDarkMode && backgroundTheme === 'gradientBlinds') {
      const randomBg = lightModeBackgrounds[Math.floor(Math.random() * lightModeBackgrounds.length)];
      changeBackgroundTheme(randomBg);
    }
    toggleDarkMode();
  };

  // Main navigation items (including Practice Enhancer now)
  const mainNavItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, index: 0 },
    { text: 'Patients', icon: <PeopleIcon />, index: 1 },
    { text: 'Forms', icon: <FormsIcon />, index: 2 },
    { text: 'Reports', icon: <ReportsIcon />, index: 3 },
    { text: 'Practice Enhancer', icon: <EnhancerIcon />, index: 4 },
  ];

  // Analytics sub-items
  const analyticsItems = [
    { text: 'Revenue', icon: <RevenueIcon />, index: 7 },
    { text: 'Appointments', icon: <AppointmentsIcon />, index: 8 },
    { text: 'AI Performance', icon: <AIIcon />, index: 9 },
    { text: 'Patient Analytics', icon: <PatientsAnalyticsIcon />, index: 10 },
  ];

  const isAnalyticsSelected = analyticsItems.some(item => item.index === selectedIndex);

  const handleAnalyticsToggle = () => {
    setAnalyticsExpanded(!analyticsExpanded);
  };

  const NavItem = ({ item, isSubItem = false }) => {
    const isSelected = selectedIndex === item.index;
    
    return (
      <ListItem 
        onClick={() => {
          onSelectIndex(item.index);
          onMobileClose();
        }}
        sx={{
          borderRadius: '10px',
          mb: 0.5,
          ml: isSubItem ? 2 : 0,
          px: 2,
          py: isSubItem ? 1 : 1.5,
          position: 'relative',
          cursor: 'pointer',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          backgroundColor: isSelected 
            ? (isDarkMode 
              ? 'rgba(100, 255, 218, 0.12)' 
              : 'rgba(62, 228, 200, 0.18)')
            : 'transparent',
          color: isSelected 
            ? (isDarkMode ? '#64ffda' : '#0B1929')
            : (isDarkMode ? 'rgba(255, 255, 255, 0.65)' : 'rgba(11, 25, 41, 0.7)'),
          border: isSelected 
            ? (isDarkMode 
              ? '1px solid rgba(100, 255, 218, 0.2)' 
              : '1px solid rgba(62, 228, 200, 0.3)')
            : '1px solid transparent',
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
              color: isDarkMode ? '#00cc9cff' : '#3EE4C8',
            }
          },
          '& .MuiListItemIcon-root': {
            minWidth: isSubItem ? 32 : 40,
            color: isSelected 
              ? (isDarkMode ? '#0aa380ff' : '#3EE4C8')
              : (isDarkMode ? 'rgba(255, 255, 255, 0.55)' : 'rgba(11, 25, 41, 0.6)'),
            transition: 'color 0.25s ease',
          },
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
          {React.cloneElement(item.icon, {
            sx: { fontSize: isSubItem ? 18 : 21 }
          })}
        </ListItemIcon>
        <ListItemText 
          primary={item.text}
          primaryTypographyProps={{
            sx: {
              fontWeight: isSelected ? 600 : 500,
              fontSize: isSubItem ? '0.85rem' : '0.925rem',
              letterSpacing: '0.15px',
            }
          }}
        />
      </ListItem>
    );
  };

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
      overscrollBehavior: 'contain',
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
        flexShrink: 0,
      }}>
        <img 
          src={isDarkMode ? LogoDark : OmniDentLogo}
          alt="OmniDent AI" 
          style={{ 
            height: '48px',
            width: 'auto',
            objectFit: 'contain',
          }}
        />
      </Toolbar>
      
      {/* Scrollable Navigation Area */}
      <Box sx={{ 
        flex: 1,
        overflow: 'auto',
        position: 'relative',
        zIndex: 1,
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
        overscrollBehavior: 'contain',
      }}>
        <List sx={{ px: 2, py: 2.5 }}>
          {/* Main Navigation */}
          {mainNavItems.map((item) => (
            <NavItem key={item.text} item={item} />
          ))}

          {/* Analytics Section */}
          <ListItem 
            onClick={handleAnalyticsToggle}
            sx={{
              borderRadius: '10px',
              mb: 0.5,
              mt: 1,
              px: 2,
              py: 1.5,
              cursor: 'pointer',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              backgroundColor: isAnalyticsSelected || analyticsExpanded
                ? (isDarkMode 
                  ? 'rgba(100, 255, 218, 0.08)' 
                  : 'rgba(62, 228, 200, 0.12)')
                : 'transparent',
              color: isAnalyticsSelected 
                ? (isDarkMode ? '#64ffda' : '#0B1929')
                : (isDarkMode ? 'rgba(255, 255, 255, 0.65)' : 'rgba(11, 25, 41, 0.7)'),
              border: isAnalyticsSelected
                ? (isDarkMode 
                  ? '1px solid rgba(100, 255, 218, 0.2)' 
                  : '1px solid rgba(62, 228, 200, 0.3)')
                : '1px solid transparent',
              '&:hover': {
                backgroundColor: isDarkMode 
                  ? 'rgba(100, 255, 218, 0.1)' 
                  : 'rgba(62, 228, 200, 0.15)',
                color: isDarkMode ? '#64ffda' : '#0B1929',
                '& .MuiListItemIcon-root': {
                  color: isDarkMode ? '#00cc9cff' : '#3EE4C8',
                }
              },
              '& .MuiListItemIcon-root': {
                minWidth: 40,
                color: isAnalyticsSelected 
                  ? (isDarkMode ? '#0aa380ff' : '#3EE4C8')
                  : (isDarkMode ? 'rgba(255, 255, 255, 0.55)' : 'rgba(11, 25, 41, 0.6)'),
              },
            }}
          >
            <ListItemIcon>
              <AnalyticsIcon sx={{ fontSize: 21 }} />
            </ListItemIcon>
            <ListItemText 
              primary="Analytics"
              primaryTypographyProps={{
                sx: {
                  fontWeight: isAnalyticsSelected ? 600 : 500,
                  fontSize: '0.925rem',
                  letterSpacing: '0.15px',
                }
              }}
            />
            {analyticsExpanded ? (
              <ExpandLessIcon sx={{ fontSize: 20, color: 'inherit' }} />
            ) : (
              <ExpandMoreIcon sx={{ fontSize: 20, color: 'inherit' }} />
            )}
          </ListItem>

          {/* Analytics Sub-items */}
          <Collapse in={analyticsExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ mb: 1 }}>
              {analyticsItems.map((item) => (
                <NavItem key={item.text} item={item} isSubItem />
              ))}
            </List>
          </Collapse>
        </List>
      </Box>
      
      {/* Theme Switcher at Bottom */}
      <Box sx={{ 
        p: 2,
        borderTop: isDarkMode 
          ? '1px solid rgba(100, 255, 218, 0.1)'
          : '1px solid rgba(62, 228, 200, 0.15)',
        position: 'relative',
        zIndex: 1,
        flexShrink: 0,
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
              : 'rgba(62, 228, 200, 0.15)',
            border: isDarkMode 
              ? '1px solid rgba(100, 255, 218, 0.1)' 
              : '1px solid rgba(62, 228, 200, 0.15)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isDarkMode ? (
              <DarkModeIcon sx={{ fontSize: 20, color: '#64ffda' }} />
            ) : (
              <LightModeIcon sx={{ fontSize: 20, color: '#3EE4C8' }} />
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
            onClick={handleToggleDarkMode}
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