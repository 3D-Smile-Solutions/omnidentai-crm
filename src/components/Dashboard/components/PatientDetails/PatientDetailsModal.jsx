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

const PatientDetailsModal = ({ open, onClose, patient }) => {
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
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#F7B801', '#96CEB4', '#DDA77B', '#9B59B6', '#3498DB'];
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
          Patient Details
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {/* Patient Avatar and Name */}
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
              bgcolor: getAvatarColor(patient.id),
              width: 80,
              height: 80,
              fontSize: '2rem',
              fontWeight: 600,
              mb: 2
            }}
          >
            {getInitials(patient.first_name || patient.firstName, patient.last_name || patient.lastName)}
          </Avatar>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#0B1929', mb: 0.5 }}>
            {patient.first_name || patient.firstName} {patient.last_name || patient.lastName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(11, 25, 41, 0.6)' }}>
            Patient
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Patient Information List */}
        <List sx={{ py: 0 }}>
          {/* Patient ID */}
          <ListItem sx={{ px: 0, py: 1.5 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <BadgeIcon sx={{ color: '#3EE4C8' }} />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="caption" sx={{ color: 'rgba(11, 25, 41, 0.6)' }}>
                  Patient ID
                </Typography>
              }
              secondary={
                <Typography variant="body2" sx={{ color: '#0B1929', fontWeight: 500, fontFamily: 'monospace' }}>
                  {patient.id}
                </Typography>
              }
            />
          </ListItem>

          {/* Contact ID */}
          {patient.contact_id && (
            <ListItem sx={{ px: 0, py: 1.5 }}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <ContactIcon sx={{ color: '#3EE4C8' }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="caption" sx={{ color: 'rgba(11, 25, 41, 0.6)' }}>
                    Contact ID
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" sx={{ color: '#0B1929', fontWeight: 500, fontFamily: 'monospace' }}>
                    {patient.contact_id}
                  </Typography>
                }
              />
            </ListItem>
          )}

          {/* Email */}
          {patient.email && (
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
                    {patient.email}
                  </Typography>
                }
              />
            </ListItem>
          )}

          {/* Phone */}
          {patient.phone && (
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
                    {patient.phone}
                  </Typography>
                }
              />
            </ListItem>
          )}

          {/* Created Date */}
          {patient.created_at && (
            <ListItem sx={{ px: 0, py: 1.5 }}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <CalendarIcon sx={{ color: '#3EE4C8' }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="caption" sx={{ color: 'rgba(11, 25, 41, 0.6)' }}>
                    Patient Since
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" sx={{ color: '#0B1929', fontWeight: 500 }}>
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