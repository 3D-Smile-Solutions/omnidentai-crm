import React from 'react';
import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import DescriptionIcon from '@mui/icons-material/Description';
import BarChartIcon from '@mui/icons-material/BarChart';
import ChatIcon from '@mui/icons-material/Chat';
import SettingsIcon from '@mui/icons-material/Settings';
import HistoryIcon from '@mui/icons-material/History';

const DashboardDrawer = ({ drawerWidth, mobileOpen, handleDrawerToggle, selectedIndex, setSelectedIndex }) => {
  const drawer = (
    <div>
      <List>
        {[
          { text: 'Overview', icon: <DashboardIcon /> },
          { text: 'Patients', icon: <PeopleIcon /> },
          { text: 'Forms', icon: <DescriptionIcon /> },
          { text: 'Reports', icon: <BarChartIcon /> },
          { text: 'Practice Enhancer', icon: <ChatIcon /> },
          { text: 'Settings', icon: <SettingsIcon /> },
          { text: 'Session History', icon: <HistoryIcon /> },
        ].map((item, index) => (
          <ListItemButton
            key={item.text}
            selected={selectedIndex === index}
            onClick={() => setSelectedIndex(index)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
      <Divider />
    </div>
  );

  return (
    <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default DashboardDrawer;
