import React, { useState, useEffect } from 'react';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  Button
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

const SessionHistory = () => {
  const [sessions, setSessions] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  const loadSessions = () => {
    const allSessions = JSON.parse(localStorage.getItem('sessions') || '[]');
    const userSessions = allSessions.filter(s => s.userId === currentUser.id);
    setSessions(userSessions.sort((a, b) => new Date(b.loginTime) - new Date(a.loginTime)));
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const isCurrentSession = (sessionId) => {
    return currentUser.sessionId === sessionId;
  };

  const clearHistory = () => {
    const allSessions = JSON.parse(localStorage.getItem('sessions') || '[]');
    const otherUserSessions = allSessions.filter(s => s.userId !== currentUser.id);
    const currentSession = allSessions.find(s => s.sessionId === currentUser.sessionId);
    const updatedSessions = currentSession 
      ? [...otherUserSessions, currentSession]
      : otherUserSessions;
    localStorage.setItem('sessions', JSON.stringify(updatedSessions));
    loadSessions();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Session History
        </Typography>
        <Box>
          <Button
            startIcon={<RefreshIcon />}
            onClick={loadSessions}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={clearHistory}
            disabled={sessions.length <= 1}
          >
            Clear History
          </Button>
        </Box>
      </Box>
      
      <Typography paragraph color="text.secondary">
        View all your login sessions and activity history.
      </Typography>

      {sessions.length === 0 ? (
        <Paper elevation={1} sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">
            No session history available
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Session ID</TableCell>
                <TableCell>Login Time</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sessions.map((session) => (
                <TableRow 
                  key={session.sessionId}
                  sx={{ 
                    backgroundColor: isCurrentSession(session.sessionId) ? 'action.hover' : 'inherit'
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {session.sessionId.slice(-8)}
                    </Typography>
                  </TableCell>
                  <TableCell>{formatDate(session.loginTime)}</TableCell>
                  <TableCell>{session.email}</TableCell>
                  <TableCell>
                    {isCurrentSession(session.sessionId) ? (
                      <Chip label="Current Session" color="success" size="small" />
                    ) : (
                      <Chip label="Past Session" variant="outlined" size="small" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Total Sessions: {sessions.length}
        </Typography>
      </Box>
    </Box>
  );
};

export default SessionHistory;