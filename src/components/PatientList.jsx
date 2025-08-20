import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Chip,
  InputBase,
  IconButton,
  Paper
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const PatientList = ({ patients, selectedPatient, onSelectPatient, isMobile }) => {
  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getAvatarColor = (id) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#F7B801', '#96CEB4', '#DDA77B', '#9B59B6', '#3498DB'];
    return colors[id % colors.length];
  };

  const truncateMessage = (message, maxLength = 40) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - messageTime) / 60000);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <Box sx={{ 
      width: isMobile ? '100%' : 320, 
      height: '100%',
      borderRight: isMobile ? 'none' : '1px solid rgba(62, 228, 200, 0.15)',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(180deg, #ffffff 0%, #fafffe 100%)'
    }}>
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(62, 228, 200, 0.15)' }}>
        <Paper
          elevation={0}
          sx={{
            p: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(62, 228, 200, 0.05)',
            border: '1px solid rgba(62, 228, 200, 0.2)',
            borderRadius: 2
          }}
        >
          <IconButton sx={{ p: '10px' }} aria-label="search">
            <SearchIcon sx={{ color: 'rgba(11, 25, 41, 0.6)' }} />
          </IconButton>
          <InputBase
            sx={{ ml: 1, flex: 1, color: '#0B1929' }}
            placeholder="Search patients..."
            inputProps={{ 'aria-label': 'search patients' }}
          />
        </Paper>
      </Box>

      <List sx={{ 
        flexGrow: 1, 
        overflow: 'auto',
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'rgba(62, 228, 200, 0.05)',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(62, 228, 200, 0.3)',
          borderRadius: '3px',
          '&:hover': {
            background: 'rgba(62, 228, 200, 0.5)',
          },
        },
      }}>
        {patients.map((patient) => {
          const lastMessage = patient.messages[patient.messages.length - 1];
          const isSelected = selectedPatient?.id === patient.id;
          
          return (
            <ListItem
              key={patient.id}
              button
              onClick={() => onSelectPatient(patient)}
              sx={{
                py: 2,
                px: 2,
                backgroundColor: isSelected ? 'rgba(62, 228, 200, 0.15)' : 'transparent',
                borderLeft: isSelected ? '3px solid #3EE4C8' : '3px solid transparent',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: isSelected ? 'rgba(62, 228, 200, 0.2)' : 'rgba(62, 228, 200, 0.08)',
                }
              }}
            >
              <ListItemAvatar>
                <Avatar 
                  sx={{ 
                    bgcolor: getAvatarColor(patient.id),
                    width: 45,
                    height: 45,
                    fontSize: '1.1rem',
                    fontWeight: 600
                  }}
                >
                  {getInitials(patient.firstName, patient.lastName)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        fontWeight: 600,
                        color: '#0B1929'
                      }}
                    >
                      {patient.firstName} {patient.lastName}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: 'rgba(11, 25, 41, 0.5)',
                        fontSize: '0.7rem'
                      }}
                    >
                      {getTimeAgo(lastMessage.timestamp)}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'rgba(11, 25, 41, 0.7)',
                        mt: 0.5,
                        display: 'block'
                      }}
                    >
                      {truncateMessage(lastMessage.message)}
                    </Typography>
                    {patient.unreadCount > 0 && (
                      <Chip 
                        label={patient.unreadCount} 
                        size="small"
                        sx={{ 
                          mt: 1,
                          height: 20,
                          backgroundColor: '#3EE4C8',
                          color: '#0B1929',
                          fontWeight: 600,
                          fontSize: '0.7rem'
                        }}
                      />
                    )}
                  </Box>
                }
              />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default PatientList;