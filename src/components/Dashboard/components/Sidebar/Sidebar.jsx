// 7. src/components/Dashboard/components/Sidebar/Sidebar.jsx
// ===========================================
import React from 'react';
import {
  Box,
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  People as PeopleIcon,
  Description as FormsIcon,
  Assessment as ReportsIcon,
  TrendingUp as EnhancerIcon
} from '@mui/icons-material';
import OmniDentLogo from '../../../../assets/OmniDent AI Logo (1).svg';
import { DRAWER_WIDTH, SIDEBAR_ITEMS } from '../../utils/constants';

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
  const drawer = (
    <Box sx={{ height: '100%', background: 'linear-gradient(180deg, #ffffff 0%, #f8fffe 100%)', borderRight: '1px solid rgba(62, 228, 200, 0.1)' }}>
      <Toolbar sx={{ 
        borderBottom: '1px solid rgba(62, 228, 200, 0.15)',
        display: 'flex',
        justifyContent: 'center',
        py: 2
      }}>
        <img 
          src={OmniDentLogo} 
          alt="OmniDent AI" 
          style={{ 
            height: '40px',
            width: 'auto',
            objectFit: 'contain'
          }}
        />
      </Toolbar>
      <List sx={{ px: 1, py: 2 }}>
        {SIDEBAR_ITEMS.map((item) => (
          <ListItem 
            key={item.text}
            onClick={() => {
              onSelectIndex(item.index);
              onMobileClose();
            }}
            selected={selectedIndex === item.index}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              mx: 0.5,
              color: selectedIndex === item.index ? '#0B1929' : 'rgba(11, 25, 41, 0.7)',
              backgroundColor: selectedIndex === item.index ? 'rgba(62, 228, 200, 0.2)' : 'transparent',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease',
              '& .MuiListItemIcon-root': {
                color: selectedIndex === item.index ? '#3EE4C8' : 'rgba(11, 25, 41, 0.6)'
              },
              '&:hover': {
                backgroundColor: selectedIndex === item.index ? 'rgba(62, 228, 200, 0.25)' : 'rgba(62, 228, 200, 0.1)',
                color: '#0B1929',
                '& .MuiListItemIcon-root': {
                  color: '#3EE4C8'
                }
              }
            }}
          >
            <ListItemIcon>{iconMap[item.icon]}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
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
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;