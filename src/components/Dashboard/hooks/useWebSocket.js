// frontend/src/components/Dashboard/hooks/useWebSocket.js
import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { addMessage } from '../../../redux/slices/messageSlice';
import { updatePatientLastMessage } from '../../../redux/slices/patientSlice'; // 🆕 Import new action
import { setUserTyping } from '../../../redux/slices/typingSlice';

const useWebSocket = () => {
  const socket = useRef(null);
  const dispatch = useDispatch();
  
  // Get auth session from your existing Redux
  const { session } = useSelector((state) => state.auth);
  
  // Initialize WebSocket connection
  useEffect(() => {
    console.log('Session:', session);
    console.log('Access Token:', session?.access_token ? 'Present' : 'Missing');
    
    // Only connect if user is authenticated
    if (!session?.access_token) {
      console.log(' No access token - WebSocket not connecting');
      return;
    }

    console.log('🔌 Initializing WebSocket connection...');

    // Create socket connection with Supabase token
    socket.current = io('https://omnidentai-crm.onrender.com', {
      auth: {
        token: session.access_token // Send your existing Supabase token
      },
      transports: ['websocket', 'polling'] // Fallback to polling if needed
    });

    // ==========================================
    // CONNECTION EVENT HANDLERS
    // ==========================================

    socket.current.on('connect', () => {
      console.log(' Connected to WebSocket server');
    });

    socket.current.on('disconnect', (reason) => {
      console.log('🔌 Disconnected from WebSocket server:', reason);
    });

    socket.current.on('connect_error', (error) => {
      console.error(' WebSocket connection error:', error.message);
    });

    // ==========================================
    // MESSAGE EVENT HANDLERS
    // ==========================================

    // Listen for new messages from other users or systems
    socket.current.on('new_message', (message) => {
      console.log('📨 New message received via WebSocket:', message);
      
      // Add message to Redux store (your existing addMessage action)
      dispatch(addMessage({
        patientId: message.patientId,
        message: message
      }));

      // 🆕 NEW: Update patient's last message in the patient list
      dispatch(updatePatientLastMessage({
        patientId: message.patientId,
        lastMessage: message.message,
        lastMessageTime: message.timestamp,
        lastMessageChannel: message.channel
      }));
    });

    // Listen for confirmation that your message was sent
    socket.current.on('message_sent', (message) => {
      console.log(' Message sent confirmation:', message);
      
      // 🆕 NEW: Update patient's last message for sender too
      dispatch(updatePatientLastMessage({
        patientId: message.patientId,
        lastMessage: message.message,
        lastMessageTime: message.timestamp,
        lastMessageChannel: message.channel
      }));
    });

    // Listen for message errors
    socket.current.on('message_error', (error) => {
      console.error(' Message error:', error);
      // You could dispatch an error action here if needed
    });

    // ==========================================
    // TYPING INDICATORS (OPTIONAL)
    // ==========================================

    socket.current.on('user_typing', (data) => {
      console.log('👤 User typing:', data);
      const { userId, userEmail, isTyping, patientId } = data;
      dispatch(setUserTyping({
    patientId,
    userId,
    userEmail,
    isTyping
  }));
    });

    // ==========================================
    // READ STATUS (OPTIONAL)
    // ==========================================

    socket.current.on('messages_read', (data) => {
      console.log('👁️ Messages read:', data);
      // You can update read status in Redux here later
    });

    // Cleanup on unmount or auth change
    return () => {
      if (socket.current) {
        console.log('🔌 Cleaning up WebSocket connection');
        socket.current.disconnect();
        socket.current = null;
      }
    };

  }, [session?.access_token, dispatch]);

  // ==========================================
  // SOCKET UTILITY FUNCTIONS
  // ==========================================

  const isConnected = socket.current?.connected || false;

  const joinPatientConversation = (patientId) => {
    if (socket.current && patientId) {
      socket.current.emit('join_patient_conversation', patientId);
      // console.log(`👥 Joined conversation with patient ${patientId}`);
    }
  };

  const leavePatientConversation = (patientId) => {
    if (socket.current && patientId) {
      socket.current.emit('leave_patient_conversation', patientId);
      // console.log(`👋 Left conversation with patient ${patientId}`);
    }
  };

  const sendMessageViaWebSocket = (patientId, content, channelType = 'webchat') => {
    if (!socket.current || !isConnected) {
      console.warn('⚠️ WebSocket not connected, message not sent');
      return false;
    }

    if (!patientId || !content?.trim()) {
      console.error(' Invalid message data');
      return false;
    }

    console.log(`📤 Sending message via WebSocket to patient ${patientId}`);

    // Send message via WebSocket
    socket.current.emit('send_message', {
      patientId,
      content: content.trim(),
      channelType
    });

    return true;
  };

  const startTyping = (patientId) => {
    if (socket.current && isConnected && patientId) {
      socket.current.emit('typing_start', { patientId });
    }
  };

  const stopTyping = (patientId) => {
    if (socket.current && isConnected && patientId) {
      socket.current.emit('typing_stop', { patientId });
    }
  };

  const markMessagesAsRead = (patientId) => {
    if (socket.current && isConnected && patientId) {
      socket.current.emit('mark_messages_read', { patientId });
    }
  };

  // Return all the functions your components need
  return {
    isConnected,
    joinPatientConversation,
    leavePatientConversation,
    sendMessageViaWebSocket,
    startTyping,
    stopTyping,
    markMessagesAsRead
  };
};

export default useWebSocket;