// frontend/src/components/Profile/Profile.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Button,
  IconButton
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  Badge as BadgeIcon,
  Business as BusinessIcon,
  LocalHospital as LocalHospitalIcon,
  Edit as EditIcon
} from '@mui/icons-material';

const Profile = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.auth);

  if (!currentUser) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  const getInitials = () => {
    const firstName = currentUser.first_name || currentUser.firstName || '';
    const lastName = currentUser.last_name || currentUser.lastName || '';
    
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    } else if (firstName) {
      return firstName.slice(0, 2).toUpperCase();
    } else if (currentUser.email) {
      return currentUser.email[0].toUpperCase();
    }
    return 'DR';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const firstName = currentUser.first_name || currentUser.firstName || '';
  const lastName = currentUser.last_name || currentUser.lastName || '';
  const fullName = firstName && lastName ? `Dr. ${firstName} ${lastName}` : 
                   firstName ? `Dr. ${firstName}` : 
                   'Doctor';

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fafbfc 0%, #f0f7f5 100%)',
      py: 4
    }}>
      <Container maxWidth="md">
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard')}
          sx={{ 
            mb: 3,
            color: '#0B1929',
            '&:hover': {
              backgroundColor: 'rgba(62, 228, 200, 0.1)'
            }
          }}
        >
          Back to Dashboard
        </Button>

        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
          }}
        >
          {/* Header Section */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #3EE4C8 0%, #2BC4A8 100%)',
              p: 4,
              position: 'relative'
            }}
          >
            <IconButton
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: '#0B1929',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.3)'
                }
              }}
            >
              <EditIcon />
            </IconButton>

            <Box sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{
                  bgcolor: '#0B1929',
                  width: 100,
                  height: 100,
                  fontSize: '2.5rem',
                  fontWeight: 600,
                  margin: '0 auto 16px',
                  border: '4px solid rgba(255,255,255,0.3)'
                }}
              >
                {getInitials()}
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#0B1929', mb: 1 }}>
                {fullName}
              </Typography>
              <Chip 
                icon={<LocalHospitalIcon sx={{ fontSize: 18 }} />}
                label="Dentist" 
                sx={{ 
                  backgroundColor: 'rgba(11, 25, 41, 0.15)',
                  color: '#0B1929',
                  fontWeight: 600,
                  fontSize: '0.875rem'
                }}
              />
            </Box>
          </Box>

          {/* Content Section */}
          <Box sx={{ p: 4 }}>
            {/* Personal Information */}
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#0B1929', mb: 2 }}>
              Personal Information
            </Typography>

            <List sx={{ mb: 3 }}>
              {/* Doctor ID */}
              <ListItem sx={{ px: 0, py: 2 }}>
                <ListItemIcon sx={{ minWidth: 48 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(62, 228, 200, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <BadgeIcon sx={{ color: '#3EE4C8', fontSize: 20 }} />
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="caption" sx={{ color: 'rgba(11, 25, 41, 0.6)', fontWeight: 500 }}>
                      Doctor ID
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body1" sx={{ color: '#0B1929', fontWeight: 500, fontFamily: 'monospace', mt: 0.5 }}>
                      {currentUser.id}
                    </Typography>
                  }
                />
              </ListItem>

              <Divider />

              {/* Email */}
              {currentUser.email && (
                <>
                  <ListItem sx={{ px: 0, py: 2 }}>
                    <ListItemIcon sx={{ minWidth: 48 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          backgroundColor: 'rgba(62, 228, 200, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <EmailIcon sx={{ color: '#3EE4C8', fontSize: 20 }} />
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="caption" sx={{ color: 'rgba(11, 25, 41, 0.6)', fontWeight: 500 }}>
                          Email Address
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body1" sx={{ color: '#0B1929', fontWeight: 500, mt: 0.5 }}>
                          {currentUser.email}
                        </Typography>
                      }
                    />
                  </ListItem>
                  <Divider />
                </>
              )}

              {/* Phone */}
              {currentUser.phone && (
                <>
                  <ListItem sx={{ px: 0, py: 2 }}>
                    <ListItemIcon sx={{ minWidth: 48 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          backgroundColor: 'rgba(62, 228, 200, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <PhoneIcon sx={{ color: '#3EE4C8', fontSize: 20 }} />
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="caption" sx={{ color: 'rgba(11, 25, 41, 0.6)', fontWeight: 500 }}>
                          Phone Number
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body1" sx={{ color: '#0B1929', fontWeight: 500, mt: 0.5 }}>
                          {currentUser.phone}
                        </Typography>
                      }
                    />
                  </ListItem>
                  <Divider />
                </>
              )}

              {/* Practice Name */}
              {currentUser.practice_name && (
                <>
                  <ListItem sx={{ px: 0, py: 2 }}>
                    <ListItemIcon sx={{ minWidth: 48 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          backgroundColor: 'rgba(62, 228, 200, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <BusinessIcon sx={{ color: '#3EE4C8', fontSize: 20 }} />
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="caption" sx={{ color: 'rgba(11, 25, 41, 0.6)', fontWeight: 500 }}>
                          Practice Name
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body1" sx={{ color: '#0B1929', fontWeight: 500, mt: 0.5 }}>
                          {currentUser.practice_name}
                        </Typography>
                      }
                    />
                  </ListItem>
                  <Divider />
                </>
              )}

              {/* Member Since */}
              {currentUser.created_at && (
                <ListItem sx={{ px: 0, py: 2 }}>
                  <ListItemIcon sx={{ minWidth: 48 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(62, 228, 200, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <CalendarIcon sx={{ color: '#3EE4C8', fontSize: 20 }} />
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="caption" sx={{ color: 'rgba(11, 25, 41, 0.6)', fontWeight: 500 }}>
                        Member Since
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body1" sx={{ color: '#0B1929', fontWeight: 500, mt: 0.5 }}>
                        {formatDate(currentUser.created_at)}
                      </Typography>
                    }
                  />
                </ListItem>
              )}
            </List>

            {/* Account Status Section */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#0B1929', mb: 2 }}>
                Account Status
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  backgroundColor: 'rgba(62, 228, 200, 0.05)',
                  borderRadius: 2,
                  border: '1px solid rgba(62, 228, 200, 0.2)',
                  textAlign: 'center'
                }}
              >
                <Chip 
                  label="Active" 
                  sx={{ 
                    backgroundColor: '#3EE4C8',
                    color: '#0B1929',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    px: 2
                  }}
                />
                <Typography variant="body2" sx={{ color: 'rgba(11, 25, 41, 0.6)', mt: 2 }}>
                  Your account is in good standing
                </Typography>
              </Paper>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Profile;