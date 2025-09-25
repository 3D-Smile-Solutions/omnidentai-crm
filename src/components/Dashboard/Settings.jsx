import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';

const DashboardSettings = ({ setSelectedIndex, isMobile }) => (
  <>
    <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>Settings</Typography>
    <Typography paragraph color="text.secondary">Configure practice settings, user preferences, and system configurations.</Typography>
    <Box sx={{ mt: 3 }}>
      {[
        { title: 'Practice Information', desc: 'Update practice details, hours, and contact information' },
        { title: 'User Management', desc: 'Manage staff accounts, roles, and permissions' },
        { title: 'Billing & Insurance', desc: 'Configure fee schedules, insurance plans, and payment settings' },
        { title: 'Integrations', desc: 'Connect third-party services and APIs' },
      ].map(item => (
        <Paper key={item.title} elevation={1} sx={{ p: 3, mb: 2 }}>
          <Typography variant="h6" gutterBottom>{item.title}</Typography>
          <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
        </Paper>
      ))}
      <Paper elevation={0} sx={{ p: 3, background: 'linear-gradient(135deg, #ffffff 0%, #f8fffe 100%)', border: '1px solid rgba(62, 228, 200, 0.2)', transition: 'transform 0.15s ease, box-shadow 0.15s ease', '&:hover': { boxShadow: '0 4px 20px rgba(62, 228, 200, 0.15)', transform: 'translateY(-2px)' } }}>
        <Typography variant="h6" gutterBottom>Session History</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>View your login history and active sessions</Typography>
        <Button variant="outlined" onClick={() => setSelectedIndex(6)} sx={{ borderColor: '#3EE4C8', color: '#0B1929', '&:hover': { borderColor: '#2BC4A8', backgroundColor: 'rgba(62, 228, 200, 0.05)' } }}>View Sessions</Button>
      </Paper>
    </Box>
  </>
);

export default DashboardSettings;
