//src/components/Dashboard/hooks/useDashboard.js - Updated with WebSocket
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { logout } from "../../../redux/slices/authSlice";
import { fetchPatients } from "../../../redux/slices/patientSlice";
import { 
  fetchUnreadCounts, 
  setCurrentPatient, 
  clearCurrentPatient,
  sendMessage,
  fetchMessagesWithPatient,
  markMessagesAsRead,
  addMessage // Import for optimistic updates
} from "../../../redux/slices/messageSlice";
import useWebSocket from '../../../components/Dashboard/hooks/useWebSocket'; // Import our WebSocket hook

export const useDashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Initialize WebSocket hook
  const {
    isConnected: isWebSocketConnected,
    joinPatientConversation,
    leavePatientConversation,
    sendMessageViaWebSocket,
    startTyping,
    stopTyping,
    markMessagesAsRead: markMessagesAsReadWS
  } = useWebSocket();
  // Get data from Redux store (same as before)
  const { user: currentUser } = useSelector((state) => state.auth);
  const { list: patients, status: patientsStatus } = useSelector((state) => state.patients);
  const { 
    messagesByPatient, 
    currentMessages, 
    unreadCounts,
    fetchStatus: messagesFetchStatus,
    sendStatus: messageSendStatus 
  } = useSelector((state) => state.messages);
  
  // Fetch patients and unread counts when component mounts (same as before)
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

  // ==========================================
  // WEBSOCKET INTEGRATION: PATIENT ROOM MANAGEMENT
  // ==========================================

  // Join/leave patient conversation rooms when patient selection changes
  useEffect(() => {
    if (selectedPatient?.id && isWebSocketConnected) {
      joinPatientConversation(selectedPatient.id);
      
      // Leave room when patient changes or component unmounts
      return () => {
        if (selectedPatient?.id) {
          leavePatientConversation(selectedPatient.id);
        }
      };
    }
  }, [selectedPatient?.id, isWebSocketConnected, joinPatientConversation, leavePatientConversation]);

  // ==========================================
  // EXISTING HANDLERS (MOSTLY UNCHANGED)
  // ==========================================

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
    await dispatch(logout());
    navigate("/login");
  };

  // Transform real patients to include message data (same as before)
  const transformedPatients = patients.map(patient => {
    const patientMessages = messagesByPatient[patient.id]?.messages || [];
    const unreadCount = unreadCounts[patient.id] || 0;
    
    return {
    ...patient, // ✅ Spread all original fields (includes first_name, last_name, lastMessage, etc.)
    unreadCount,
    messages: patientMessages
  };
  });

  const handleSelectPatient = (patient) => {
    // If there was a previous patient, leave their room
    if (selectedPatient?.id && isWebSocketConnected) {
      leavePatientConversation(selectedPatient.id);
    }

    // Update selected patient
    setSelectedPatient(patient);
    dispatch(setCurrentPatient(patient.id));
    
    // Fetch messages for this patient if not already loaded (HTTP fallback)
    if (!messagesByPatient[patient.id] || messagesByPatient[patient.id].messages.length === 0) {
      dispatch(fetchMessagesWithPatient(patient.id));
    }
    
    // Mark messages as read
    if (unreadCounts[patient.id] > 0) {
      if (isWebSocketConnected) {
        markMessagesAsReadWS(patient.id); // WebSocket method
      } else {
        dispatch(markMessagesAsRead(patient.id)); // HTTP fallback
      }
    }

    // Join the new patient's WebSocket room
    if (isWebSocketConnected) {
      joinPatientConversation(patient.id);
    }
  };

  // ==========================================
  // ENHANCED MESSAGE SENDING WITH WEBSOCKET
  // ==========================================

  const handleSendMessage = async (patientId, messageContent, channel = 'webchat') => {
    try {
      // Try WebSocket first for real-time delivery
      if (isWebSocketConnected) {
        console.log('📤 Sending message via WebSocket');

        // Optimistic update: Add message to Redux immediately
        const optimisticMessage = {
          id: `temp-${Date.now()}`, // Temporary ID
          message: messageContent,
          sender: 'dentist',
          channel: channel,
          timestamp: new Date().toISOString(),
          isOptimistic: true // Flag to identify optimistic messages
        };

        // Add to Redux store immediately for instant UI feedback
        dispatch(addMessage({ 
          patientId, 
          message: optimisticMessage 
        }));

        // Send via WebSocket
        const success = sendMessageViaWebSocket(patientId, messageContent, channel);
        
        if (!success) {
          throw new Error('WebSocket send failed');
        }

        console.log('✅ Message sent via WebSocket');
        
      } else {
        // Fallback to HTTP if WebSocket is not connected
        console.log('📤 WebSocket not connected, sending via HTTP');
        
        await dispatch(sendMessage({ 
          patientId, 
          content: messageContent, 
          channelType: channel 
        })).unwrap();
        
        console.log('✅ Message sent via HTTP');
      }

    } catch (error) {
      console.error('❌ Failed to send message:', error);
      
      // If WebSocket failed, try HTTP as fallback
      if (isWebSocketConnected) {
        console.log('🔄 WebSocket failed, trying HTTP fallback...');
        try {
          await dispatch(sendMessage({ 
            patientId, 
            content: messageContent, 
            channelType: channel 
          })).unwrap();
          console.log('✅ Message sent via HTTP fallback');
        } catch (httpError) {
          console.error('❌ HTTP fallback also failed:', httpError);
        }
      }
    }
  };

  // ==========================================
  // TYPING INDICATORS (OPTIONAL FEATURE)
  // ==========================================

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

  // ==========================================
  // RETURN ALL DATA AND HANDLERS
  // ==========================================

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
    handleSendMessage, // Enhanced with WebSocket
    setMobileOpen,
    
    // New WebSocket-specific state and handlers
    isWebSocketConnected,
    handleStartTyping,
    handleStopTyping,
    
    // Connection status for UI indicators
    connectionStatus: {
      websocket: isWebSocketConnected,
      loading: messagesFetchStatus === 'loading' || patientsStatus === 'loading',
      sending: messageSendStatus === 'loading'
    }
  };
};