// src/redux/slices/activitySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "http://localhost:5000/auth";

// ==========================================
// ASYNC THUNKS
// ==========================================

// Log an activity
export const logActivity = createAsyncThunk(
  "activity/logActivity",
  async ({ sessionId, activityType, details = {} }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/log-activity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ sessionId, activityType, details }),
      });

      if (!response.ok) {
        throw new Error("Failed to log activity");
      }

      const data = await response.json();
      return { activityType, details, timestamp: new Date().toISOString() };
    } catch (error) {
      console.error("Error logging activity:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Fetch session history
export const fetchSessionHistory = createAsyncThunk(
  "activity/fetchSessionHistory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/session-history`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch session history");
      }

      const data = await response.json();
      return data.sessions || [];
    } catch (error) {
      console.error("Error fetching session history:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Logout from all devices
export const logoutAllDevices = createAsyncThunk(
  "activity/logoutAllDevices",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/logout-all`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to logout from all devices");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error logging out from all devices:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Logout from a specific session
export const logoutSession = createAsyncThunk(
  "activity/logoutSession",
  async (sessionId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/logout-session/${sessionId}`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to logout session");
      }

      const data = await response.json();
      return sessionId;
    } catch (error) {
      console.error("Error logging out session:", error);
      return rejectWithValue(error.message);
    }
  }
);

// ==========================================
// SLICE
// ==========================================

const activitySlice = createSlice({
  name: "activity",
  initialState: {
    sessions: [],
    currentSessionId: null,
    recentActivities: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    logStatus: "idle",
    logoutStatus: "idle",
  },
  reducers: {
    setCurrentSession: (state, action) => {
      state.currentSessionId = action.payload;
    },
    clearCurrentSession: (state) => {
      state.currentSessionId = null;
    },
    addRecentActivity: (state, action) => {
      state.recentActivities.unshift(action.payload);
      // Keep only last 50 activities in memory
      if (state.recentActivities.length > 50) {
        state.recentActivities.pop();
      }
    },
    clearActivities: (state) => {
      state.sessions = [];
      state.recentActivities = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Log Activity
      .addCase(logActivity.pending, (state) => {
        state.logStatus = "loading";
      })
      .addCase(logActivity.fulfilled, (state, action) => {
        state.logStatus = "succeeded";
        state.recentActivities.unshift(action.payload);
        if (state.recentActivities.length > 50) {
          state.recentActivities.pop();
        }
      })
      .addCase(logActivity.rejected, (state, action) => {
        state.logStatus = "failed";
        state.error = action.payload;
      })

      // Fetch Session History
      .addCase(fetchSessionHistory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSessionHistory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.sessions = action.payload;
      })
      .addCase(fetchSessionHistory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Logout All Devices
      .addCase(logoutAllDevices.pending, (state) => {
        state.logoutStatus = "loading";
      })
      .addCase(logoutAllDevices.fulfilled, (state) => {
        state.logoutStatus = "succeeded";
        // Mark all sessions as inactive
        state.sessions = state.sessions.map((session) => ({
          ...session,
          is_active: false,
        }));
      })
      .addCase(logoutAllDevices.rejected, (state, action) => {
        state.logoutStatus = "failed";
        state.error = action.payload;
      })

      // Logout Specific Session
      .addCase(logoutSession.pending, (state) => {
        state.logoutStatus = "loading";
      })
      .addCase(logoutSession.fulfilled, (state, action) => {
        state.logoutStatus = "succeeded";
        // Mark specific session as inactive
        const sessionIndex = state.sessions.findIndex(
          (s) => s.id === action.payload
        );
        if (sessionIndex !== -1) {
          state.sessions[sessionIndex].is_active = false;
        }
      })
      .addCase(logoutSession.rejected, (state, action) => {
        state.logoutStatus = "failed";
        state.error = action.payload;
      });
  },
});

export const {
  setCurrentSession,
  clearCurrentSession,
  addRecentActivity,
  clearActivities,
} = activitySlice.actions;

export default activitySlice.reducer;