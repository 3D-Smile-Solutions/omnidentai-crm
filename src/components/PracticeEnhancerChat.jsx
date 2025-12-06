import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Box, Paper, Typography, TextField, IconButton, useMediaQuery, Chip } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { useTheme } from '../context/ThemeContext';

// Static data outside component to prevent recreation
const EXAMPLE_PROMPTS = [
  "Implant patients this month?",
  "New vs returning patients?",
  "Insurance denial rates?",
  "Patient retention strategies",
  "Best marketing ROI?"
];

const INITIAL_MESSAGE = {
  id: 1,
  text: "Hello! I'm your Practice Enhancement AI assistant. I can help you with insights, recommendations, and strategies to grow your practice. What would you like to know?",
  sender: 'ai',
  time: new Date().toISOString()
};

// AI Response logic outside component
const getAIResponse = (input) => {
  const lower = input.toLowerCase();
  if (lower.includes('revenue') || lower.includes('money')) {
    return "Your revenue is up 12% this quarter. Highest revenue: crowns ($1,200 avg) and root canals ($950 avg). Would you like specific strategies?";
  }
  if (lower.includes('patient') || lower.includes('retention')) {
    return "Patient retention rate: 78% (above average). 22% haven't returned in 6+ months. I recommend automated recall and personalized follow-ups.";
  }
  if (lower.includes('appointment') || lower.includes('schedule')) {
    return "Appointment utilization: 85%. Peak hours: Tue-Thu 10am-2pm. Consider promotions for Monday/Friday openings.";
  }
  if (lower.includes('insurance')) {
    return "Delta Dental: 35% of claims, 92% approval. Aetna/Cigna: 78% approval. Review coding practices for lower performers.";
  }
  if (lower.includes('marketing') || lower.includes('new patients')) {
    return "28 new patients/month. Sources: existing patients (45%), Google (30%). Reviews: 4.7 stars. Focus on Google Ads and referral incentives.";
  }
  return "I can help with revenue, retention, scheduling, insurance, and marketing. What would you like to improve?";
};

const formatTime = (timeString) => 
  new Date(timeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

// Memoized Message Component
const Message = React.memo(({ message, isMobile, colors }) => {
  const isUser = message.sender === 'user';
  
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: isUser ? 'row-reverse' : 'row',
      alignItems: 'flex-start',
      gap: 1,
    }}>
      {/* Avatar */}
      <Box sx={{
        width: isMobile ? 28 : 32,
        height: isMobile ? 28 : 32,
        borderRadius: '8px',
        bgcolor: isUser ? colors.userAvatarBg : colors.aiAvatarBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        border: `1px solid ${isUser ? colors.userBorder : colors.aiBorder}`,
      }}>
        {isUser ? (
          <PersonOutlineIcon sx={{ fontSize: isMobile ? 16 : 18, color: colors.accent }} />
        ) : (
          <SmartToyOutlinedIcon sx={{ fontSize: isMobile ? 16 : 18, color: colors.textSecondary }} />
        )}
      </Box>

      {/* Bubble */}
      <Box sx={{ maxWidth: isMobile ? '80%' : '70%' }}>
        <Paper
          elevation={0}
          sx={{
            p: isMobile ? 1.5 : 2,
            bgcolor: isUser ? colors.userMsgBg : colors.aiMsgBg,
            border: `1px solid ${isUser ? colors.userBorder : colors.aiBorder}`,
            borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
          }}
        >
          <Typography sx={{ 
            color: colors.textPrimary,
            fontSize: isMobile ? '0.85rem' : '0.9rem',
            lineHeight: 1.6,
          }}>
            {message.text}
          </Typography>
        </Paper>
        <Typography sx={{ 
          mt: 0.5,
          px: 0.5,
          color: colors.textSecondary,
          fontSize: '0.65rem',
          textAlign: isUser ? 'right' : 'left',
        }}>
          {formatTime(message.time)}
        </Typography>
      </Box>
    </Box>
  );
});

Message.displayName = 'Message';

