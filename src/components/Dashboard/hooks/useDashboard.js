// src/components/Dashboard/hooks/useDashboard.js
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { logout } from "../../../redux/slices/authSlice";
import { fetchPatients } from "../../../redux/slices/patientSlice";
import { useActivityLogger } from '../../Dashboard/hooks/useActivityLogger'; //  FIXED IMPORT
import { setCurrentSession } from '../../../redux/slices/activitySlice'; //  NEW

import { 
  fetchUnreadCounts, 
  setCurrentPatient, 
  clearCurrentPatient,
  sendMessage,
  fetchMessagesWithPatient,
  markMessagesAsRead,
  addMessage
} from "../../../redux/slices/messageSlice";
import useWebSocket from '../../../components/Dashboard/hooks/useWebSocket';

export const useDashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  //  PROPERLY USE ACTIVITY LOGGER
  const { logActivity } = useActivityLogger();

  // Initialize WebSocket hook
  const {
    isConnected: isWebSocketConnected,
    joinPatientConversation,
    leavePatientConversation,
    sendMessageViaWebSocket,
    startTyping,
    stopTyping,
    markMessagesAsRead: markMessagesAsReadWS,
    disconnect
  } = useWebSocket();

  // Get data from Redux store
  const { user: currentUser } = useSelector((state) => state.auth);
  const { list: patients, status: patientsStatus } = useSelector((state) => state.patients);
  const { 
    messagesByPatient, 
    currentMessages, 
    unreadCounts,
    fetchStatus: messagesFetchStatus,
    sendStatus: messageSendStatus 
  } = useSelector((state) => state.messages);
  
  //  SET SESSION ID ON LOGIN
  useEffect(() => {
    if (currentUser?.sessionId) {
      dispatch(setCurrentSession(currentUser.sessionId));
    }
  }, [dispatch, currentUser?.sessionId]);

  // Fetch patients and unread counts when component mounts
  useEffect(() => {
    if (currentUser?.id) {
      dispatch(fetchPatients());
      dispatch(fetchUnreadCounts());
    }
  }, [dispatch, currentUser?.id]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1000);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Join/leave patient conversation rooms when patient selection changes
  useEffect(() => {
    if (selectedPatient?.id && isWebSocketConnected) {
      joinPatientConversation(selectedPatient.id);
      
      return () => {
        if (selectedPatient?.id) {
          leavePatientConversation(selectedPatient.id);
        }
      };
    }
  }, [selectedPatient?.id, isWebSocketConnected, joinPatientConversation, leavePatientConversation]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    // Disconnect WebSocket BEFORE logging out
  disconnect();
    await dispatch(logout());
    navigate("/login");
  };

  // Transform real patients to include message data
  const transformedPatients = patients.map(patient => {
    const patientMessages = messagesByPatient[patient.id]?.messages || [];
    const unreadCount = unreadCounts[patient.id] || 0;
    
    return {
      ...patient,
      unreadCount,
      messages: patientMessages
    };
  });

  //  LOG ACTIVITY WHEN SELECTING PATIENT
  const handleSelectPatient = (patient) => {
    // If there was a previous patient, leave their room
    if (selectedPatient?.id && isWebSocketConnected) {
      leavePatientConversation(selectedPatient.id);
    }

    // Update selected patient
    setSelectedPatient(patient);
    dispatch(setCurrentPatient(patient.id));
    
    //  LOG THE ACTIVITY
    logActivity('viewed_patient', { 
      patientId: patient.id,
      patientName: `${patient.first_name} ${patient.last_name}`
    });
    
    // Fetch messages for this patient if not already loaded
    if (!messagesByPatient[patient.id] || messagesByPatient[patient.id].messages.length === 0) {
      dispatch(fetchMessagesWithPatient(patient.id));
    }
    
    // Mark messages as read
    if (unreadCounts[patient.id] > 0) {
      if (isWebSocketConnected) {
        markMessagesAsReadWS(patient.id);
      } else {
        dispatch(markMessagesAsRead(patient.id));
      }
    }

    // Join the new patient's WebSocket room
    if (isWebSocketConnected) {
      joinPatientConversation(patient.id);
    }
  };

  //  LOG ACTIVITY WHEN SENDING MESSAGE
  const handleSendMessage = async (patientId, messageContent, channel = 'webchat') => {
    try {
      // Try WebSocket first for real-time delivery
      if (isWebSocketConnected) {
        console.log('📤 Sending message via WebSocket');

        // Optimistic update
        const optimisticMessage = {
          id: `temp-${Date.now()}`,
          message: messageContent,
          sender: 'dentist',
          channel: channel,
          timestamp: new Date().toISOString(),
          isOptimistic: true
        };

        dispatch(addMessage({ 
          patientId, 
          message: optimisticMessage 
        }));

        const success = sendMessageViaWebSocket(patientId, messageContent, channel);
        
        if (!success) {
          throw new Error('WebSocket send failed');
        }

        //  LOG THE ACTIVITY
        logActivity('sent_message', { 
          patientId, 
          messageLength: messageContent.length,
          channel 
        });

        console.log(' Message sent via WebSocket');
        
      } else {
        // Fallback to HTTP
        console.log('📤 WebSocket not connected, sending via HTTP');
        
        await dispatch(sendMessage({ 
          patientId, 
          content: messageContent, 
          channelType: channel 
        })).unwrap();
        
        //  LOG THE ACTIVITY
        logActivity('sent_message', { 
          patientId, 
          messageLength: messageContent.length,
          channel 
        });

        console.log(' Message sent via HTTP');
      }

    } catch (error) {
      console.error(' Failed to send message:', error);
      
      // HTTP fallback
      if (isWebSocketConnected) {
        console.log('🔄 WebSocket failed, trying HTTP fallback...');
        try {
          await dispatch(sendMessage({ 
            patientId, 
            content: messageContent, 
            channelType: channel 
          })).unwrap();
          
          logActivity('sent_message', { 
            patientId, 
            messageLength: messageContent.length,
            channel,
            fallback: true 
          });

          console.log(' Message sent via HTTP fallback');
        } catch (httpError) {
          console.error(' HTTP fallback also failed:', httpError);
        }
      }
    }
  };

  const handleStartTyping = (patientId) => {
    if (isWebSocketConnected) {
      startTyping(patientId);
    }
  };

  const handleStopTyping = (patientId) => {
    if (isWebSocketConnected) {
      stopTyping(patientId);
    }
  };

  return {
    // Existing state
    mobileOpen,
    selectedIndex,
    setSelectedIndex,
    anchorEl,
    selectedPatient,
    setSelectedPatient: handleSelectPatient,
    isMobile,
    patients: transformedPatients,
    currentUser,
    patientsStatus,
    messagesFetchStatus,
    messageSendStatus,
    
    // Existing handlers
    handleDrawerToggle,
    handleMenuOpen,
    handleMenuClose,
    handleLogout,
    handleSendMessage,
    setMobileOpen,
    
    // WebSocket-specific
    isWebSocketConnected,
    handleStartTyping,
    handleStopTyping,
    
    // Connection status
    connectionStatus: {
      websocket: isWebSocketConnected,
      loading: messagesFetchStatus === 'loading' || patientsStatus === 'loading',
      sending: messageSendStatus === 'loading'
    }
  };
};