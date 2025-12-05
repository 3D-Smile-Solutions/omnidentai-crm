// frontend/src/components/Dashboard/TypingIndicator.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';

const TypingIndicator = ({ patientId }) => {
  const { isDarkMode } = useTheme();
  const typingUsers = useSelector((state) => state.typing?.typingUsers?.[patientId] || {});
  const currentUser = useSelector((state) => state.auth?.user);
  
  // Filter out current user and get array of typing users
  const otherUsersTyping = Object.entries(typingUsers)
    .filter(([userId]) => userId !== currentUser?.id)
    .map(([userId, data]) => data);
  
  if (otherUsersTyping.length === 0) {
    return null;
  }
  
  // Get user names
  const names = otherUsersTyping.map(user => {
    const email = user.userEmail || '';
    return email.split('@')[0]; // Get name before @
  });
  
  let typingText;
  if (names.length === 1) {
    typingText = `${names[0]} is typing`;
  } else if (names.length === 2) {
    typingText = `${names[0]} and ${names[1]} are typing`;
  } else {
    typingText = `${names[0]} and ${names.length - 1} others are typing`;
  }
  
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 2,
        py: 1,
        backgroundColor: isDarkMode 
          ? 'rgba(100, 255, 218, 0.08)' 
          : 'rgba(62, 228, 200, 0.1)',
        borderRadius: 1,
        border: isDarkMode 
          ? '1px solid rgba(100, 255, 218, 0.1)' 
          : '1px solid rgba(62, 228, 200, 0.15)',
      }}
    >
      <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        {/* Animated dots */}
        <Box
          sx={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: isDarkMode ? '#64ffda' : '#3EE4C8',
            animation: 'typing 1.4s infinite',
            '@keyframes typing': {
              '0%, 60%, 100%': { transform: 'scale(0.8)', opacity: 0.5 },
              '30%': { transform: 'scale(1)', opacity: 1 }
            }
          }}
        />
        <Box
          sx={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: isDarkMode ? '#64ffda' : '#3EE4C8',
            animation: 'typing 1.4s infinite 0.2s',
            '@keyframes typing': {
              '0%, 60%, 100%': { transform: 'scale(0.8)', opacity: 0.5 },
              '30%': { transform: 'scale(1)', opacity: 1 }
            }
          }}
        />
        <Box
          sx={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: isDarkMode ? '#64ffda' : '#3EE4C8',
            animation: 'typing 1.4s infinite 0.4s',
            '@keyframes typing': {
              '0%, 60%, 100%': { transform: 'scale(0.8)', opacity: 0.5 },
              '30%': { transform: 'scale(1)', opacity: 1 }
            }
          }}
        />
      </Box>
      <Typography 
        variant="caption" 
        sx={{ 
          color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(11, 25, 41, 0.7)', 
          fontStyle: 'italic' 
        }}
      >
        {typingText}...
      </Typography>
    </Box>
  );
};

export default TypingIndicator;