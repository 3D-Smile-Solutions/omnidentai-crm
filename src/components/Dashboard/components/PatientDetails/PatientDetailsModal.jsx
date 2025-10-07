// frontend/src/components/Dashboard/components/PatientDetails/PatientDetailsModal.jsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  Badge as BadgeIcon,
  ContactMail as ContactIcon
} from '@mui/icons-material';
import { useTheme } from '../../../../context/ThemeContext';

const PatientDetailsModal = ({ open, onClose, patient }) => {
  const { isDarkMode } = useTheme();
  
  if (!patient) return null;

  const getInitials = (firstName, lastName) => {
    const first = (firstName || '').trim();
    const last = (lastName || '').trim();
    
    if (!first && !last) return '??';
    if (first && last) return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
    if (first) return first.slice(0, 2).toUpperCase();
    return last.slice(0, 2).toUpperCase();
  };

  const getAvatarColor = (id) => {
    const colors = isDarkMode 
      ? ['#64ffda', '#a78bfa', '#f472b6', '#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a3e635']
      : ['#3EE4C8', '#2BC4A8', '#62E4C8', '#45D4B8', '#4ECDC4', '#38C9B4', '#2BB4A4', '#1FA494'];
    return colors[id % colors.length];
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

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      BackdropProps={{
        sx: {
          backgroundColor: isDarkMode 
            ? 'rgba(0, 0, 0, 0.7)' 
            : 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(8px)',
        }
      }}
      PaperProps={{
        sx: {
          borderRadius: '16px',
          background: isDarkMode 
            ? 'rgba(17, 24, 39, 0.85)' // Increased opacity from 0.25 to 0.85
            : 'rgba(255, 255, 255, 0.85)', // Increased opacity from 0.25 to 0.85
          backdropFilter: 'blur(20px)',
          border: isDarkMode 
            ? '1px solid rgba(100, 255, 218, 0.15)' 
            : '1px solid rgba(62, 228, 200, 0.15)',
          boxShadow: isDarkMode
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            : '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
          position: 'relative',
          overflow: 'hidden'
        }
      }}
    >
      {/* Subtle background gradient overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isDarkMode
            ? 'linear-gradient(135deg, rgba(100, 255, 218, 0.03) 0%, rgba(167, 139, 250, 0.03) 100%)'
            : 'linear-gradient(135deg, rgba(62, 228, 200, 0.05) 0%, rgba(43, 196, 168, 0.05) 100%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 2,
          pt: 2.5,
          px: 3,
          borderBottom: isDarkMode 
            ? '1px solid rgba(100, 255, 218, 0.1)' 
            : '1px solid rgba(62, 228, 200, 0.1)',
          background: isDarkMode
            ? 'linear-gradient(135deg, rgba(100, 255, 218, 0.05) 0%, transparent 100%)'
            : 'linear-gradient(135deg, rgba(62, 228, 200, 0.08) 0%, transparent 100%)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600, 
            color: isDarkMode ? '#64ffda' : '#0B1929',
            letterSpacing: '0.5px',
          }}
        >
          Patient Details
        </Typography>
        <IconButton 
          onClick={onClose} 
          size="small"
          sx={{
            color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(11, 25, 41, 0.6)',
            backgroundColor: isDarkMode 
              ? 'rgba(100, 255, 218, 0.08)' 
              : 'rgba(62, 228, 200, 0.1)',
            '&:hover': {
              backgroundColor: isDarkMode 
                ? 'rgba(100, 255, 218, 0.15)' 
                : 'rgba(62, 228, 200, 0.2)',
              color: isDarkMode ? '#64ffda' : '#3EE4C8',
            },
            transition: 'all 0.25s ease',
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, px: 3, position: 'relative', zIndex: 1 }}>
        {/* Patient Avatar and Name */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 2,
            mt: 2,
            p: 3,
            borderRadius: '12px',
            background: isDarkMode 
              ? 'rgba(100, 255, 218, 0.05)' 
              : 'rgba(62, 228, 200, 0.08)',
            border: isDarkMode 
              ? '1px solid rgba(100, 255, 218, 0.1)' 
              : '1px solid rgba(62, 228, 200, 0.1)',
          }}
        >
          <Avatar
            sx={{
              bgcolor: getAvatarColor(patient.id),
              width: 80,
              height: 80,
              fontSize: '2rem',
              fontWeight: 600,
              mb: 2,
              boxShadow: isDarkMode
                ? '0 8px 32px rgba(100, 255, 218, 0.2)'
                : '0 8px 32px rgba(62, 228, 200, 0.25)',
              border: isDarkMode 
                ? '2px solid rgba(100, 255, 218, 0.2)' 
                : '2px solid rgba(62, 228, 200, 0.2)',
            }}
          >
            {getInitials(patient.first_name || patient.firstName, patient.last_name || patient.lastName)}
          </Avatar>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 600, 
              color: isDarkMode ? '#64ffda' : '#0B1929',
              mb: 0.5,
              letterSpacing: '0.25px',
            }}
          >
            {patient.first_name || patient.firstName} {patient.last_name || patient.lastName}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: isDarkMode 
                ? 'rgba(255, 255, 255, 0.5)' 
                : 'rgba(11, 25, 41, 0.6)',
              fontWeight: 500,
            }}
          >
            Patient
          </Typography>
        </Box>

        <Divider 
          sx={{ 
            my: 2,
            borderColor: isDarkMode 
              ? 'rgba(100, 255, 218, 0.1)' 
              : 'rgba(62, 228, 200, 0.1)',
          }} 
        />

        {/* Patient Information List */}
        <List sx={{ py: 0 }}>
          {/* Patient ID */}
          <ListItem 
            sx={{ 
              px: 2,
              py: 1.5,
              mb: 1,
              borderRadius: '10px',
              backgroundColor: isDarkMode 
                ? 'rgba(100, 255, 218, 0.03)' 
                : 'rgba(62, 228, 200, 0.05)',
              border: isDarkMode 
                ? '1px solid rgba(100, 255, 218, 0.08)' 
                : '1px solid rgba(62, 228, 200, 0.08)',
              transition: 'all 0.25s ease',
              '&:hover': {
                backgroundColor: isDarkMode 
                  ? 'rgba(100, 255, 218, 0.06)' 
                  : 'rgba(62, 228, 200, 0.08)',
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <BadgeIcon sx={{ 
                color: isDarkMode ? '#64ffda' : '#3EE4C8',
                fontSize: 22,
              }} />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: isDarkMode 
                      ? 'rgba(255, 255, 255, 0.5)' 
                      : 'rgba(11, 25, 41, 0.6)',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Patient ID
                </Typography>
              }
              secondary={
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : '#0B1929',
                    fontWeight: 600,
                    fontFamily: 'monospace',
                    letterSpacing: '0.5px',
                  }}
                >
                  {patient.id}
                </Typography>
              }
            />
          </ListItem>

          {/* Contact ID */}
          {patient.contact_id && (
            <ListItem 
              sx={{ 
                px: 2,
                py: 1.5,
                mb: 1,
                borderRadius: '10px',
                backgroundColor: isDarkMode 
                  ? 'rgba(100, 255, 218, 0.03)' 
                  : 'rgba(62, 228, 200, 0.05)',
                border: isDarkMode 
                  ? '1px solid rgba(100, 255, 218, 0.08)' 
                  : '1px solid rgba(62, 228, 200, 0.08)',
                transition: 'all 0.25s ease',
                '&:hover': {
                  backgroundColor: isDarkMode 
                    ? 'rgba(100, 255, 218, 0.06)' 
                    : 'rgba(62, 228, 200, 0.08)',
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <ContactIcon sx={{ 
                  color: isDarkMode ? '#64ffda' : '#3EE4C8',
                  fontSize: 22,
                }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: isDarkMode 
                        ? 'rgba(255, 255, 255, 0.5)' 
                        : 'rgba(11, 25, 41, 0.6)',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Contact ID
                  </Typography>
                }
                secondary={
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : '#0B1929',
                      fontWeight: 600,
                      fontFamily: 'monospace',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {patient.contact_id}
                  </Typography>
                }
              />
            </ListItem>
          )}

          {/* Email */}
          {patient.email && (
            <ListItem 
              sx={{ 
                px: 2,
                py: 1.5,
                mb: 1,
                borderRadius: '10px',
                backgroundColor: isDarkMode 
                  ? 'rgba(100, 255, 218, 0.03)' 
                  : 'rgba(62, 228, 200, 0.05)',
                border: isDarkMode 
                  ? '1px solid rgba(100, 255, 218, 0.08)' 
                  : '1px solid rgba(62, 228, 200, 0.08)',
                transition: 'all 0.25s ease',
                '&:hover': {
                  backgroundColor: isDarkMode 
                    ? 'rgba(100, 255, 218, 0.06)' 
                    : 'rgba(62, 228, 200, 0.08)',
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <EmailIcon sx={{ 
                  color: isDarkMode ? '#64ffda' : '#3EE4C8',
                  fontSize: 22,
                }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: isDarkMode 
                        ? 'rgba(255, 255, 255, 0.5)' 
                        : 'rgba(11, 25, 41, 0.6)',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Email
                  </Typography>
                }
                secondary={
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : '#0B1929',
                      fontWeight: 600,
                    }}
                  >
                    {patient.email}
                  </Typography>
                }
              />
            </ListItem>
          )}

          {/* Phone */}
          {patient.phone && (
            <ListItem 
              sx={{ 
                px: 2,
                py: 1.5,
                mb: 1,
                borderRadius: '10px',
                backgroundColor: isDarkMode 
                  ? 'rgba(100, 255, 218, 0.03)' 
                  : 'rgba(62, 228, 200, 0.05)',
                border: isDarkMode 
                  ? '1px solid rgba(100, 255, 218, 0.08)' 
                  : '1px solid rgba(62, 228, 200, 0.08)',
                transition: 'all 0.25s ease',
                '&:hover': {
                  backgroundColor: isDarkMode 
                    ? 'rgba(100, 255, 218, 0.06)' 
                    : 'rgba(62, 228, 200, 0.08)',
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <PhoneIcon sx={{ 
                  color: isDarkMode ? '#64ffda' : '#3EE4C8',
                  fontSize: 22,
                }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: isDarkMode 
                        ? 'rgba(255, 255, 255, 0.5)' 
                        : 'rgba(11, 25, 41, 0.6)',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Phone
                  </Typography>
                }
                secondary={
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : '#0B1929',
                      fontWeight: 600,
                    }}
                  >
                    {patient.phone}
                  </Typography>
                }
              />
            </ListItem>
          )}

          {/* Created Date */}
          {patient.created_at && (
            <ListItem 
              sx={{ 
                px: 2,
                py: 1.5,
                borderRadius: '10px',
                backgroundColor: isDarkMode 
                  ? 'rgba(100, 255, 218, 0.03)' 
                  : 'rgba(62, 228, 200, 0.05)',
                border: isDarkMode 
                  ? '1px solid rgba(100, 255, 218, 0.08)' 
                  : '1px solid rgba(62, 228, 200, 0.08)',
                transition: 'all 0.25s ease',
                '&:hover': {
                  backgroundColor: isDarkMode 
                    ? 'rgba(100, 255, 218, 0.06)' 
                    : 'rgba(62, 228, 200, 0.08)',
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <CalendarIcon sx={{ 
                  color: isDarkMode ? '#64ffda' : '#3EE4C8',
                  fontSize: 22,
                }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: isDarkMode 
                        ? 'rgba(255, 255, 255, 0.5)' 
                        : 'rgba(11, 25, 41, 0.6)',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Patient Since
                  </Typography>
                }
                secondary={
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : '#0B1929',
                      fontWeight: 600,
                    }}
                  >
                    {formatDate(patient.created_at)}
                  </Typography>
                }
              />
            </ListItem>
          )}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default PatientDetailsModal;