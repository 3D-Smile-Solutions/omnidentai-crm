import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, IconButton, useMediaQuery, Chip, Fade } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const PracticeEnhancerChat = ({ isMobile: isMobileProp }) => {
  const isMobileQuery = useMediaQuery('(max-width:1000px)');
  const isMobile = isMobileProp !== undefined ? isMobileProp : isMobileQuery;
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your Practice Enhancement AI assistant. I have access to all your practice data and can help you with insights, recommendations, and strategies to grow your practice. What would you like to know?",
      sender: 'ai',
      time: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');

  const examplePrompts = [
    "How many implant patients did we have this month?",
    "What's our production split: new vs returning patients?",
    "Which insurance has the highest denial rates?",
    "Show me patient retention rate and strategies",
    "What marketing channel brings best ROI?"
  ];

  const handleSend = () => {
    if (input.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: input,
        sender: 'user',
        time: new Date().toISOString()
      };
      setMessages([...messages, newMessage]);
      
      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: messages.length + 2,
          text: getAIResponse(input),
          sender: 'ai',
          time: new Date().toISOString()
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
      
      setInput('');
    }
  };

  const handleExampleClick = (example) => {
    setInput(example);
  };

  const getAIResponse = (input) => {
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('revenue') || lowerInput.includes('money')) {
      return "Based on your practice data, your revenue is up 12% this quarter. Your highest revenue procedures are crowns ($1,200 avg) and root canals ($950 avg). Consider promoting these services more. Would you like specific strategies to increase revenue?";
    } else if (lowerInput.includes('patient') || lowerInput.includes('retention')) {
      return "Your patient retention rate is 78%, which is above industry average. However, I notice 22% of patients haven't returned in 6+ months. I recommend implementing an automated recall system and personalized follow-ups. Shall I create a retention campaign for you?";
    } else if (lowerInput.includes('appointment') || lowerInput.includes('schedule')) {
      return "Your appointment utilization is at 85% capacity. Peak hours are Tuesday-Thursday 10am-2pm. You have openings on Mondays and Fridays that could be filled. Consider offering promotions for these slower periods. Want me to analyze your scheduling patterns further?";
    } else if (lowerInput.includes('insurance')) {
      return "Delta Dental represents 35% of your claims with a 92% approval rate. Aetna and Cigna have lower approval rates at 78%. I suggest reviewing your coding practices for these providers. Would you like a detailed insurance performance report?";
    } else if (lowerInput.includes('marketing') || lowerInput.includes('new patients')) {
      return "You're averaging 28 new patients per month. Most referrals come from existing patients (45%) and Google (30%). Your online reviews average 4.7 stars. I recommend focusing on Google Ads and patient referral incentives. Want help creating a marketing campaign?";
    } else {
      return "I can help you with revenue optimization, patient retention, appointment scheduling, insurance analysis, marketing strategies, and much more. What specific aspect of your practice would you like to improve?";
    }
  };

  return (
    <Box sx={{ 
      height: isMobile ? 'calc(100vh - 200px)' : 'calc(100vh - 250px)',
      width: isMobile ? '100%' : '100%',
      maxWidth: isMobile ? '100%' : '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fffe 100%)',
      borderRadius: isMobile ? 1 : 2,
      border: '1px solid rgba(62, 228, 200, 0.2)',
      overflow: 'hidden',
      mx: 'auto'
    }}>
      {/* Chat Messages */}
      <Box sx={{ 
        flex: 1,
        overflowY: 'auto',
        p: isMobile ? 2 : 3,
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? 1.5 : 2
      }}>
        {messages.map((message) => (
          <Box
            key={message.id}
            sx={{
              display: 'flex',
              justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: isMobile ? 1.5 : 2,
                maxWidth: isMobile ? '85%' : '70%',
                backgroundColor: message.sender === 'user' ? '#0B1929' : '#ffffff',
                color: message.sender === 'user' ? '#ffffff' : '#0B1929',
                border: message.sender === 'user' ? 'none' : '1px solid rgba(62, 228, 200, 0.3)',
                borderRadius: message.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px'
              }}
            >
              <Typography variant="body2" sx={{ fontSize: isMobile ? '0.875rem' : '1rem' }}>
                {message.text}
              </Typography>
              <Typography variant="caption" sx={{ 
                display: 'block', 
                mt: 0.5, 
                opacity: 0.7,
                fontSize: isMobile ? '0.7rem' : '0.75rem'
              }}>
                {new Date(message.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Typography>
            </Paper>
          </Box>
        ))}
      </Box>

      {/* Example Prompts */}
      <Box sx={{ 
            p: isMobile ? 1.5 : 2,
            borderTop: '1px solid rgba(62, 228, 200, 0.2)',
            backgroundColor: 'rgba(62, 228, 200, 0.03)'
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              mb: 1.5 
            }}>
              <AutoAwesomeIcon sx={{ 
                color: '#3EE4C8', 
                fontSize: isMobile ? 18 : 20 
              }} />
              <Typography variant="caption" sx={{ 
                color: 'rgba(11, 25, 41, 0.7)', 
                fontWeight: 600,
                fontSize: isMobile ? '0.75rem' : '0.85rem'
              }}>
                Try asking me:
              </Typography>
            </Box>
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: isMobile ? 0.5 : 1 
            }}>
              {examplePrompts.map((prompt, index) => (
                <Chip
                  key={index}
                  label={prompt}
                  onClick={() => handleExampleClick(prompt)}
                  sx={{
                    backgroundColor: 'white',
                    border: '1px solid rgba(62, 228, 200, 0.3)',
                    color: '#0B1929',
                    fontSize: isMobile ? '0.7rem' : '0.75rem',
                    height: isMobile ? 26 : 28,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(62, 228, 200, 0.1)',
                      borderColor: '#3EE4C8',
                      transform: 'translateY(-1px)'
                    },
                    '& .MuiChip-label': {
                      px: isMobile ? 1 : 1.5
                    }
                  }}
                />
              ))}
            </Box>
          </Box>

      {/* Input Area */}
      <Box sx={{ 
        p: isMobile ? 1.5 : 2, 
        borderTop: '1px solid rgba(62, 228, 200, 0.2)',
        backgroundColor: '#ffffff'
      }}>
        <Box sx={{ display: 'flex', gap: isMobile ? 0.5 : 1, alignItems: 'center' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder={isMobile ? "Ask about your practice..." : "Ask about your practice performance, strategies, or insights..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            size={isMobile ? "small" : "medium"}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
                fontSize: isMobile ? '0.875rem' : '1rem',
                '& fieldset': {
                  borderColor: 'rgba(62, 228, 200, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: '#3EE4C8',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#3EE4C8',
                }
              }
            }}
          />
          <IconButton 
            onClick={handleSend}
            size={isMobile ? "small" : "large"}
            sx={{ 
              backgroundColor: '#3EE4C8',
              color: 'white',
              padding: isMobile ? 1 : 1.5,
              '&:hover': { 
                backgroundColor: '#35ccb3' 
              }
            }}
          >
            <SendIcon sx={{ fontSize: isMobile ? 20 : 24 }} />
          </IconButton>
        </Box>
        <Typography variant="caption" sx={{ 
          display: 'block', 
          mt: isMobile ? 0.5 : 1, 
          color: 'text.secondary', 
          textAlign: 'center',
          fontSize: isMobile ? '0.65rem' : '0.75rem'
        }}>
          Powered by OmniDent AI • Your practice insights at your fingertips
        </Typography>
      </Box>
    </Box>
  );
};

export default PracticeEnhancerChat;