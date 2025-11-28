//src/redux/slices/messageSlice.js - Enhanced for WebSocket
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../config/api";
// const API_URL = "https://omnidentai-crm.onrender.com";

// ==========================================
// EXISTING ASYNC THUNKS (UNCHANGED)
// ==========================================

// Fetch messages for a specific patient
export const fetchMessagesWithPatient = createAsyncThunk(
  "messages/fetchWithPatient",
  async (patientId, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth?.session?.access_token;

      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : { withCredentials: true };

      const res = await axios.get(`${API_URL}/messages/${patientId}`, config);
      return { patientId, messages: res.data.messages };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message || "Failed to fetch messages");
    }
  }
);

// Fetch all messages overview
export const fetchAllMessages = createAsyncThunk(
  "messages/fetchAll",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth?.session?.access_token;

      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : { withCredentials: true };

      const res = await axios.get(`${API_URL}/messages`, config);
      return res.data.messagesByPatient;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message || "Failed to fetch messages");
    }
  }
);

// Send a message (HTTP fallback)
export const sendMessage = createAsyncThunk(
  "messages/send",
  async ({ patientId, content, channelType = 'webchat' }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth?.session?.access_token;

      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : { withCredentials: true };

      const res = await axios.post(`${API_URL}/messages`, {
        patientId,
        content,
        channelType
      }, config);

      return { patientId, message: res.data.message };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message || "Failed to send message");
    }
  }
);

// Mark messages as read (HTTP)
export const markMessagesAsRead = createAsyncThunk(
  "messages/markAsRead",
  async (patientId, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth?.session?.access_token;

      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : { withCredentials: true };

      await axios.put(`${API_URL}/messages/${patientId}/mark-read`, {}, config);
      return patientId;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message || "Failed to mark as read");
    }
  }
);

// Fetch unread counts
export const fetchUnreadCounts = createAsyncThunk(
  "messages/fetchUnreadCounts",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth?.session?.access_token;

      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : { withCredentials: true };

      const res = await axios.get(`${API_URL}/messages/unread-counts`, config);
      return res.data.unreadCounts;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message || "Failed to fetch unread counts");
    }
  }
);

// ==========================================
// ENHANCED MESSAGE SLICE
// ==========================================

