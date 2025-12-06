// src/components/Dashboard/components/Settings/SessionHistory.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Collapse,
  CircularProgress,
  Button,
  Alert,
  Tooltip
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Refresh as RefreshIcon,
  ExitToApp as LogoutIcon,
  Computer as ComputerIcon,
  Smartphone as SmartphoneIcon,
  Tablet as TabletIcon
} from '@mui/icons-material';
import {
  fetchSessionHistory,
  logoutAllDevices,
  logoutSession
} from '../../../../redux/slices/activitySlice';
import { useTheme } from '../../../../context/ThemeContext';

const SessionHistory = () => {
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const [expandedRow, setExpandedRow] = useState(null);
  
  // Theme-aware colors
  const accentColor = isDarkMode ? '#64ffda' : '#3EE4C8';
  const accentHover = isDarkMode ? '#52d4c2' : '#2BC4A8';
  const textPrimary = isDarkMode ? '#ffffff' : '#0B1929';
  const textSecondary = isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(11, 25, 41, 0.6)';
  const borderColor = isDarkMode ? 'rgba(100, 255, 218, 0.1)' : 'rgba(62, 228, 200, 0.15)';
  const paperBg = isDarkMode ? 'rgba(17, 24, 39, 0.5)' : 'rgba(255, 255, 255, 0.9)';
  const hoverBg = isDarkMode ? 'rgba(100, 255, 218, 0.05)' : 'rgba(62, 228, 200, 0.05)';
  const headerBg = isDarkMode ? 'rgba(100, 255, 218, 0.08)' : 'rgba(62, 228, 200, 0.1)';

  //  GET AUTH STATE
  const { user: currentUser } = useSelector((state) => state.auth);
  const { sessions, status, logoutStatus, error } = useSelector((state) => state.activity);

  //  FETCH ONLY WHEN USER IS AUTHENTICATED
  useEffect(() => {
    if (currentUser?.id) {
      console.log(' User authenticated, fetching session history...');
      dispatch(fetchSessionHistory());
    } else {
      console.log('⏳ Waiting for user authentication...');
    }
  }, [dispatch, currentUser?.id]);

  const handleRefresh = () => {
    if (currentUser?.id) {
      dispatch(fetchSessionHistory());
    }
  };

  const handleLogoutAll = async () => {
    if (window.confirm('Are you sure you want to logout from all devices?')) {
      await dispatch(logoutAllDevices());
      dispatch(fetchSessionHistory());
    }
  };

  const handleLogoutSession = async (sessionId) => {
    if (window.confirm('Are you sure you want to end this session?')) {
      await dispatch(logoutSession(sessionId));
      dispatch(fetchSessionHistory());
    }
  };

  const toggleRow = (sessionId) => {
    setExpandedRow(expandedRow === sessionId ? null : sessionId);
  };

  const getDeviceIcon = (deviceType) => {
    const iconSx = { color: accentColor };
    switch (deviceType?.toLowerCase()) {
      case 'mobile':
        return <SmartphoneIcon sx={iconSx} />;
      case 'tablet':
        return <TabletIcon sx={iconSx} />;
      default:
        return <ComputerIcon sx={iconSx} />;
    }
  };

  const formatDuration = (loginTime, logoutTime) => {
    if (!logoutTime) return 'Active';
    const duration = new Date(logoutTime) - new Date(loginTime);
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  //  SHOW LOADING WHILE WAITING FOR AUTH
  if (!currentUser) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress sx={{ color: accentColor }} />
        <Typography sx={{ ml: 2, color: textPrimary }}>Loading user data...</Typography>
      </Box>
    );
  }

  if (status === 'loading') {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress sx={{ color: accentColor }} />
        <Typography sx={{ ml: 2, color: textPrimary }}>Loading session history...</Typography>
      </Box>
    );
  }

  if (error && status === 'failed') {
    return (
      <Box sx={{ m: 2 }}>
        <Alert 
          severity="error"
          sx={{
            backgroundColor: isDarkMode 
              ? 'rgba(248, 113, 113, 0.1)' 
              : 'rgba(239, 68, 68, 0.1)',
            color: isDarkMode ? '#f87171' : '#dc2626',
            border: isDarkMode 
              ? '1px solid rgba(248, 113, 113, 0.2)' 
              : '1px solid rgba(239, 68, 68, 0.2)',
            '& .MuiAlert-icon': {
              color: isDarkMode ? '#f87171' : '#dc2626',
            },
          }}
          action={
            <Button 
              size="small" 
              onClick={handleRefresh}
              sx={{ 
                color: isDarkMode ? '#f87171' : '#dc2626',
                '&:hover': {
                  backgroundColor: isDarkMode 
                    ? 'rgba(248, 113, 113, 0.1)' 
                    : 'rgba(239, 68, 68, 0.1)',
                }
              }}
            >
              Retry
            </Button>
          }
        >
          Failed to load session history: {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: textPrimary }}>
            Session History
          </Typography>
          <Typography variant="body2" sx={{ color: textSecondary }}>
            Total Sessions: {sessions.length}
          </Typography>
          <Typography variant="body2" sx={{ color: textSecondary }}>
            Active Sessions: {sessions.filter(s => s.is_active).length}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={status === 'loading'}
            sx={{
              borderColor: accentColor,
              color: accentColor,
              '&:hover': {
                borderColor: accentHover,
                backgroundColor: isDarkMode 
                  ? 'rgba(100, 255, 218, 0.1)' 
                  : 'rgba(62, 228, 200, 0.1)',
              },
              '&:disabled': {
                borderColor: isDarkMode 
                  ? 'rgba(100, 255, 218, 0.3)' 
                  : 'rgba(62, 228, 200, 0.3)',
                color: isDarkMode 
                  ? 'rgba(100, 255, 218, 0.3)' 
                  : 'rgba(62, 228, 200, 0.3)',
              }
            }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<LogoutIcon />}
            onClick={handleLogoutAll}
            disabled={logoutStatus === 'loading' || sessions.filter(s => s.is_active).length === 0}
            sx={{
              backgroundColor: isDarkMode ? '#f87171' : '#dc2626',
              color: '#ffffff',
              '&:hover': {
                backgroundColor: isDarkMode ? '#ef4444' : '#b91c1c',
              },
              '&:disabled': {
                backgroundColor: isDarkMode 
                  ? 'rgba(248, 113, 113, 0.3)' 
                  : 'rgba(220, 38, 38, 0.3)',
                color: isDarkMode 
                  ? 'rgba(255, 255, 255, 0.5)' 
                  : 'rgba(255, 255, 255, 0.7)',
              }
            }}
          >
            Logout All Devices
          </Button>
        </Box>
      </Box>

      {/* Sessions Table */}
      <TableContainer 
        component={Paper} 
        elevation={0} 
        sx={{ 
          border: `1px solid ${borderColor}`,
          borderRadius: '12px',
          background: paperBg,
          backdropFilter: 'blur(20px)',
          overflow: 'hidden',
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: headerBg }}>
              <TableCell sx={{ borderBottom: `1px solid ${borderColor}` }} />
              <TableCell sx={{ fontWeight: 600, color: textPrimary, borderBottom: `1px solid ${borderColor}` }}>Device</TableCell>
              <TableCell sx={{ fontWeight: 600, color: textPrimary, borderBottom: `1px solid ${borderColor}` }}>Browser</TableCell>
              <TableCell sx={{ fontWeight: 600, color: textPrimary, borderBottom: `1px solid ${borderColor}` }}>Location</TableCell>
              <TableCell sx={{ fontWeight: 600, color: textPrimary, borderBottom: `1px solid ${borderColor}` }}>Login Time</TableCell>
              <TableCell sx={{ fontWeight: 600, color: textPrimary, borderBottom: `1px solid ${borderColor}` }}>Duration</TableCell>
              <TableCell sx={{ fontWeight: 600, color: textPrimary, borderBottom: `1px solid ${borderColor}` }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, color: textPrimary, borderBottom: `1px solid ${borderColor}` }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sessions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4, borderBottom: 'none' }}>
                  <Typography variant="body2" sx={{ color: textSecondary }}>
                    No session history available
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              sessions.map((session, index) => (
                <React.Fragment key={session.id}>
                  <TableRow 
                    sx={{ 
                      '&:hover': { backgroundColor: hoverBg },
                      '& .MuiTableCell-root': {
                        borderBottom: index === sessions.length - 1 && expandedRow !== session.id 
                          ? 'none' 
                          : `1px solid ${borderColor}`,
                      }
                    }}
                  >
                    <TableCell>
                      <IconButton 
                        size="small" 
                        onClick={() => toggleRow(session.id)}
                        sx={{ 
                          color: textSecondary,
                          '&:hover': {
                            color: accentColor,
                            backgroundColor: hoverBg,
                          }
                        }}
                      >
                        {expandedRow === session.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getDeviceIcon(session.device_type)}
                        <Typography variant="body2" sx={{ color: textPrimary }}>
                          {session.device_type || 'Unknown'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: textPrimary }}>
                        {session.browser || 'Unknown'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: textPrimary }}>
                        {session.ip_address || 'Unknown'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: textPrimary }}>
                        {new Date(session.login_time).toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: textPrimary }}>
                        {formatDuration(session.login_time, session.logout_time)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={session.is_active ? 'Active' : 'Ended'}
                        size="small"
                        sx={session.is_active ? {
                          backgroundColor: isDarkMode 
                            ? 'rgba(52, 211, 153, 0.15)' 
                            : 'rgba(76, 175, 80, 0.15)',
                          color: isDarkMode ? '#34d399' : '#388E3C',
                          border: isDarkMode 
                            ? '1px solid rgba(52, 211, 153, 0.3)' 
                            : '1px solid rgba(76, 175, 80, 0.3)',
                          fontWeight: 600,
                        } : {
                          backgroundColor: isDarkMode 
                            ? 'rgba(255, 255, 255, 0.08)' 
                            : 'rgba(0, 0, 0, 0.08)',
                          color: textSecondary,
                          border: `1px solid ${borderColor}`,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {session.is_active && (
                        <Tooltip title="End this session">
                          <IconButton
                            size="small"
                            onClick={() => handleLogoutSession(session.id)}
                            disabled={logoutStatus === 'loading'}
                            sx={{
                              color: isDarkMode ? '#f87171' : '#dc2626',
                              '&:hover': {
                                backgroundColor: isDarkMode 
                                  ? 'rgba(248, 113, 113, 0.1)' 
                                  : 'rgba(239, 68, 68, 0.1)',
                              },
                              '&:disabled': {
                                color: isDarkMode 
                                  ? 'rgba(248, 113, 113, 0.3)' 
                                  : 'rgba(220, 38, 38, 0.3)',
                              }
                            }}
                          >
                            <LogoutIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>

                  {/* Expanded Row - Activities */}
                  <TableRow>
                    <TableCell 
                      style={{ paddingBottom: 0, paddingTop: 0 }} 
                      colSpan={8}
                      sx={{ 
                        borderBottom: expandedRow === session.id && index !== sessions.length - 1
                          ? `1px solid ${borderColor}` 
                          : 'none',
                      }}
                    >
                      <Collapse in={expandedRow === session.id} timeout="auto" unmountOnExit>
                        <Box sx={{ 
                          margin: 2,
                          p: 2,
                          borderRadius: '8px',
                          backgroundColor: isDarkMode 
                            ? 'rgba(100, 255, 218, 0.03)' 
                            : 'rgba(62, 228, 200, 0.05)',
                          border: `1px solid ${borderColor}`,
                        }}>
                          <Typography 
                            variant="subtitle2" 
                            gutterBottom 
                            sx={{ 
                              fontWeight: 600, 
                              color: accentColor,
                              mb: 2
                            }}
                          >
                            Session Activities
                          </Typography>
                          {session.activities && session.activities.length > 0 ? (
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell sx={{ 
                                    color: textSecondary, 
                                    fontWeight: 600,
                                    borderBottom: `1px solid ${borderColor}`,
                                  }}>
                                    Activity Type
                                  </TableCell>
                                  <TableCell sx={{ 
                                    color: textSecondary, 
                                    fontWeight: 600,
                                    borderBottom: `1px solid ${borderColor}`,
                                  }}>
                                    Details
                                  </TableCell>
                                  <TableCell sx={{ 
                                    color: textSecondary, 
                                    fontWeight: 600,
                                    borderBottom: `1px solid ${borderColor}`,
                                  }}>
                                    Timestamp
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {session.activities.map((activity, idx) => (
                                  <TableRow 
                                    key={idx}
                                    sx={{
                                      '& .MuiTableCell-root': {
                                        borderBottom: idx === session.activities.length - 1 
                                          ? 'none' 
                                          : `1px solid ${borderColor}`,
                                      }
                                    }}
                                  >
                                    <TableCell>
                                      <Chip 
                                        label={activity.activity_type} 
                                        size="small" 
                                        variant="outlined"
                                        sx={{
                                          borderColor: accentColor,
                                          color: accentColor,
                                          backgroundColor: isDarkMode 
                                            ? 'rgba(100, 255, 218, 0.05)' 
                                            : 'rgba(62, 228, 200, 0.05)',
                                        }}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Typography variant="caption" sx={{ color: textSecondary }}>
                                        {JSON.stringify(activity.details)}
                                      </Typography>
                                    </TableCell>
                                    <TableCell>
                                      <Typography variant="caption" sx={{ color: textSecondary }}>
                                        {new Date(activity.created_at).toLocaleString()}
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          ) : (
                            <Typography variant="body2" sx={{ color: textSecondary }}>
                              No activities recorded for this session
                            </Typography>
                          )}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SessionHistory;