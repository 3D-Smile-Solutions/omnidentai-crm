// frontend/src/store/slices/settingsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://omnidentai-crm.onrender.com";

// Update profile
export const updateProfile = createAsyncThunk(
  "settings/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${API_URL}/auth/update-profile`,
        profileData,
        { withCredentials: true }
      );
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Failed to update profile");
    }
  }
);

// Change password
export const changePassword = createAsyncThunk(
  "settings/changePassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${API_URL}/auth/change-password`,
        passwordData,
        { withCredentials: true }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Failed to change password");
    }
  }
);

const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    updateProfileStatus: "idle",
    changePasswordStatus: "idle",
    error: null,
  },
  reducers: {
    clearSettingsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.updateProfileStatus = "loading";
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state) => {
        state.updateProfileStatus = "succeeded";
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updateProfileStatus = "failed";
        state.error = action.payload;
      })
      
      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.changePasswordStatus = "loading";
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.changePasswordStatus = "succeeded";
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.changePasswordStatus = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearSettingsError } = settingsSlice.actions;
export default settingsSlice.reducer;