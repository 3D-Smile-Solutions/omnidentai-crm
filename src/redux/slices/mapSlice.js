// src/redux/slices/mapSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosInstance';

/**
 * Fetch patient distribution map data
 * GET /api/metrics/patient-map
 */
export const fetchPatientMapData = createAsyncThunk(
  'map/fetchPatientMapData',
  async (_, { rejectWithValue }) => {
    try {
      console.log('🗺️ Fetching patient map data...');
      const response = await api.get('/api/metrics/patient-map');
      console.log(' Map data fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error(' Error fetching map data:', error);
      return rejectWithValue(error.response?.data || { error: 'Failed to fetch map data' });
    }
  }
);

const mapSlice = createSlice({
  name: 'map',
  initialState: {
    locations: [],
    procedureSummary: [],
    totalPatients: 0,
    totalStates: 0,
    center: { lat: 39.8283, lng: -98.5795 }, // Default US center
    zoom: 4,
    loading: false,
    error: null,
    lastFetched: null
  },
  reducers: {
    clearMapData: (state) => {
      state.locations = [];
      state.procedureSummary = [];
      state.totalPatients = 0;
      state.totalStates = 0;
      state.center = { lat: 39.8283, lng: -98.5795 };
      state.zoom = 4;
      state.error = null;
      state.lastFetched = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatientMapData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatientMapData.fulfilled, (state, action) => {
        state.loading = false;
        state.locations = action.payload.locations || [];
        state.procedureSummary = action.payload.procedure_summary || [];
        state.totalPatients = action.payload.total_patients || 0;
        state.totalStates = action.payload.total_states || 0;
        state.center = action.payload.center || { lat: 39.8283, lng: -98.5795 };
        state.zoom = action.payload.zoom || 4;
        state.lastFetched = new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchPatientMapData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch map data';
      });
  }
});

export const { clearMapData } = mapSlice.actions;
export default mapSlice.reducer;