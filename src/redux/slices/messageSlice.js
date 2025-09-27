import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000";

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

// Send a message
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

// Mark messages as read
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
    
    // Add message to current conversation (for real-time updates)
    addMessage: (state, action) => {
      const { patientId, message } = action.payload;
      
      // Add to messagesByPatient
      if (!state.messagesByPatient[patientId]) {
        state.messagesByPatient[patientId] = { messages: [], unreadCount: 0 };
      }
      state.messagesByPatient[patientId].messages.push(message);
      
      // Add to current messages if this is the selected patient
      if (state.currentPatientId === patientId) {
        state.currentMessages.push(message);
      }
      
      // Update unread count if message is from patient
      if (message.sender === 'patient') {
        state.unreadCounts[patientId] = (state.unreadCounts[patientId] || 0) + 1;
        if (state.messagesByPatient[patientId]) {
          state.messagesByPatient[patientId].unreadCount = state.unreadCounts[patientId];
        }
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
      
      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.sendStatus = "loading";
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sendStatus = "succeeded";
        const { patientId, message } = action.payload;
        
        // Add message to messagesByPatient
        if (!state.messagesByPatient[patientId]) {
          state.messagesByPatient[patientId] = { messages: [], unreadCount: 0 };
        }
        state.messagesByPatient[patientId].messages.push(message);
        
        // Add to current messages if this is the selected patient
        if (state.currentPatientId === patientId) {
          state.currentMessages.push(message);
        }
        
        // Reset send status after a delay
        setTimeout(() => {
          if (state.sendStatus === "succeeded") {
            state.sendStatus = "idle";
          }
        }, 1000);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sendStatus = "failed";
        state.error = action.payload || action.error.message;
      })
      
      // Mark as read
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
  clearError 
} = messageSlice.actions;

export default messageSlice.reducer;