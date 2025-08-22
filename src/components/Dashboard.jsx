import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  Divider,
  IconButton,
  Container,
  Paper,
  Avatar,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Button
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
  People as PeopleIcon,
  Description as FormsIcon,
  Assessment as ReportsIcon,
  TrendingUp as EnhancerIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import SessionHistory from './SessionHistory';
import PatientList from './PatientList';
import ChatInterface from './ChatInterface';
import OmniDentLogo from '../assets/OmniDent AI Logo (1).svg';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Label
} from 'recharts';
import PracticeEnhancerChat from './PracticeEnhancerChat';
import GoogleMapComponent from './GoogleMapComponent';

const drawerWidth = 240;

const Dashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1000);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const [patients, setPatients] = useState([
    {
      id: 1,
      firstName: 'Sarah',
      lastName: 'Johnson',
      unreadCount: 2,
      messages: [
        { id: 1, sender: 'patient', channel: 'SMS', message: 'Hi, I need to reschedule my appointment for next week', timestamp: new Date(Date.now() - 86400000).toISOString() },
        { id: 2, sender: 'staff', channel: 'SMS', message: 'Of course! What day works best for you?', timestamp: new Date(Date.now() - 85000000).toISOString() },
        { id: 3, sender: 'patient', channel: 'SMS', message: 'Tuesday or Thursday afternoon would be perfect', timestamp: new Date(Date.now() - 84000000).toISOString() },
        { id: 4, sender: 'staff', channel: 'Webchat', message: 'I have an opening on Tuesday at 2:30 PM. Does that work?', timestamp: new Date(Date.now() - 83000000).toISOString() },
        { id: 5, sender: 'patient', channel: 'Webchat', message: 'Yes, that works great! Thank you', timestamp: new Date(Date.now() - 3600000).toISOString() }
      ]
    },
    {
      id: 2,
      firstName: 'Michael',
      lastName: 'Chen',
      unreadCount: 0,
      messages: [
        { id: 1, sender: 'staff', channel: 'Call', message: 'Called patient regarding insurance verification', timestamp: new Date(Date.now() - 172800000).toISOString() },
        { id: 2, sender: 'patient', channel: 'SMS', message: 'Thanks for the call. I\'ll send the insurance card photo', timestamp: new Date(Date.now() - 172000000).toISOString() },
        { id: 3, sender: 'staff', channel: 'SMS', message: 'Perfect! We received your insurance information and everything looks good', timestamp: new Date(Date.now() - 170000000).toISOString() }
      ]
    },
    {
      id: 3,
      firstName: 'Emily',
      lastName: 'Davis',
      unreadCount: 3,
      messages: [
        { id: 1, sender: 'patient', channel: 'Webchat', message: 'Is teeth whitening covered by my dental plan?', timestamp: new Date(Date.now() - 7200000).toISOString() },
        { id: 2, sender: 'staff', channel: 'Webchat', message: 'Let me check your coverage details', timestamp: new Date(Date.now() - 7100000).toISOString() },
        { id: 3, sender: 'staff', channel: 'Webchat', message: 'Unfortunately, cosmetic procedures like teeth whitening are not covered by your current plan', timestamp: new Date(Date.now() - 7000000).toISOString() },
        { id: 4, sender: 'patient', channel: 'SMS', message: 'What would be the out-of-pocket cost?', timestamp: new Date(Date.now() - 1800000).toISOString() },
        { id: 5, sender: 'patient', channel: 'SMS', message: 'Also, how long does the procedure take?', timestamp: new Date(Date.now() - 900000).toISOString() },
        { id: 6, sender: 'patient', channel: 'Call', message: 'And are there any side effects I should know about?', timestamp: new Date(Date.now() - 300000).toISOString() }
      ]
    },
    {
      id: 4,
      firstName: 'Robert',
      lastName: 'Williams',
      unreadCount: 1,
      messages: [
        { id: 1, sender: 'staff', channel: 'SMS', message: 'Reminder: Your cleaning appointment is tomorrow at 10 AM', timestamp: new Date(Date.now() - 14400000).toISOString() },
        { id: 2, sender: 'patient', channel: 'SMS', message: 'Thank you for the reminder! See you tomorrow', timestamp: new Date(Date.now() - 14000000).toISOString() },
        { id: 3, sender: 'patient', channel: 'Webchat', message: 'Quick question - should I avoid eating before the appointment?', timestamp: new Date(Date.now() - 600000).toISOString() }
      ]
    },
    {
      id: 5,
      firstName: 'Jessica',
      lastName: 'Martinez',
      unreadCount: 0,
      messages: [
        { id: 1, sender: 'patient', channel: 'Webchat', message: 'My tooth has been hurting for the past two days', timestamp: new Date(Date.now() - 259200000).toISOString() },
        { id: 2, sender: 'staff', channel: 'Webchat', message: 'I\'m sorry to hear that. Can you describe the pain? Is it sharp or throbbing?', timestamp: new Date(Date.now() - 258000000).toISOString() },
        { id: 3, sender: 'patient', channel: 'Call', message: 'It\'s a sharp pain when I eat something cold or sweet', timestamp: new Date(Date.now() - 257000000).toISOString() },
        { id: 4, sender: 'staff', channel: 'Call', message: 'That sounds like tooth sensitivity. Let\'s schedule an examination. We have an opening tomorrow at 3 PM', timestamp: new Date(Date.now() - 256000000).toISOString() },
        { id: 5, sender: 'patient', channel: 'SMS', message: 'I\'ll take it. Thank you!', timestamp: new Date(Date.now() - 255000000).toISOString() }
      ]
    }
  ]);
  
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    onLogout();
    navigate('/login');
  };

  const handleSendMessage = (patientId, message, channel = 'SMS') => {
    const newMessage = {
      id: Date.now(),
      sender: 'staff',
      channel: channel,
      message: message,
      timestamp: new Date().toISOString()
    };

    setPatients(prevPatients => 
      prevPatients.map(patient => 
        patient.id === patientId 
          ? { ...patient, messages: [...patient.messages, newMessage] }
          : patient
      )
    );
  };

  const sidebarItems = [
    { text: 'Overview', icon: <DashboardIcon />, index: 0 },
    { text: 'Patients', icon: <PeopleIcon />, index: 1 },
    { text: 'Forms', icon: <FormsIcon />, index: 2 },
    { text: 'Reports', icon: <ReportsIcon />, index: 3 },
    { text: 'Practice Enhancer', icon: <EnhancerIcon />, index: 4 },
    { text: 'Settings', icon: <SettingsIcon />, index: 5 },
  ];

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
        {sidebarItems.map((item) => (
          <ListItem 
            key={item.text}
            onClick={() => {
              setSelectedIndex(item.index);
              setMobileOpen(false);
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
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const revenueData = [
    { month: 'Jan', revenue: 18500, target: 20000 },
    { month: 'Feb', revenue: 19800, target: 20000 },
    { month: 'Mar', revenue: 21200, target: 22000 },
    { month: 'Apr', revenue: 20500, target: 22000 },
    { month: 'May', revenue: 23100, target: 24000 },
    { month: 'Jun', revenue: 24580, target: 24000 }
  ];

  const bookingsData = [
    { day: 'Mon', bookings: 12, cancellations: 2 },
    { day: 'Tue', bookings: 15, cancellations: 1 },
    { day: 'Wed', bookings: 18, cancellations: 3 },
    { day: 'Thu', bookings: 14, cancellations: 0 },
    { day: 'Fri', bookings: 20, cancellations: 2 },
    { day: 'Sat', bookings: 8, cancellations: 1 }
  ];

  const conversationsData = [
    { channel: 'SMS', count: 145 },
    { channel: 'Call', count: 89 },
    { channel: 'Webchat', count: 108 }
  ];

  const appointmentTypes = [
    { type: 'Cleaning', count: 28, revenue: 5600 },
    { type: 'Whitening', count: 12, revenue: 6000 },
    { type: 'Filling', count: 15, revenue: 4500 },
    { type: 'Root Canal', count: 8, revenue: 8000 },
    { type: 'Other', count: 5, revenue: 480 }
  ];

  const popularProcedures = [
    { name: 'Teeth Cleaning', value: 28, percentage: 35 },
    { name: 'Cavity Filling', value: 15, percentage: 19 },
    { name: 'Whitening', value: 12, percentage: 15 },
    { name: 'Crown', value: 10, percentage: 13 },
    { name: 'Root Canal', value: 8, percentage: 10 },
    { name: 'Extraction', value: 6, percentage: 8 }
  ];

  const insuranceProviders = [
    { provider: 'Delta Dental', count: 145 },
    { provider: 'Aetna', count: 98 },
    { provider: 'Cigna', count: 87 },
    { provider: 'Blue Cross', count: 76 },
    { provider: 'MetLife', count: 65 },
    { provider: 'United', count: 42 }
  ];

  const appointmentsByGender = [
    { type: 'Cleaning', male: 12, female: 16 },
    { type: 'Whitening', male: 4, female: 8 },
    { type: 'Filling', male: 8, female: 7 },
    { type: 'Root Canal', male: 5, female: 3 },
    { type: 'Crown', male: 6, female: 4 }
  ];

  const patientTypes = [
    { name: 'New Patients', value: 35, fill: '#3EE4C8' },
    { name: 'Returning Patients', value: 65, fill: '#45B7D1' }
  ];

  const revenueByType = [
    { name: 'Root Canal', value: 8000, fill: '#3EE4C8' },
    { name: 'Whitening', value: 6000, fill: '#45B7D1' },
    { name: 'Cleaning', value: 5600, fill: '#4ECDC4' },
    { name: 'Filling', value: 4500, fill: '#96CEB4' },
    { name: 'Crown', value: 3200, fill: '#F7B801' },
    { name: 'Other', value: 480, fill: '#DDA77B' }
  ];

  const patientSatisfaction = [
    { metric: 'Response Time', score: 92, fullMark: 100 },
    { metric: 'Accuracy', score: 88, fullMark: 100 },
    { metric: 'Helpfulness', score: 95, fullMark: 100 },
    { metric: 'Ease of Use', score: 90, fullMark: 100 },
    { metric: 'Resolution Rate', score: 85, fullMark: 100 },
    { metric: 'Overall Experience', score: 91, fullMark: 100 }
  ];

  const renderContent = () => {
    switch (selectedIndex) {
      case 0:
        return (
          <>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              Practice Overview
            </Typography>
            <Typography paragraph color="text.secondary">
              Welcome to OmniDent AI. Monitor your practice performance, track patient metrics, and manage daily operations.
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2, mt: 3 }}>
              <Paper elevation={0} sx={{ 
                p: 3,
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fffe 100%)',
                border: '1px solid rgba(62, 228, 200, 0.2)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                '&:hover': {
                  boxShadow: '0 4px 20px rgba(62, 228, 200, 0.15)',
                  transform: 'translateY(-2px)'
                }
              }}>
                <Typography variant="subtitle2" sx={{ color: 'rgba(11, 25, 41, 0.6)', fontWeight: 600 }} gutterBottom>
                  Total Revenue
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#0B1929' }}>$24,580</Typography>
                <Typography variant="body2" color="success.main">
                  +12% from last month
                </Typography>
              </Paper>
              <Paper elevation={0} sx={{ 
                p: 3,
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fffe 100%)',
                border: '1px solid rgba(62, 228, 200, 0.2)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                '&:hover': {
                  boxShadow: '0 4px 20px rgba(62, 228, 200, 0.15)',
                  transform: 'translateY(-2px)'
                }
              }}>
                <Typography variant="subtitle2" sx={{ color: 'rgba(11, 25, 41, 0.6)', fontWeight: 600 }} gutterBottom>
                  Total Bookings
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#0B1929' }}>68</Typography>
                <Typography variant="body2" color="text.secondary">
                  52 completed this month
                </Typography>
              </Paper>
              <Paper elevation={0} sx={{ 
                p: 3,
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fffe 100%)',
                border: '1px solid rgba(62, 228, 200, 0.2)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                '&:hover': {
                  boxShadow: '0 4px 20px rgba(62, 228, 200, 0.15)',
                  transform: 'translateY(-2px)'
                }
              }}>
                <Typography variant="subtitle2" sx={{ color: 'rgba(11, 25, 41, 0.6)', fontWeight: 600 }} gutterBottom>
                  Total Conversations
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#0B1929' }}>342</Typography>
                <Typography variant="body2" color="success.main">
                  +28% from last week
                </Typography>
              </Paper>
              <Paper elevation={0} sx={{ 
                p: 3,
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fffe 100%)',
                border: '1px solid rgba(62, 228, 200, 0.2)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                '&:hover': {
                  boxShadow: '0 4px 20px rgba(62, 228, 200, 0.15)',
                  transform: 'translateY(-2px)'
                }
              }}>
                <Typography variant="subtitle2" sx={{ color: 'rgba(11, 25, 41, 0.6)', fontWeight: 600 }} gutterBottom>
                  Most Recent Booking
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#0B1929', fontSize: '1.1rem' }}>Teeth Cleaning</Typography>
                <Typography variant="body2" color="text.secondary">
                  Booked 2 hours ago
                </Typography>
              </Paper>
            </Box>

            {/* Charts Section */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                Analytics Dashboard
              </Typography>
              
              {/* Revenue Chart */}
              <Paper elevation={0} sx={{ 
                p: 3, 
                mb: 3,
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fffe 100%)',
                border: '1px solid rgba(62, 228, 200, 0.2)'
              }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#0B1929' }}>
                  Monthly Revenue Trends
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData} margin={{ bottom: isMobile ? 5 : 5, left: isMobile ? -20 : 5 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3EE4C8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3EE4C8" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(62, 228, 200, 0.1)" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#0B1929"
                      interval={isMobile ? 1 : 0}
                      tick={{ fontSize: isMobile ? 10 : 12 }}
                    />
                    <YAxis 
                      stroke="#0B1929"
                      tick={{ fontSize: isMobile ? 10 : 12 }}
                      tickFormatter={isMobile ? (value) => `${value/1000}k` : undefined}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        border: '1px solid rgba(62, 228, 200, 0.3)',
                        borderRadius: 8
                      }}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#3EE4C8" 
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                      strokeWidth={2}
                      name="Revenue"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="target" 
                      stroke="#0B1929" 
                      strokeDasharray="5 5"
                      strokeWidth={2}
                      dot={false}
                      name="Target"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Paper>

              {/* Two column layout for smaller charts */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                {/* Bookings Chart */}
                <Paper elevation={0} sx={{ 
                  p: 3,
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fffe 100%)',
                  border: '1px solid rgba(62, 228, 200, 0.2)'
                }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#0B1929' }}>
                    Weekly Bookings
                  </Typography>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={bookingsData} margin={{ bottom: isMobile ? 5 : 5, left: isMobile ? -20 : 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(62, 228, 200, 0.1)" />
                      <XAxis 
                        dataKey="day" 
                        stroke="#0B1929"
                        interval={0}
                        tick={{ fontSize: isMobile ? 10 : 12 }}
                      />
                      <YAxis 
                        stroke="#0B1929"
                        tick={{ fontSize: isMobile ? 10 : 12 }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                          border: '1px solid rgba(62, 228, 200, 0.3)',
                          borderRadius: 8
                        }}
                      />
                      <Legend />
                      <Bar dataKey="bookings" fill="#3EE4C8" name="Bookings" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="cancellations" fill="#FF6B6B" name="Cancellations" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>

                {/* Appointment Types Chart */}
                <Paper elevation={0} sx={{ 
                  p: 3,
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fffe 100%)',
                  border: '1px solid rgba(62, 228, 200, 0.2)'
                }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#0B1929' }}>
                    Appointment Types
                  </Typography>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={appointmentTypes} margin={{ bottom: isMobile ? 40 : 5, left: isMobile ? -20 : 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(62, 228, 200, 0.1)" />
                      <XAxis 
                        dataKey="type" 
                        stroke="#0B1929"
                        angle={isMobile ? -45 : 0}
                        textAnchor={isMobile ? "end" : "middle"}
                        interval={0}
                        tick={{ fontSize: isMobile ? 9 : 12 }}
                        height={isMobile ? 60 : 30}
                      />
                      <YAxis 
                        stroke="#0B1929"
                        tick={{ fontSize: isMobile ? 10 : 12 }}
                        tickFormatter={isMobile ? (value) => value >= 1000 ? `${value/1000}k` : value : undefined}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                          border: '1px solid rgba(62, 228, 200, 0.3)',
                          borderRadius: 8
                        }}
                      />
                      <Legend />
                      <Bar dataKey="count" fill="#3EE4C8" name="Count" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="revenue" fill="#45B7D1" name="Revenue ($)" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Box>

              {/* Conversations by Channel */}
              <Paper elevation={0} sx={{ 
                p: 3,
                mt: 3,
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fffe 100%)',
                border: '1px solid rgba(62, 228, 200, 0.2)'
              }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#0B1929' }}>
                  Conversations by Channel
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={conversationsData} margin={{ bottom: isMobile ? 5 : 5, left: isMobile ? -20 : 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(62, 228, 200, 0.1)" />
                    <XAxis 
                      dataKey="channel" 
                      stroke="#0B1929"
                      interval={0}
                      tick={{ fontSize: isMobile ? 10 : 12 }}
                    />
                    <YAxis 
                      stroke="#0B1929"
                      tick={{ fontSize: isMobile ? 10 : 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        border: '1px solid rgba(62, 228, 200, 0.3)',
                        borderRadius: 8
                      }}
                    />
                    <Bar dataKey="count" fill="#3EE4C8" name="Messages" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>

              {/* Additional Charts Row 1 */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mt: 3 }}>
                {/* Popular Procedures */}
                <Paper elevation={0} sx={{ 
                  p: 3,
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fffe 100%)',
                  border: '1px solid rgba(62, 228, 200, 0.2)'
                }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#0B1929' }}>
                    Most Popular Procedures
                  </Typography>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={popularProcedures} margin={{ bottom: isMobile ? 80 : 60, left: isMobile ? -20 : 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(62, 228, 200, 0.1)" />
                      <XAxis 
                        dataKey="name" 
                        stroke="#0B1929" 
                        angle={-45} 
                        textAnchor="end" 
                        height={80}
                        interval={0}
                        tick={{ fontSize: isMobile ? 8 : 12 }}
                      />
                      <YAxis 
                        stroke="#0B1929"
                        tick={{ fontSize: isMobile ? 10 : 12 }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                          border: '1px solid rgba(62, 228, 200, 0.3)',
                          borderRadius: 8
                        }}
                      />
                      <Bar dataKey="value" fill="#3EE4C8" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>

                {/* Insurance Providers */}
                <Paper elevation={0} sx={{ 
                  p: 3,
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fffe 100%)',
                  border: '1px solid rgba(62, 228, 200, 0.2)'
                }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#0B1929' }}>
                    Insurance Verifications
                  </Typography>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={insuranceProviders} margin={{ bottom: isMobile ? 70 : 20, left: isMobile ? -20 : 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(62, 228, 200, 0.1)" />
                      <XAxis 
                        dataKey="provider" 
                        stroke="#0B1929"
                        interval={0}
                        angle={isMobile ? -45 : -15}
                        textAnchor="end"
                        height={isMobile ? 80 : 60}
                        tick={{ fontSize: isMobile ? 8 : 12 }}
                      />
                      <YAxis 
                        stroke="#0B1929"
                        tick={{ fontSize: isMobile ? 10 : 12 }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                          border: '1px solid rgba(62, 228, 200, 0.3)',
                          borderRadius: 8
                        }}
                      />
                      <Bar dataKey="count" fill="#3EE4C8" name="Verified Patients" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Box>

              {/* Additional Charts Row 2 */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mt: 3 }}>
                {/* Appointments by Gender */}
                <Paper elevation={0} sx={{ 
                  p: 3,
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fffe 100%)',
                  border: '1px solid rgba(62, 228, 200, 0.2)'
                }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#0B1929' }}>
                    Appointment Types by Gender
                  </Typography>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={appointmentsByGender} margin={{ bottom: isMobile ? 40 : 5, left: isMobile ? -20 : 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(62, 228, 200, 0.1)" />
                      <XAxis 
                        dataKey="type" 
                        stroke="#0B1929"
                        angle={isMobile ? -45 : 0}
                        textAnchor={isMobile ? "end" : "middle"}
                        interval={0}
                        tick={{ fontSize: isMobile ? 9 : 12 }}
                        height={isMobile ? 60 : 30}
                      />
                      <YAxis 
                        stroke="#0B1929"
                        tick={{ fontSize: isMobile ? 10 : 12 }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                          border: '1px solid rgba(62, 228, 200, 0.3)',
                          borderRadius: 8
                        }}
                      />
                      <Legend />
                      <Bar dataKey="male" fill="#45B7D1" name="Male" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="female" fill="#3EE4C8" name="Female" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>

                {/* Patient Types */}
                <Paper elevation={0} sx={{ 
                  p: 3,
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fffe 100%)',
                  border: '1px solid rgba(62, 228, 200, 0.2)'
                }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#0B1929' }}>
                    Patient Types
                  </Typography>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={patientTypes}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => isMobile ? `${value}%` : `${name}: ${value}%`}
                        outerRadius={isMobile ? 60 : 80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {patientTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                          border: '1px solid rgba(62, 228, 200, 0.3)',
                          borderRadius: 8
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Box>

              {/* Revenue by Appointment Type */}
              <Paper elevation={0} sx={{ 
                p: 3,
                mt: 3,
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fffe 100%)',
                border: '1px solid rgba(62, 228, 200, 0.2)'
              }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#0B1929' }}>
                  Total Revenue by Appointment Type
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={revenueByType}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => isMobile ? `$${(value/1000).toFixed(1)}k` : `${name}: $${value.toLocaleString()}`}
                      outerRadius={isMobile ? 80 : 100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {revenueByType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        border: '1px solid rgba(62, 228, 200, 0.3)',
                        borderRadius: 8
                      }}
                      formatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>

              {/* Patient Satisfaction Radar Chart */}
              <Paper elevation={0} sx={{ 
                p: 3,
                mt: 3,
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fffe 100%)',
                border: '1px solid rgba(62, 228, 200, 0.2)'
              }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#0B1929' }}>
                  OmniDent AI Patient Satisfaction Metrics
                </Typography>
                <ResponsiveContainer width="100%" height={isMobile ? 300 : 400}>
                  <RadarChart data={patientSatisfaction}>
                    <PolarGrid 
                      stroke="rgba(62, 228, 200, 0.3)" 
                      strokeDasharray="3 3"
                    />
                    <PolarAngleAxis 
                      dataKey="metric" 
                      stroke="#0B1929"
                      tick={{ fontSize: isMobile ? 9 : 12 }}
                    />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 100]} 
                      stroke="rgba(62, 228, 200, 0.3)"
                    />
                    <Radar 
                      name="Satisfaction Score" 
                      dataKey="score" 
                      stroke="#3EE4C8" 
                      fill="#3EE4C8" 
                      fillOpacity={0.6}
                      strokeWidth={2}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        border: '1px solid rgba(62, 228, 200, 0.3)',
                        borderRadius: 8
                      }}
                      formatter={(value) => `${value}%`}
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </Paper>

              {/* Google Maps Patient Distribution */}
              <GoogleMapComponent isMobile={isMobile} />
              
            </Box>
          </>
        );
      case 1:
        return (
          <Box sx={{ 
            height: 'calc(100vh - 140px)',
            display: 'flex',
            flexDirection: 'column',
            ml: -3,
            mr: -3,
            mt: -2,
            position: 'relative'
          }}>
            {/* Mobile back button when patient is selected */}
            {isMobile && selectedPatient && (
              <Box sx={{ mb: 1, px: 2, pt: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => setSelectedPatient(null)}
                  size="small"
                  sx={{
                    backgroundColor: '#3EE4C8',
                    color: '#0B1929',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: 2,
                    px: 2,
                    py: 0.5,
                    fontSize: '0.875rem',
                    boxShadow: '0 2px 8px rgba(62, 228, 200, 0.2)',
                    '&:hover': {
                      backgroundColor: '#35ccb3',
                      boxShadow: '0 4px 12px rgba(62, 228, 200, 0.3)',
                      transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  Back to Patients
                </Button>
              </Box>
            )}
            
            {/* Main content area */}
            <Box sx={{ 
              display: 'flex',
              flex: 1,
              overflow: 'hidden',
              borderRadius: '12px',
              boxShadow: isMobile ? 'none' : '0 2px 12px rgba(0,0,0,0.08)',
              background: 'transparent',
              margin: isMobile ? '8px' : 2,
              height: isMobile && selectedPatient ? 'calc(100vh - 200px)' : 'calc(100vh - 180px)'
            }}>
              {/* Patient List - hide on mobile when patient is selected */}
              <Box sx={{ 
                display: isMobile && selectedPatient ? 'none' : 'block',
                width: isMobile ? '100%' : 'auto'
              }}>
                <PatientList 
                  patients={patients}
                  selectedPatient={selectedPatient}
                  onSelectPatient={setSelectedPatient}
                  isMobile={isMobile}
                />
              </Box>
              
              {/* Chat Interface - full width on mobile, show only when patient selected */}
              <Box sx={{ 
                display: isMobile && !selectedPatient ? 'none' : 'block',
                width: isMobile ? '100%' : 'auto',
                flex: isMobile ? 'none' : 1
              }}>
                <ChatInterface 
                  patient={selectedPatient}
                  onSendMessage={handleSendMessage}
                  isMobile={isMobile}
                />
              </Box>
            </Box>
          </Box>
        );
      case 2:
        return (
          <>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              Digital Forms
            </Typography>
            <Typography paragraph color="text.secondary">
              Create, manage, and track digital forms for patient intake, consent, and medical history.
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 3, mt: 3 }}>
              <Paper elevation={0} sx={{ 
                p: 3, 
                cursor: 'pointer',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fffe 100%)',
                border: '1px solid rgba(62, 228, 200, 0.2)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                '&:hover': { 
                  boxShadow: '0 6px 24px rgba(62, 228, 200, 0.2)',
                  transform: 'translateY(-4px)',
                  borderColor: '#3EE4C8'
                } 
              }}>
                <FormsIcon sx={{ color: '#3EE4C8', fontSize: 40, mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#0B1929' }}>Patient Intake</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(11, 25, 41, 0.6)', mt: 1 }}>New patient information form</Typography>
              </Paper>
              <Paper elevation={0} sx={{ 
                p: 3, 
                cursor: 'pointer',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fffe 100%)',
                border: '1px solid rgba(62, 228, 200, 0.2)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                '&:hover': { 
                  boxShadow: '0 6px 24px rgba(62, 228, 200, 0.2)',
                  transform: 'translateY(-4px)',
                  borderColor: '#3EE4C8'
                } 
              }}>
                <FormsIcon sx={{ color: '#3EE4C8', fontSize: 40, mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#0B1929' }}>Medical History</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(11, 25, 41, 0.6)', mt: 1 }}>Comprehensive health questionnaire</Typography>
              </Paper>
              <Paper elevation={0} sx={{ 
                p: 3, 
                cursor: 'pointer',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fffe 100%)',
                border: '1px solid rgba(62, 228, 200, 0.2)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                '&:hover': { 
                  boxShadow: '0 6px 24px rgba(62, 228, 200, 0.2)',
                  transform: 'translateY(-4px)',
                  borderColor: '#3EE4C8'
                } 
              }}>
                <FormsIcon sx={{ color: '#3EE4C8', fontSize: 40, mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#0B1929' }}>Consent Forms</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(11, 25, 41, 0.6)', mt: 1 }}>Treatment consent documents</Typography>
              </Paper>
              <Paper elevation={0} sx={{ 
                p: 3, 
                cursor: 'pointer',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fffe 100%)',
                border: '1px solid rgba(62, 228, 200, 0.2)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                '&:hover': { 
                  boxShadow: '0 6px 24px rgba(62, 228, 200, 0.2)',
                  transform: 'translateY(-4px)',
                  borderColor: '#3EE4C8'
                } 
              }}>
                <FormsIcon sx={{ color: '#3EE4C8', fontSize: 40, mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#0B1929' }}>Insurance Forms</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(11, 25, 41, 0.6)', mt: 1 }}>Insurance verification docs</Typography>
              </Paper>
            </Box>
          </>
        );
      case 3:
        return (
          <>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              Reports & Analytics
            </Typography>
            <Typography paragraph color="text.secondary">
              Generate comprehensive reports for financial, operational, and clinical insights.
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 2, mt: 3 }}>
              <Paper elevation={0} sx={{ 
                p: 3,
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fffe 100%)',
                border: '1px solid rgba(62, 228, 200, 0.2)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                '&:hover': {
                  boxShadow: '0 4px 20px rgba(62, 228, 200, 0.15)',
                  transform: 'translateY(-2px)'
                }
              }}>
                <ReportsIcon sx={{ color: '#3EE4C8', fontSize: 40, mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#0B1929' }}>Financial Reports</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(11, 25, 41, 0.6)', mt: 1 }}>
                  Production, collections, and accounts receivable
                </Typography>
              </Paper>
              <Paper elevation={0} sx={{ 
                p: 3,
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fffe 100%)',
                border: '1px solid rgba(62, 228, 200, 0.2)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                '&:hover': {
                  boxShadow: '0 4px 20px rgba(62, 228, 200, 0.15)',
                  transform: 'translateY(-2px)'
                }
              }}>
                <ReportsIcon sx={{ color: '#3EE4C8', fontSize: 40, mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#0B1929' }}>Patient Reports</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(11, 25, 41, 0.6)', mt: 1 }}>
                  Demographics, retention, and satisfaction
                </Typography>
              </Paper>
              <Paper elevation={0} sx={{ 
                p: 3,
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fffe 100%)',
                border: '1px solid rgba(62, 228, 200, 0.2)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                '&:hover': {
                  boxShadow: '0 4px 20px rgba(62, 228, 200, 0.15)',
                  transform: 'translateY(-2px)'
                }
              }}>
                <ReportsIcon sx={{ color: '#3EE4C8', fontSize: 40, mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#0B1929' }}>Insurance Analysis</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(11, 25, 41, 0.6)', mt: 1 }}>
                  Claims, payments, and aging reports
                </Typography>
              </Paper>
              <Paper elevation={0} sx={{ 
                p: 3,
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fffe 100%)',
                border: '1px solid rgba(62, 228, 200, 0.2)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                '&:hover': {
                  boxShadow: '0 4px 20px rgba(62, 228, 200, 0.15)',
                  transform: 'translateY(-2px)'
                }
              }}>
                <ReportsIcon sx={{ color: '#3EE4C8', fontSize: 40, mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#0B1929' }}>Operational Metrics</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(11, 25, 41, 0.6)', mt: 1 }}>
                  Appointment utilization and staff productivity
                </Typography>
              </Paper>
            </Box>
          </>
        );
      case 4:
        return (
          <Box sx={{ 
            mx: isMobile ? -2 : 0,
            px: isMobile ? 1 : 0 
          }}>
            <Typography variant="h4" gutterBottom sx={{ 
              fontWeight: 600,
              px: isMobile ? 2 : 0
            }}>
              Practice Enhancer
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ 
              mb: 2,
              px: isMobile ? 2 : 0
            }}>
              Chat with your AI assistant that knows everything about your practice
            </Typography>
            <PracticeEnhancerChat isMobile={isMobile} />
          </Box>
        );
      case 5:
        return (
          <>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              Settings
            </Typography>
            <Typography paragraph color="text.secondary">
              Configure practice settings, user preferences, and system configurations.
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Paper elevation={1} sx={{ p: 3, mb: 2 }}>
                <Typography variant="h6" gutterBottom>Practice Information</Typography>
                <Typography variant="body2" color="text.secondary">
                  Update practice details, hours, and contact information
                </Typography>
              </Paper>
              <Paper elevation={1} sx={{ p: 3, mb: 2 }}>
                <Typography variant="h6" gutterBottom>User Management</Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage staff accounts, roles, and permissions
                </Typography>
              </Paper>
              <Paper elevation={1} sx={{ p: 3, mb: 2 }}>
                <Typography variant="h6" gutterBottom>Billing & Insurance</Typography>
                <Typography variant="body2" color="text.secondary">
                  Configure fee schedules, insurance plans, and payment settings
                </Typography>
              </Paper>
              <Paper elevation={1} sx={{ p: 3, mb: 2 }}>
                <Typography variant="h6" gutterBottom>Integrations</Typography>
                <Typography variant="body2" color="text.secondary">
                  Connect third-party services and APIs
                </Typography>
              </Paper>
              <Paper elevation={0} sx={{ 
                p: 3,
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fffe 100%)',
                border: '1px solid rgba(62, 228, 200, 0.2)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                '&:hover': {
                  boxShadow: '0 4px 20px rgba(62, 228, 200, 0.15)',
                  transform: 'translateY(-2px)'
                }
              }}>
                <Typography variant="h6" gutterBottom>Session History</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  View your login history and active sessions
                </Typography>
                <Button variant="outlined" onClick={() => setSelectedIndex(6)} sx={{
                  borderColor: '#3EE4C8',
                  color: '#0B1929',
                  '&:hover': {
                    borderColor: '#2BC4A8',
                    backgroundColor: 'rgba(62, 228, 200, 0.05)'
                  }
                }}>
                  View Sessions
                </Button>
              </Paper>
            </Box>
          </>
        );
      case 6:
        return <SessionHistory />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
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
            Welcome, {currentUser.firstName} {currentUser.lastName}
          </Typography>
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <Avatar sx={{ width: 32, height: 32 }}>
              {currentUser.firstName?.charAt(0)}
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
      
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
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
      
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        
        <Container maxWidth="lg">
          <Box sx={{ mt: 2 }}>
            {renderContent()}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;