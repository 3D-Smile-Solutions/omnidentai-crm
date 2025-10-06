// frontend/src/components/Dashboard/components/Settings/SessionHistory.jsx
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
  Button,
  CircularProgress,
  Alert,
  Collapse,
  IconButton
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  KeyboardArrowDown as ExpandMoreIcon,
  KeyboardArrowUp as ExpandLessIcon,
  Computer as ComputerIcon,
  Smartphone as SmartphoneIcon,
  Tablet as TabletIcon
} from '@mui/icons-material';

const SessionHistory = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);

  const loadSessions = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/auth/sessions', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch sessions');
      }

      const data = await response.json();
      setSessions(data.sessions || []);
    } catch (err) {
      console.error('Error loading sessions:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getDeviceIcon = (deviceType) => {
    switch (deviceType?.toLowerCase()) {
      case 'mobile':
        return <SmartphoneIcon fontSize="small" />;
      case 'tablet':
        return <TabletIcon fontSize="small" />;
      default:
        return <ComputerIcon fontSize="small" />;
    }
  };

  const handleExpandClick = (sessionId) => {
    setExpandedRow(expandedRow === sessionId ? null : sessionId);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress sx={{ color: '#3EE4C8' }} />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Session History
        </Typography>
        <Button
          startIcon={<RefreshIcon />}
          onClick={loadSessions}
          sx={{
            borderColor: '#3EE4C8',
            color: '#0B1929',
            '&:hover': {
              borderColor: '#2BC4A8',
              backgroundColor: 'rgba(62, 228, 200, 0.05)'
            }
          }}
        >
          Refresh
        </Button>
      </Box>
      
      <Typography paragraph color="text.secondary">
        View all your login sessions and activity history
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {sessions.length === 0 ? (
        <Paper elevation={1} sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">
            No session history available
          </Typography>
        </Paper>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'rgba(62, 228, 200, 0.05)' }}>
                  <TableCell width={50}></TableCell>
                  <TableCell>Device</TableCell>
                  <TableCell>Login Time</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Activities</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>IP Address</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sessions.map((session) => (
                  <React.Fragment key={session.id}>
                    <TableRow 
                      sx={{ 
                        '&:hover': { bgcolor: 'rgba(62, 228, 200, 0.02)' },
                        bgcolor: session.is_active ? 'rgba(62, 228, 200, 0.05)' : 'inherit'
                      }}
                    >
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleExpandClick(session.id)}
                        >
                          {expandedRow === session.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getDeviceIcon(session.device_type)}
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {session.browser || 'Unknown'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {session.os || 'Unknown'} · {session.device_type || 'desktop'}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(session.session_start)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDuration(session.duration_minutes)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={`${session.activities_count} actions`}
                          size="small"
                          sx={{ bgcolor: 'rgba(62, 228, 200, 0.1)' }}
                        />
                      </TableCell>
                      <TableCell>
                        {session.is_active ? (
                          <Chip 
                            label="Active" 
                            color="success" 
                            size="small"
                            sx={{
                              bgcolor: 'rgba(62, 228, 200, 0.2)',
                              color: '#0B1929',
                              fontWeight: 600
                            }}
                          />
                        ) : (
                          <Chip 
                            label="Ended" 
                            variant="outlined" 
                            size="small" 
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                          {session.ip_address || 'N/A'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    
                    {/* Expandable Activity Details */}
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                        <Collapse in={expandedRow === session.id} timeout="auto" unmountOnExit>
                          <Box sx={{ margin: 2 }}>
                            <Typography variant="h6" gutterBottom component="div">
                              Activity Timeline
                            </Typography>
                            {session.activities && session.activities.length > 0 ? (
                              <Box sx={{ pl: 2 }}>
                                {session.activities.map((activity, idx) => (
                                  <Box 
                                    key={idx} 
                                    sx={{ 
                                      mb: 1, 
                                      pb: 1, 
                                      borderBottom: idx < session.activities.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none'
                                    }}
                                  >
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                      {activity.type}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {formatDate(activity.timestamp)}
                                    </Typography>
                                    {activity.details && Object.keys(activity.details).length > 0 && (
                                      <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: 'text.secondary' }}>
                                        {JSON.stringify(activity.details)}
                                      </Typography>
                                    )}
                                  </Box>
                                ))}
                              </Box>
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                No activities recorded
                              </Typography>
                            )}
                            
                            {/* Session Metadata */}
                            <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(62, 228, 200, 0.05)', borderRadius: 1 }}>
                              <Typography variant="subtitle2" gutterBottom>
                                Session Details
                              </Typography>
                              <Typography variant="caption" color="text.secondary" component="div">
                                Session ID: {session.id}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" component="div">
                                User Agent: {session.user_agent || 'N/A'}
                              </Typography>
                              {session.session_end && (
                                <Typography variant="caption" color="text.secondary" component="div">
                                  Ended: {formatDate(session.session_end)}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Total Sessions: {sessions.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active Sessions: {sessions.filter(s => s.is_active).length}
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
};

export default SessionHistory;