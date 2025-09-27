import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  IconButton,
  InputBase,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  AttachFile as AttachFileIcon,
  Send as SendIcon,
  MoreVert as MoreVertIcon,
  Phone as PhoneIcon,
  VideoCall as VideoCallIcon,
  ChatBubbleOutline as ChatBubbleOutlineIcon
} from '@mui/icons-material';
import CustomCheckbox from './CustomCheckbox';

const ChatInterface = ({ patient, onSendMessage, isMobile }) => {
  const [message, setMessage] = useState('');
  const [localSelectedChannels, setLocalSelectedChannels] = useState({
    sms: true,
    call: true,
    webchat: true
  });
  const messagesEndRef = useRef(null);
  
  // Get messages from Redux store
  const { 
    currentMessages, 
    fetchStatus, 
    sendStatus, 
    error 
  } = useSelector((state) => state.messages);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(patient.id, message, 'webchat');
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

  // Helper function to safely render error
  const renderError = (error) => {
    if (typeof error === 'string') return error;
    if (error && typeof error === 'object') {
      return error.message || error.error || JSON.stringify(error);
    }
    return 'An error occurred';
  };

  if (!patient) {
    return (
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #fafbfc 0%, #f0f7f5 100%)',
        borderRadius: isMobile ? '12px' : '0 12px 12px 0',
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
        minHeight: '100%',
        boxShadow: isMobile ? '0 2px 12px rgba(0,0,0,0.08)' : 'none'
      }}>
        <Box sx={{ 
          textAlign: 'center',
          zIndex: 1,
          p: 4
        }}>
          <Box sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: 'rgba(62, 228, 200, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <ChatBubbleOutlineIcon sx={{ 
              fontSize: 40, 
              color: '#3EE4C8',
              opacity: 0.9
            }} />
          </Box>
          
          <Typography 
            variant="h5" 
            sx={{ 
              color: 'rgba(11, 25, 41, 0.4)',
              fontWeight: 600,
              mb: 1,
              letterSpacing: '-0.02em'
            }}
          >
            No Conversation Selected
          </Typography>
          
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'rgba(11, 25, 41, 0.35)',
              maxWidth: 300,
              margin: '0 auto',
              lineHeight: 1.6
            }}
          >
            Choose a patient from the list to view and manage their conversations across all channels
          </Typography>
        </Box>
      </Box>
    );
  }

  const handleLocalChannelChange = (channel, checked) => {
    setLocalSelectedChannels(prev => ({
      ...prev,
      [channel]: checked
    }));
  };

  // FIXED: Safe handling of currentMessages
  const safeCurrentMessages = Array.isArray(currentMessages) ? currentMessages : [];
  const filteredMessages = safeCurrentMessages.filter(msg => localSelectedChannels[msg.channel]);
  const groupedMessages = groupMessagesByDate(filteredMessages);

  return (
    <Box sx={{ 
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column',
      height: '100%',
      minHeight: isMobile ? 'calc(100vh - 200px)' : '100%',
      background: 'linear-gradient(135deg, #fafbfc 0%, #f0f7f5 100%)',
      borderRadius: isMobile ? '12px' : '0 12px 12px 0',
      overflow: 'hidden',
      boxShadow: isMobile ? '0 2px 12px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.05)'
    }}>
      {/* Header */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: isMobile ? 1.5 : 2, 
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
              width: isMobile ? 36 : 40,
              height: isMobile ? 36 : 40,
              mr: isMobile ? 1.5 : 2,
              fontSize: isMobile ? '0.9rem' : '1rem'
            }}
          >
            {getInitials(patient.firstName, patient.lastName)}
          </Avatar>
          <Box>
            <Typography variant={isMobile ? "body2" : "subtitle1"} sx={{ fontWeight: 600, color: '#0B1929' }}>
              {patient.firstName} {patient.lastName}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(11, 25, 41, 0.6)', fontSize: isMobile ? '0.7rem' : '0.75rem' }}>
              Patient ID: #{patient.id.toString().padStart(4, '0')}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: isMobile ? 0 : 1 }}>
          {!isMobile && (
            <>
              <IconButton sx={{ color: 'rgba(11, 25, 41, 0.6)' }}>
                <PhoneIcon />
              </IconButton>
              <IconButton sx={{ color: 'rgba(11, 25, 41, 0.6)' }}>
                <VideoCallIcon />
              </IconButton>
            </>
          )}
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
        {/* Loading state */}
        {fetchStatus === 'loading' && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            flex: 1
          }}>
            <CircularProgress sx={{ color: '#3EE4C8' }} />
          </Box>
        )}

        {/* Error state - FIXED */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {renderError(error)}
          </Alert>
        )}

        {/* Messages */}
        {fetchStatus !== 'loading' && groupedMessages.map((item, index) => {
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

          const isStaff = item.sender === 'dentist';
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
                        backgroundColor: item.channel === 'sms' ? 'rgba(46, 125, 50, 0.1)' : 
                                        item.channel === 'call' ? 'rgba(33, 150, 243, 0.1)' : 
                                        'rgba(156, 39, 176, 0.1)',
                        color: item.channel === 'sms' ? '#2E7D32' : 
                               item.channel === 'call' ? '#1976D2' : 
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
          p: isMobile ? 1.5 : 2, 
          borderTop: '1px solid rgba(62, 228, 200, 0.15)',
          background: 'white'
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          gap: isMobile ? 0.75 : 1.5, 
          mb: isMobile ? 0.75 : 1.5,
          alignItems: 'center',
          flexWrap: isMobile ? 'wrap' : 'nowrap'
        }}>
          <Typography variant="caption" sx={{ 
            color: 'rgba(11, 25, 41, 0.6)', 
            fontWeight: 600,
            fontSize: isMobile ? '0.65rem' : '0.75rem'
          }}>
            Filter:
          </Typography>
          <CustomCheckbox 
            checked={localSelectedChannels.sms}
            onChange={(e) => handleLocalChannelChange('sms', e.target.checked)}
            label="SMS"
          />
          <CustomCheckbox 
            checked={localSelectedChannels.call}
            onChange={(e) => handleLocalChannelChange('call', e.target.checked)}
            label="Call"
          />
          <CustomCheckbox 
            checked={localSelectedChannels.webchat}
            onChange={(e) => handleLocalChannelChange('webchat', e.target.checked)}
            label="Webchat"
          />
        </Box>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'flex-end',
          gap: isMobile ? 0.5 : 1,
          p: isMobile ? 0.75 : 1,
          border: '1px solid rgba(62, 228, 200, 0.2)',
          borderRadius: 2,
          backgroundColor: 'rgba(62, 228, 200, 0.03)'
        }}>
          <IconButton 
            size={isMobile ? "small" : "medium"}
            sx={{ 
              color: 'rgba(11, 25, 41, 0.6)',
              '&:hover': {
                color: '#3EE4C8'
              }
            }}
            aria-label="attach file"
          >
            <AttachFileIcon fontSize={isMobile ? "small" : "medium"} />
          </IconButton>
          <InputBase
            sx={{ 
              flex: 1,
              color: '#0B1929',
              fontSize: isMobile ? '0.875rem' : '1rem',
              '& ::placeholder': {
                color: 'rgba(11, 25, 41, 0.5)',
                fontSize: isMobile ? '0.875rem' : '1rem'
              }
            }}
            placeholder="Type a message..."
            multiline
            maxRows={isMobile ? 3 : 4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={sendStatus === 'loading'}
          />
          <IconButton 
            size={isMobile ? "small" : "medium"}
            onClick={handleSendMessage}
            disabled={!message.trim() || sendStatus === 'loading'}
            sx={{ 
              color: message.trim() && sendStatus !== 'loading' ? '#3EE4C8' : 'rgba(11, 25, 41, 0.3)',
              '&:hover': {
                color: message.trim() && sendStatus !== 'loading' ? '#2BC4A8' : 'rgba(11, 25, 41, 0.3)'
              },
              '&.Mui-disabled': {
                color: 'rgba(11, 25, 41, 0.3)'
              }
            }}
            aria-label="send message"
          >
            {sendStatus === 'loading' ? (
              <CircularProgress size={20} sx={{ color: '#3EE4C8' }} />
            ) : (
              <SendIcon fontSize={isMobile ? "small" : "medium"} />
            )}
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
};

export default ChatInterface;