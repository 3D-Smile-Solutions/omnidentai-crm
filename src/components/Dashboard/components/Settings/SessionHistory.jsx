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

const SessionHistory = () => {
  const dispatch = useDispatch();
  const [expandedRow, setExpandedRow] = useState(null);
  
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
    switch (deviceType?.toLowerCase()) {
      case 'mobile':
        return <SmartphoneIcon />;
      case 'tablet':
        return <TabletIcon />;
      default:
        return <ComputerIcon />;
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
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading user data...</Typography>
      </Box>
    );
  }

  if (status === 'loading') {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading session history...</Typography>
      </Box>
    );
  }

  if (error && status === 'failed') {
    return (
      <Box sx={{ m: 2 }}>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={handleRefresh}>
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Session History
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Sessions: {sessions.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Active Sessions: {sessions.filter(s => s.is_active).length}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={status === 'loading'}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogoutAll}
            disabled={logoutStatus === 'loading' || sessions.filter(s => s.is_active).length === 0}
          >
            Logout All Devices
          </Button>
        </Box>
      </Box>

      {/* Sessions Table */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'action.hover' }}>
              <TableCell />
              <TableCell sx={{ fontWeight: 600 }}>Device</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Browser</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Login Time</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Duration</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sessions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No session history available
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              sessions.map((session) => (
                <React.Fragment key={session.id}>
                  <TableRow hover>
                    <TableCell>
                      <IconButton size="small" onClick={() => toggleRow(session.id)}>
                        {expandedRow === session.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getDeviceIcon(session.device_type)}
                        <Typography variant="body2">{session.device_type || 'Unknown'}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{session.browser || 'Unknown'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{session.ip_address || 'Unknown'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(session.login_time).toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDuration(session.login_time, session.logout_time)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={session.is_active ? 'Active' : 'Ended'}
                        color={session.is_active ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {session.is_active && (
                        <Tooltip title="End this session">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleLogoutSession(session.id)}
                            disabled={logoutStatus === 'loading'}
                          >
                            <LogoutIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>

                  {/* Expanded Row - Activities */}
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                      <Collapse in={expandedRow === session.id} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 2 }}>
                          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                            Session Activities
                          </Typography>
                          {session.activities && session.activities.length > 0 ? (
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Activity Type</TableCell>
                                  <TableCell>Details</TableCell>
                                  <TableCell>Timestamp</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {session.activities.map((activity, idx) => (
                                  <TableRow key={idx}>
                                    <TableCell>
                                      <Chip label={activity.activity_type} size="small" variant="outlined" />
                                    </TableCell>
                                    <TableCell>
                                      <Typography variant="caption">
                                        {JSON.stringify(activity.details)}
                                      </Typography>
                                    </TableCell>
                                    <TableCell>
                                      <Typography variant="caption">
                                        {new Date(activity.created_at).toLocaleString()}
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
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