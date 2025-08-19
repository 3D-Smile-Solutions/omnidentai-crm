import React, { useState } from 'react';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box,
  Alert,
  Link
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === formData.email && u.password === formData.password);

    if (user) {
      const sessionId = Date.now().toString();
      const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
      sessions.push({
        userId: user.id,
        sessionId,
        loginTime: new Date().toISOString(),
        email: user.email
      });
      localStorage.setItem('sessions', JSON.stringify(sessions));
      localStorage.setItem('currentUser', JSON.stringify({
        ...user,
        sessionId
      }));
      
      onLogin();
      navigate('/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={0} sx={{ 
          padding: 4, 
          width: '100%',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fffe 100%)',
          border: '2px solid rgba(62, 228, 200, 0.2)',
          boxShadow: '0 8px 32px rgba(11, 25, 41, 0.12)'
        }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom sx={{
            fontWeight: 700,
            color: '#0B1929',
            mb: 3
          }}>
            Sign In
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 3, 
                mb: 2,
                py: 1.5,
                background: 'linear-gradient(135deg, #3EE4C8 0%, #2BC4A8 100%)',
                color: '#0B1929',
                fontWeight: 600,
                fontSize: '1rem',
                boxShadow: '0 4px 15px rgba(62, 228, 200, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #2BC4A8 0%, #22A890 100%)',
                  boxShadow: '0 6px 20px rgba(62, 228, 200, 0.4)',
                }
              }}
            >
              Sign In
            </Button>
            <Box textAlign="center">
              <Link
                component="button"
                variant="body2"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/signup');
                }}
                sx={{
                  color: '#3EE4C8',
                  textDecoration: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    color: '#2BC4A8',
                    textDecoration: 'underline'
                  }
                }}
              >
                Don't have an account? Sign Up
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;