const messageSlice = createSlice({
  name: "messages",
  initialState: {
    // Messages by patient ID
    messagesByPatient: {}, // { patientId: { messages: [], unreadCount: 0 } }
    
    // Loading states
    fetchStatus: "idle",
    sendStatus: "idle",
    
    // Current selected patient messages
    currentPatientId: null,
    currentMessages: [],
    
    // Unread counts
    unreadCounts: {},
    
    // WebSocket connection status
    isWebSocketConnected: false,
    
    // Errors
    error: null,
  },
  reducers: {
    // Set current patient
    setCurrentPatient: (state, action) => {
      const patientId = action.payload;
      state.currentPatientId = patientId;
      state.currentMessages = state.messagesByPatient[patientId]?.messages || [];
    },
    
    // Clear current patient
    clearCurrentPatient: (state) => {
      state.currentPatientId = null;
      state.currentMessages = [];
    },
    
    // ==========================================
    // ENHANCED: Add message (from WebSocket or HTTP)
    // ==========================================
addMessage: (state, action) => {
  const { patientId, message } = action.payload;
  
  if (!state.messagesByPatient[patientId]) {
    state.messagesByPatient[patientId] = { messages: [], unreadCount: 0 };
  }
  
  const currentMessages = state.messagesByPatient[patientId].messages;
  const messageTime = new Date(message.timestamp).getTime();
  const now = Date.now();
  const isRecentMessage = (now - messageTime) < 10000; // Within 10 seconds
  
  // For recent messages, use stricter duplicate check (exact ID only)
  // For older messages, also check timestamp+content
  const isDuplicate = currentMessages.some(msg => {
    // Always check ID if available
    if (message.id && msg.id && msg.id === message.id) {
      return true;
    }
    
    // For NON-recent messages, also check content match
    if (!isRecentMessage) {
      if (msg.timestamp === message.timestamp && 
          msg.message === message.message && 
          msg.sender === message.sender) {
        return true;
      }
    }
    
    return false;
  });
  
  if (!isDuplicate) {
    const newMessages = [...currentMessages, message];
    
    state.messagesByPatient = {
      ...state.messagesByPatient,
      [patientId]: {
        ...state.messagesByPatient[patientId],
        messages: newMessages,
        unreadCount: (message.sender === 'user' || message.sender === 'patient')
          ? (state.messagesByPatient[patientId].unreadCount || 0) + 1
          : state.messagesByPatient[patientId].unreadCount
      }
    };
    
    if (message.sender === 'user' || message.sender === 'patient') {
      state.unreadCounts = {
        ...state.unreadCounts,
        [patientId]: (state.unreadCounts[patientId] || 0) + 1
      };
    }
    
    console.log("✅ Message added, count:", newMessages.length);
  } else {
    console.log("⚠️ Duplicate ignored");
  }
},
    
    // ==========================================
    // NEW: Update optimistic message with real one
    // ==========================================
    updateMessage: (state, action) => {
      const { patientId, oldMessageId, newMessage } = action.payload;
      
      // Update in messagesByPatient
      if (state.messagesByPatient[patientId]) {
        const messageIndex = state.messagesByPatient[patientId].messages.findIndex(
          msg => msg.id === oldMessageId
        );
        
        if (messageIndex !== -1) {
          state.messagesByPatient[patientId].messages[messageIndex] = newMessage;
        }
      }
      
      // Update in currentMessages if this is the selected patient
      if (state.currentPatientId === patientId) {
        const currentIndex = state.currentMessages.findIndex(msg => msg.id === oldMessageId);
        if (currentIndex !== -1) {
          state.currentMessages[currentIndex] = newMessage;
        }
      }
    },
    
    // ==========================================
    // NEW: Remove failed optimistic messages
    // ==========================================
    removeOptimisticMessage: (state, action) => {
      const { patientId, messageId } = action.payload;
      
      // Remove from messagesByPatient
      if (state.messagesByPatient[patientId]) {
        state.messagesByPatient[patientId].messages = state.messagesByPatient[patientId].messages.filter(
          msg => msg.id !== messageId
        );
      }
      
      // Remove from currentMessages if this is the selected patient
      if (state.currentPatientId === patientId) {
        state.currentMessages = state.currentMessages.filter(msg => msg.id !== messageId);
      }
    },
    
    // ==========================================
    // NEW: Set WebSocket connection status
    // ==========================================
    setWebSocketConnectionStatus: (state, action) => {
      state.isWebSocketConnected = action.payload;
    },
    
    // ==========================================
    // ENHANCED: Clear messages as read (for WebSocket)
    // ==========================================
    clearUnreadCount: (state, action) => {
      const patientId = action.payload;
      
      // Reset unread count
      if (state.unreadCounts[patientId]) {
        state.unreadCounts[patientId] = 0;
      }
      if (state.messagesByPatient[patientId]) {
        state.messagesByPatient[patientId].unreadCount = 0;
      }
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch messages with patient
      .addCase(fetchMessagesWithPatient.pending, (state) => {
        state.fetchStatus = "loading";
        state.error = null;
      })
      .addCase(fetchMessagesWithPatient.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        const { patientId, messages } = action.payload;
        
        if (!state.messagesByPatient[patientId]) {
          state.messagesByPatient[patientId] = { messages: [], unreadCount: 0 };
        }
        
        // Replace messages completely (HTTP fetch overwrites WebSocket messages)
        state.messagesByPatient[patientId].messages = messages;
        
        // Update current messages if this is the selected patient
        if (state.currentPatientId === patientId) {
          state.currentMessages = messages;
        }
      })
      .addCase(fetchMessagesWithPatient.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.error = action.payload || action.error.message;
      })
      
      // Fetch all messages
      .addCase(fetchAllMessages.fulfilled, (state, action) => {
        state.messagesByPatient = action.payload;
        
        // Update current messages if patient is selected
        if (state.currentPatientId && action.payload[state.currentPatientId]) {
          state.currentMessages = action.payload[state.currentPatientId].messages;
        }
      })
      
      // Send message (HTTP fallback)
      .addCase(sendMessage.pending, (state) => {
        state.sendStatus = "loading";
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sendStatus = "succeeded";
        const { patientId, message } = action.payload;
        
        // Add message (will check for duplicates automatically)
        if (!state.messagesByPatient[patientId]) {
          state.messagesByPatient[patientId] = { messages: [], unreadCount: 0 };
        }
        
        // Check if this message already exists (from WebSocket)
        const existingMessage = state.messagesByPatient[patientId].messages.find(
          msg => msg.id === message.id
        );
        
        if (!existingMessage) {
          state.messagesByPatient[patientId].messages.push(message);
          
          // Add to current messages if this is the selected patient
          if (state.currentPatientId === patientId) {
            state.currentMessages.push(message);
          }
        }
        
        // Reset send status after a delay
        // setTimeout(() => {
        //   if (state.sendStatus === "succeeded") {
        //     state.sendStatus = "idle";
        //   }
        // }, 1000);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sendStatus = "failed";
        state.error = action.payload || action.error.message;
      })
      
      // Mark as read (HTTP)
      .addCase(markMessagesAsRead.fulfilled, (state, action) => {
        const patientId = action.payload;
        
        // Reset unread count
        if (state.unreadCounts[patientId]) {
          state.unreadCounts[patientId] = 0;
        }
        if (state.messagesByPatient[patientId]) {
          state.messagesByPatient[patientId].unreadCount = 0;
        }
      })
      
      // Fetch unread counts
      .addCase(fetchUnreadCounts.fulfilled, (state, action) => {
        state.unreadCounts = action.payload;
        
        // Update unread counts in messagesByPatient
        Object.keys(action.payload).forEach(patientId => {
          if (state.messagesByPatient[patientId]) {
            state.messagesByPatient[patientId].unreadCount = action.payload[patientId];
          }
        });
      });
  },
});

export const { 
  setCurrentPatient, 
  clearCurrentPatient, 
  addMessage,
  updateMessage,
  removeOptimisticMessage,
  setWebSocketConnectionStatus,
  clearUnreadCount,
  clearError 
} = messageSlice.actions;

export default messageSlice.reducer;