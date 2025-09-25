import React, { useState, useMemo } from 'react';
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

const PatientList = ({ patients = [], selectedPatient, onSelectPatient, isMobile }) => {
  const [query, setQuery] = useState('');

  const getInitials = (firstName = '', lastName = '') => {
    const a = (firstName || '').trim();
    const b = (lastName || '').trim();
    if (a && b) return `${a[0]}${b[0]}`.toUpperCase();
    if (a) return a.slice(0, 2).toUpperCase();
    if (b) return b.slice(0, 2).toUpperCase();
    return '??';
  };

  // deterministic color from id string (works for UUID)
  const getAvatarColor = (id = '') => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#F7B801', '#96CEB4', '#DDA77B', '#9B59B6', '#3498DB'];
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const truncateMessage = (message = '', maxLength = 40) => {
    if (!message) return 'No messages yet';
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return '';
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - messageTime) / 60000);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  // client-side search
  const filtered = useMemo(() => {
    const q = (query || '').trim().toLowerCase();
    if (!q) return patients;
    return patients.filter(p => {
      const name = `${(p.first_name || p.firstName || '')} ${(p.last_name || p.lastName || '')}`.toLowerCase();
      const email = (p.email || '').toLowerCase();
      return name.includes(q) || email.includes(q);
    });
  }, [patients, query]);

  return (
    <Box sx={{
      width: isMobile ? '100%' : 320,
      height: '100%',
      borderRight: 'none',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(180deg, #fefefe 0%, #fafbfc 100%)',
      borderRadius: isMobile ? '12px' : '12px 0 0 12px',
      overflow: 'hidden',
      boxShadow: isMobile ? '0 2px 12px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.05)'
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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Paper>
      </Box>

      <List sx={{
        flexGrow: 1,
        overflow: 'auto',
        '&::-webkit-scrollbar': { width: '6px' },
        '&::-webkit-scrollbar-track': { background: 'rgba(62, 228, 200, 0.05)' },
        '&::-webkit-scrollbar-thumb': { background: 'rgba(62, 228, 200, 0.3)', borderRadius: '3px' }
      }}>
        {(filtered.length === 0) && (
          <Box sx={{ p: 3 }}>
            <Typography variant="body2" color="text.secondary">No patients found</Typography>
          </Box>
        )}

        {filtered.map((patient, idx) => {
          const messages = patient.messages ?? [];
          const lastMessage = messages.length ? messages[messages.length - 1] : { message: 'No messages yet', timestamp: new Date().toISOString() };
          const isSelected = selectedPatient?.id === patient.id;
          const firstName = patient.first_name ?? patient.firstName ?? '';
          const lastName = patient.last_name ?? patient.lastName ?? '';
          const unreadCount = patient.unreadCount ?? patient.unread_count ?? 0;

          return (
            <ListItem
              key={patient.id || idx}
              onClick={() => onSelectPatient && onSelectPatient(patient)}
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
                    bgcolor: getAvatarColor(String(patient.id || '')),
                    width: 45,
                    height: 45,
                    fontSize: '1.1rem',
                    fontWeight: 600
                  }}
                >
                  {getInitials(firstName, lastName)}
                </Avatar>
              </ListItemAvatar>

              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0B1929' }}>
                      {firstName} {lastName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(11, 25, 41, 0.5)', fontSize: '0.7rem' }}>
                      {getTimeAgo(lastMessage.timestamp)}
                    </Typography>
                  </Box>
                }
                secondary={
                  <>
                    <Typography component="span" variant="body2" sx={{ color: 'rgba(11, 25, 41, 0.7)', display: 'block' }}>
                      {truncateMessage(lastMessage.message)}
                    </Typography>
                    {unreadCount > 0 && (
                      <Chip
                        component="span"
                        label={unreadCount}
                        size="small"
                        sx={{
                          mt: 1,
                          height: 20,
                          backgroundColor: '#3EE4C8',
                          color: '#0B1929',
                          fontWeight: 600,
                          fontSize: '0.7rem',
                          display: 'inline-flex'
                        }}
                      />
                    )}
                  </>
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
