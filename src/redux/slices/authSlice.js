// store/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000";

// Thunks
export const signup = createAsyncThunk("auth/signup", async (formData) => {
  const res = await axios.post(`${API_URL}/auth/signup`, formData, { withCredentials: true });
  return res.data;
});

export const login = createAsyncThunk("auth/login", async (formData, { dispatch }) => {
  const res = await axios.post(`${API_URL}/auth/login`, formData, { withCredentials: true });
  // immediately fetch user profile after login
  await dispatch(fetchMe());
  return res.data;
});

export const fetchMe = createAsyncThunk("auth/me", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_URL}/auth/me`, { withCredentials: true });
    return res.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data || "Unauthorized");
  }
});

export const logout = createAsyncThunk("auth/logout", async () => {
  await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Signup
      .addCase(signup.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signup.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })

      // Login
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.session = action.payload.session;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })

      // FetchMe
      .addCase(fetchMe.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.status = "idle";
      });
  },
});

export default authSlice.reducer;
