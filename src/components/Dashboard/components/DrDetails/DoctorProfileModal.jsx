// frontend/src/components/Dashboard/components/DrDetails/DoctorProfileModal.jsx
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
  ListItemText,
  Chip
} from '@mui/material';
import {
  Close as CloseIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  Badge as BadgeIcon,
  Business as BusinessIcon,
  LocalHospital as LocalHospitalIcon
} from '@mui/icons-material';

const DoctorProfileModal = ({ open, onClose, doctor }) => {
  if (!doctor) return null;

  // Debug logs
  console.log('🔍 Doctor object:', doctor);
  console.log('🔍 Doctor keys:', doctor ? Object.keys(doctor) : 'No doctor');

  const getInitials = () => {
    const firstName = doctor.first_name || doctor.firstName || '';
    const lastName = doctor.last_name || doctor.lastName || '';
    
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    } else if (firstName) {
      return firstName.slice(0, 2).toUpperCase();
    } else if (doctor.email) {
      return doctor.email[0].toUpperCase();
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

  // ✅ FIX: Use doctor prop consistently
  const firstName = doctor.first_name || doctor.firstName || '';
  const lastName = doctor.last_name || doctor.lastName || '';
  const fullName = firstName && lastName ? `Dr. ${firstName} ${lastName}` : 
                   firstName ? `Dr. ${firstName}` : 
                   'Doctor';

  console.log('🔍 Name parts:', { firstName, lastName, fullName });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
        }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 2,
          borderBottom: '1px solid rgba(62, 228, 200, 0.15)',
          background: 'linear-gradient(135deg, #fafbfc 0%, #f0f7f5 100%)'
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#0B1929' }}>
          My Profile
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {/* Doctor Avatar and Name */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 3
          }}
        >
          <Avatar
            sx={{
              bgcolor: '#3EE4C8',
              width: 80,
              height: 80,
              fontSize: '2rem',
              fontWeight: 600,
              mb: 2,
              color: '#0B1929'
            }}
          >
            {getInitials()}
          </Avatar>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#0B1929', mb: 0.5 }}>
            {fullName}
          </Typography>
          <Chip 
            icon={<LocalHospitalIcon sx={{ fontSize: 16 }} />}
            label="Dentist" 
            size="small"
            sx={{ 
              backgroundColor: 'rgba(62, 228, 200, 0.15)',
              color: '#0B1929',
              fontWeight: 500
            }}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Doctor Information List */}
        <List sx={{ py: 0 }}>
          {/* Doctor ID */}
          <ListItem sx={{ px: 0, py: 1.5 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <BadgeIcon sx={{ color: '#3EE4C8' }} />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="caption" sx={{ color: 'rgba(11, 25, 41, 0.6)' }}>
                  Doctor ID
                </Typography>
              }
              secondary={
                <Typography variant="body2" sx={{ color: '#0B1929', fontWeight: 500, fontFamily: 'monospace' }}>
                  {doctor.id}
                </Typography>
              }
            />
          </ListItem>

          {/* Email */}
          {doctor.email && (
            <ListItem sx={{ px: 0, py: 1.5 }}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <EmailIcon sx={{ color: '#3EE4C8' }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="caption" sx={{ color: 'rgba(11, 25, 41, 0.6)' }}>
                    Email
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" sx={{ color: '#0B1929', fontWeight: 500 }}>
                    {doctor.email}
                  </Typography>
                }
              />
            </ListItem>
          )}

          {/* Phone */}
          {doctor.phone && (
            <ListItem sx={{ px: 0, py: 1.5 }}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <PhoneIcon sx={{ color: '#3EE4C8' }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="caption" sx={{ color: 'rgba(11, 25, 41, 0.6)' }}>
                    Phone
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" sx={{ color: '#0B1929', fontWeight: 500 }}>
                    {doctor.phone}
                  </Typography>
                }
              />
            </ListItem>
          )}

          {/* Practice Name */}
          {doctor.practice_name && (
            <ListItem sx={{ px: 0, py: 1.5 }}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <BusinessIcon sx={{ color: '#3EE4C8' }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="caption" sx={{ color: 'rgba(11, 25, 41, 0.6)' }}>
                    Practice
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" sx={{ color: '#0B1929', fontWeight: 500 }}>
                    {doctor.practice_name}
                  </Typography>
                }
              />
            </ListItem>
          )}

          {/* Member Since */}
          {doctor.created_at && (
            <ListItem sx={{ px: 0, py: 1.5 }}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <CalendarIcon sx={{ color: '#3EE4C8' }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="caption" sx={{ color: 'rgba(11, 25, 41, 0.6)' }}>
                    Member Since
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" sx={{ color: '#0B1929', fontWeight: 500 }}>
                    {formatDate(doctor.created_at)}
                  </Typography>
                }
              />
            </ListItem>
          )}
        </List>

        <Divider sx={{ my: 2 }} />

        {/* Account Status */}
        <Box sx={{ 
          p: 2, 
          backgroundColor: 'rgba(62, 228, 200, 0.05)',
          borderRadius: 2,
          textAlign: 'center'
        }}>
          <Typography variant="caption" sx={{ color: 'rgba(11, 25, 41, 0.6)', display: 'block', mb: 0.5 }}>
            Account Status
          </Typography>
          <Chip 
            label="Active" 
            size="small"
            sx={{ 
              backgroundColor: '#3EE4C8',
              color: '#0B1929',
              fontWeight: 600
            }}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DoctorProfileModal;