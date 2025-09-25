// src/redux/slices/patientSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000";

export const fetchPatients = createAsyncThunk(
  "patients/fetchPatients",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth?.session?.access_token;

      // If we have an access token in memory, send it in header (preferred).
      // Otherwise rely on cookie (withCredentials) + middleware refresh.
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : { withCredentials: true };

      const res = await axios.get(`${API_URL}/patients`, config);
      return res.data.patients;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message || "Failed to fetch patients");
    }
  }
);

const patientSlice = createSlice({
  name: "patients",
  initialState: {
    list: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatients.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export default patientSlice.reducer;
