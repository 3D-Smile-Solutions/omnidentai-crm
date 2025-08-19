import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  IconButton,
  InputBase,
  Divider,
  Chip
} from '@mui/material';
import {
  AttachFile as AttachFileIcon,
  Send as SendIcon,
  MoreVert as MoreVertIcon,
  Phone as PhoneIcon,
  VideoCall as VideoCallIcon
} from '@mui/icons-material';
import CustomCheckbox from './CustomCheckbox';

const ChatInterface = ({ patient, onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [localSelectedChannels, setLocalSelectedChannels] = useState({
    SMS: true,
    Call: true,
    Webchat: true
  });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [patient?.messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(patient.id, message);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getAvatarColor = (id) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#F7B801', '#96CEB4', '#DDA77B', '#9B59B6', '#3498DB'];
    return colors[id % colors.length];
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const groupMessagesByDate = (messages) => {
    const groups = [];
    let currentDate = null;

    messages.forEach((msg) => {
      const msgDate = formatDate(msg.timestamp);
      if (msgDate !== currentDate) {
        currentDate = msgDate;
        groups.push({ type: 'date', date: msgDate });
      }
      groups.push({ type: 'message', ...msg });
    });

    return groups;
  };

  if (!patient) {
    return (
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fffe 100%)'
      }}>
        <Typography variant="h6" sx={{ color: 'rgba(11, 25, 41, 0.5)' }}>
          Select a patient to start messaging
        </Typography>
      </Box>
    );
  }

  const handleLocalChannelChange = (channel, checked) => {
    setLocalSelectedChannels(prev => ({
      ...prev,
      [channel]: checked
    }));
  };

  const filteredMessages = patient.messages.filter(msg => localSelectedChannels[msg.channel]);
  const groupedMessages = groupMessagesByDate(filteredMessages);

  return (
    <Box sx={{ 
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column',
      height: '100%',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fffe 100%)'
    }}>
      {/* Header */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(62, 228, 200, 0.15)',
          background: 'white'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            sx={{ 
              bgcolor: getAvatarColor(patient.id),
              width: 40,
              height: 40,
              mr: 2
            }}
          >
            {getInitials(patient.firstName, patient.lastName)}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0B1929' }}>
              {patient.firstName} {patient.lastName}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(11, 25, 41, 0.6)' }}>
              Patient ID: #{patient.id.toString().padStart(4, '0')}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton sx={{ color: 'rgba(11, 25, 41, 0.6)' }}>
            <PhoneIcon />
          </IconButton>
          <IconButton sx={{ color: 'rgba(11, 25, 41, 0.6)' }}>
            <VideoCallIcon />
          </IconButton>
          <IconButton sx={{ color: 'rgba(11, 25, 41, 0.6)' }}>
            <MoreVertIcon />
          </IconButton>
        </Box>
      </Paper>

      {/* Messages Area */}
      <Box sx={{ 
        flex: 1, 
        overflow: 'auto',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
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
        {groupedMessages.map((item, index) => {
          if (item.type === 'date') {
            return (
              <Box key={`date-${index}`} sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                my: 2 
              }}>
                <Chip 
                  label={item.date} 
                  size="small" 
                  sx={{ 
                    backgroundColor: 'rgba(62, 228, 200, 0.1)',
                    color: 'rgba(11, 25, 41, 0.7)',
                    fontSize: '0.75rem'
                  }}
                />
              </Box>
            );
          }

          const isStaff = item.sender === 'staff';
          return (
            <Box
              key={item.id}
              sx={{
                display: 'flex',
                justifyContent: isStaff ? 'flex-end' : 'flex-start',
                mb: 2
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'flex-end',
                maxWidth: '70%',
                flexDirection: isStaff ? 'row-reverse' : 'row'
              }}>
                {!isStaff && (
                  <Avatar 
                    sx={{ 
                      bgcolor: getAvatarColor(patient.id),
                      width: 32,
                      height: 32,
                      mr: 1,
                      fontSize: '0.9rem'
                    }}
                  >
                    {getInitials(patient.firstName, patient.lastName)}
                  </Avatar>
                )}
                <Box>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.5,
                      backgroundColor: isStaff ? '#3EE4C8' : 'white',
                      color: isStaff ? '#0B1929' : '#0B1929',
                      border: isStaff ? 'none' : '1px solid rgba(62, 228, 200, 0.2)',
                      borderRadius: 2,
                      borderTopLeftRadius: isStaff ? 16 : 4,
                      borderTopRightRadius: isStaff ? 4 : 16,
                    }}
                  >
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {item.message}
                    </Typography>
                  </Paper>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: isStaff ? 'flex-end' : 'flex-start',
                    gap: 1,
                    mt: 0.5,
                    px: 0.5
                  }}>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: 'rgba(11, 25, 41, 0.5)',
                        fontSize: '0.7rem',
                      }}
                    >
                      {formatTime(item.timestamp)}
                    </Typography>
                    <Chip 
                      label={item.channel} 
                      size="small" 
                      sx={{ 
                        height: 16,
                        fontSize: '0.65rem',
                        backgroundColor: item.channel === 'SMS' ? 'rgba(46, 125, 50, 0.1)' : 
                                        item.channel === 'Call' ? 'rgba(33, 150, 243, 0.1)' : 
                                        'rgba(156, 39, 176, 0.1)',
                        color: item.channel === 'SMS' ? '#2E7D32' : 
                               item.channel === 'Call' ? '#1976D2' : 
                               '#7B1FA2',
                        '& .MuiChip-label': {
                          px: 0.5
                        }
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          );
        })}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          borderTop: '1px solid rgba(62, 228, 200, 0.15)',
          background: 'white'
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          gap: 1.5, 
          mb: 1.5,
          alignItems: 'center'
        }}>
          <Typography variant="caption" sx={{ color: 'rgba(11, 25, 41, 0.6)', fontWeight: 600 }}>
            Filter by:
          </Typography>
          <CustomCheckbox 
            checked={localSelectedChannels.SMS}
            onChange={(e) => handleLocalChannelChange('SMS', e.target.checked)}
            label="SMS"
          />
          <CustomCheckbox 
            checked={localSelectedChannels.Call}
            onChange={(e) => handleLocalChannelChange('Call', e.target.checked)}
            label="Call"
          />
          <CustomCheckbox 
            checked={localSelectedChannels.Webchat}
            onChange={(e) => handleLocalChannelChange('Webchat', e.target.checked)}
            label="Webchat"
          />
        </Box>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'flex-end',
          gap: 1,
          p: 1,
          border: '1px solid rgba(62, 228, 200, 0.2)',
          borderRadius: 2,
          backgroundColor: 'rgba(62, 228, 200, 0.03)'
        }}>
          <IconButton 
            sx={{ 
              color: 'rgba(11, 25, 41, 0.6)',
              '&:hover': {
                color: '#3EE4C8'
              }
            }}
            aria-label="attach file"
          >
            <AttachFileIcon />
          </IconButton>
          <InputBase
            sx={{ 
              flex: 1,
              color: '#0B1929',
              '& ::placeholder': {
                color: 'rgba(11, 25, 41, 0.5)'
              }
            }}
            placeholder="Type a message..."
            multiline
            maxRows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <IconButton 
            onClick={handleSendMessage}
            disabled={!message.trim()}
            sx={{ 
              color: message.trim() ? '#3EE4C8' : 'rgba(11, 25, 41, 0.3)',
              '&:hover': {
                color: message.trim() ? '#2BC4A8' : 'rgba(11, 25, 41, 0.3)'
              },
              '&.Mui-disabled': {
                color: 'rgba(11, 25, 41, 0.3)'
              }
            }}
            aria-label="send message"
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
};

export default ChatInterface;