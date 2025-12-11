// frontend/src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../config/api";

// --- Thunks ---
// export const signup = createAsyncThunk("auth/signup", async (formData, { rejectWithValue }) => {
//   try {
//     const res = await axios.post(`${API_URL}/auth/signup`, formData, { withCredentials: true });
//     return res.data;
//   } catch (err) {
//     return rejectWithValue(err.response?.data?.error || "Signup failed");
//   }
// });

export const login = createAsyncThunk("auth/login", async (formData, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API_URL}/auth/login`, formData, { withCredentials: true });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || "Login failed");
  }
});

export const fetchMe = createAsyncThunk("auth/me", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_URL}/auth/me`, { withCredentials: true });
    return res.data;
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

// ✅ NEW: Explicit refresh token thunk
export const refreshToken = createAsyncThunk("auth/refreshToken", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || "Refresh failed");
  }
});

// --- Slice ---
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    session: null,
    sessionId: null,
    externalId: null,
    loginStatus: "idle",
    fetchStatus: "idle",
    logoutStatus: "idle",
    refreshStatus: "idle",
    error: null,
  },
  reducers: {
    // ✅ Manual action to update access token
    setAccessToken: (state, action) => {
      if (state.session) {
        state.session.access_token = action.payload;
      } else {
        state.session = { access_token: action.payload };
      }
    },
    // ✅ Clear auth state manually
    clearAuth: (state) => {
      state.user = null;
      state.session = null;
      state.sessionId = null;
      state.externalId = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loginStatus = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loginStatus = "succeeded";
        state.user = action.payload.user;
        state.session = action.payload.session;

        if (action.payload.user?.sessionId) {
          state.sessionId = action.payload.user.sessionId;
        } else if (action.payload.sessionLogId) {
          state.sessionId = action.payload.sessionLogId;
        }

        if (action.payload.user?.external_id) {
          state.externalId = action.payload.user.external_id;
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loginStatus = "failed";
        state.error = action.payload;
      })

      // fetchMe
      .addCase(fetchMe.pending, (state) => {
        state.fetchStatus = "loading";
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.user = action.payload.user || action.payload;

        // ✅ Store access token if returned (from refresh flow)
        if (action.payload.access_token) {
          state.session = { access_token: action.payload.access_token };
        } else if (action.payload.session) {
          state.session = action.payload.session;
        }

        if (action.payload.user?.sessionId) {
          state.sessionId = action.payload.user.sessionId;
        }

        if (action.payload.user?.external_id) {
          state.externalId = action.payload.user.external_id;
        }
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.error = action.payload;
        // ✅ Clear user on auth failure
        state.user = null;
        state.session = null;
      })

      // ✅ Refresh token
      .addCase(refreshToken.pending, (state) => {
        state.refreshStatus = "loading";
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.refreshStatus = "succeeded";
        if (action.payload.access_token) {
          state.session = { access_token: action.payload.access_token };
        }
        if (action.payload.user) {
          state.user = action.payload.user;
        }
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.refreshStatus = "failed";
        state.error = action.payload;
        // Clear everything on refresh failure
        state.user = null;
        state.session = null;
        state.sessionId = null;
        state.externalId = null;
      })

      // Logout
      .addCase(logout.pending, (state) => {
        state.logoutStatus = "loading";
      })
      .addCase(logout.fulfilled, (state) => {
        state.logoutStatus = "succeeded";
        state.user = null;
        state.session = null;
        state.sessionId = null;
        state.externalId = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.logoutStatus = "failed";
        state.error = action.payload;
        // Still clear state on logout error
        state.user = null;
        state.session = null;
        state.sessionId = null;
        state.externalId = null;
      });
  },
});

export const { setAccessToken, clearAuth } = authSlice.actions;
export default authSlice.reducer;