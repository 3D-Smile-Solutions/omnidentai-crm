// redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000";

// --- Thunks ---
export const signup = createAsyncThunk("auth/signup", async (formData, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API_URL}/auth/signup`, formData, { withCredentials: true });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || "Signup failed");
  }
});

export const login = createAsyncThunk("auth/login", async (formData, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API_URL}/auth/login`, formData, { withCredentials: true });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || "Login failed");
  }
});

// 🔧 CHANGE 1: Update fetchMe to return full response data
export const fetchMe = createAsyncThunk("auth/me", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_URL}/auth/me`, { withCredentials: true });
    return res.data; // ← CHANGED: Return full response, not just res.data.user
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || "Unauthorized");
  }
});

export const logout = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || "Logout failed");
  }
});

// --- Slice ---
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    session: null,
    signupStatus: "idle",
    loginStatus: "idle",
    fetchStatus: "idle",
    logoutStatus: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Signup
      .addCase(signup.pending, (state) => {
        state.signupStatus = "loading";
        state.error = null;
      })
      .addCase(signup.fulfilled, (state) => {
        state.signupStatus = "succeeded";
      })
      .addCase(signup.rejected, (state, action) => {
        state.signupStatus = "failed";
        state.error = action.payload;
      })

      // Login
      .addCase(login.pending, (state) => {
        state.loginStatus = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loginStatus = "succeeded";
        state.user = action.payload.user;
        state.session = action.payload.session;
      })
      .addCase(login.rejected, (state, action) => {
        state.loginStatus = "failed";
        state.error = action.payload;
      })

      // 🔧 CHANGE 2: Fix fetchMe.fulfilled to preserve session
      .addCase(fetchMe.pending, (state) => {
        state.fetchStatus = "loading";
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.user = action.payload.user || action.payload; // Handle both response formats
        
        // ← CHANGED: Only update session if provided, preserve existing session
        if (action.payload.access_token) {
          state.session = { access_token: action.payload.access_token };
        } else if (action.payload.session) {
          state.session = action.payload.session;
        }
        // If no session data in response, keep existing session intact
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.error = action.payload;
      })

      // Logout
      .addCase(logout.pending, (state) => {
        state.logoutStatus = "loading";
      })
      .addCase(logout.fulfilled, (state) => {
        state.logoutStatus = "succeeded";
        state.user = null;
        state.session = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.logoutStatus = "failed";
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;