const PracticeEnhancerChat = ({ isMobile: isMobileProp }) => {
  const { isDarkMode } = useTheme();
  const isMobileQuery = useMediaQuery('(max-width:1000px)');
  const isMobile = isMobileProp ?? isMobileQuery;
  const messagesEndRef = useRef(null);
  
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');

  // Memoized colors object
  const colors = useMemo(() => ({
    accent: isDarkMode ? '#64ffda' : '#3EE4C8',
    accentHover: isDarkMode ? '#52d4c2' : '#2BC4A8',
    textPrimary: isDarkMode ? '#fff' : '#0B1929',
    textSecondary: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(11,25,41,0.6)',
    border: isDarkMode ? 'rgba(100,255,218,0.15)' : 'rgba(62,228,200,0.2)',
    userMsgBg: isDarkMode ? 'rgba(100,255,218,0.15)' : 'rgba(62,228,200,0.12)',
    userBorder: isDarkMode ? 'rgba(100,255,218,0.3)' : 'rgba(62,228,200,0.3)',
    userAvatarBg: isDarkMode ? 'rgba(100,255,218,0.15)' : 'rgba(62,228,200,0.15)',
    aiMsgBg: isDarkMode ? 'rgba(17,24,39,0.6)' : 'rgba(255,255,255,0.9)',
    aiBorder: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
    aiAvatarBg: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(11,25,41,0.08)',
    containerBg: isDarkMode ? 'rgba(17,24,39,0.4)' : 'rgba(255,255,255,0.7)',
    inputBg: isDarkMode ? 'rgba(17,24,39,0.6)' : 'rgba(255,255,255,0.95)',
    headerBg: isDarkMode ? 'rgba(100,255,218,0.03)' : 'rgba(62,228,200,0.05)',
  }), [isDarkMode]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Memoized handlers
  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg = { id: Date.now(), text: trimmed, sender: 'user', time: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const aiMsg = { id: Date.now() + 1, text: getAIResponse(trimmed), sender: 'ai', time: new Date().toISOString() };
      setMessages(prev => [...prev, aiMsg]);
    }, 800);
  }, [input]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) handleSend();
  }, [handleSend]);

  const handleInputChange = useCallback((e) => setInput(e.target.value), []);
  
  const handlePromptClick = useCallback((prompt) => setInput(prompt), []);

  const hasInput = input.trim().length > 0;
  const spacing = isMobile ? 1.5 : 2;

  return (
    <Box sx={{ 
      height: isMobile ? 'calc(100vh - 180px)' : 'calc(100vh - 220px)',
      minHeight: 400,
      display: 'flex',
      flexDirection: 'column',
      bgcolor: colors.containerBg,
      backdropFilter: 'blur(20px)',
      borderRadius: isMobile ? '12px' : '16px',
      border: `1px solid ${colors.border}`,
      overflow: 'hidden',
    }}>
      
      {/* Header */}
      <Box sx={{
        p: spacing,
        borderBottom: `1px solid ${colors.border}`,
        bgcolor: colors.headerBg,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
      }}>
        <Box sx={{
          width: 36,
          height: 36,
          borderRadius: '10px',
          bgcolor: colors.userAvatarBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `1px solid ${colors.userBorder}`,
        }}>
          <AutoAwesomeIcon sx={{ color: colors.accent, fontSize: 20 }} />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 600, color: colors.textPrimary, fontSize: '1rem' }}>
            Practice AI Assistant
          </Typography>
          <Typography sx={{ color: colors.textSecondary, fontSize: '0.7rem' }}>
            Powered by OmniDent AI
          </Typography>
        </Box>
      </Box>

      {/* Messages */}
      <Box sx={{ 
        flex: 1,
        overflowY: 'auto',
        p: spacing,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
      }}>
        {messages.map((msg) => (
          <Message key={msg.id} message={msg} isMobile={isMobile} colors={colors} />
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* Prompts */}
      <Box sx={{ 
        px: spacing,
        py: 1,
        borderTop: `1px solid ${colors.border}`,
        bgcolor: colors.headerBg,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75 }}>
          <AutoAwesomeIcon sx={{ color: colors.accent, fontSize: 14 }} />
          <Typography sx={{ color: colors.textSecondary, fontWeight: 500, fontSize: '0.7rem' }}>
            Quick prompts:
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {EXAMPLE_PROMPTS.map((prompt) => (
            <Chip
              key={prompt}
              label={prompt}
              onClick={() => handlePromptClick(prompt)}
              size="small"
              sx={{
                bgcolor: colors.aiAvatarBg,
                border: `1px solid ${colors.border}`,
                color: colors.textPrimary,
                fontSize: '0.65rem',
                height: 24,
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: colors.userMsgBg,
                  borderColor: colors.accent,
                },
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Input */}
      <Box sx={{ p: spacing, borderTop: `1px solid ${colors.border}`, bgcolor: colors.inputBg }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            fullWidth
            placeholder="Ask about your practice..."
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                fontSize: '0.875rem',
                bgcolor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                '& fieldset': { borderColor: colors.border },
                '&:hover fieldset': { borderColor: colors.accent },
                '&.Mui-focused fieldset': { borderColor: colors.accent, borderWidth: 1 },
              },
              '& .MuiOutlinedInput-input': {
                color: colors.textPrimary,
                '&::placeholder': { color: colors.textSecondary, opacity: 1 },
              },
            }}
          />
          <IconButton 
            onClick={handleSend}
            disabled={!hasInput}
            sx={{ 
              bgcolor: hasInput ? colors.accent : colors.aiAvatarBg,
              color: hasInput ? '#0B1929' : colors.textSecondary,
              width: 40,
              height: 40,
              borderRadius: '12px',
              '&:hover': { bgcolor: hasInput ? colors.accentHover : colors.userMsgBg },
              '&.Mui-disabled': { bgcolor: colors.aiAvatarBg, color: colors.textSecondary },
            }}
          >
            <SendIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default React.memo(PracticeEnhancerChat);