// src/redux/slices/metricsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosInstance'; // ← CORRECTED PATH

// Async thunk to fetch overview metrics
export const fetchOverviewMetrics = createAsyncThunk(
  'metrics/fetchOverview',
  async (_, { rejectWithValue }) => {
    try {
      console.log('📊 Fetching overview metrics...');
      const response = await api.get('/api/metrics/overview'); // ← Added /api prefix
      console.log('✅ Overview metrics fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching overview metrics:', error);
      return rejectWithValue(error.response?.data || { error: 'Failed to fetch metrics' });
    }
  }
);

const metricsSlice = createSlice({
  name: 'metrics',
  initialState: {
    summary: {
      totalRevenue: 0,
      totalBookings: 0,
      totalConversations: 0,
      recentBooking: null,
      revenueGrowth: 0,
      conversationGrowth: 0
    },
    charts: {
      revenueData: [],
      appointmentTypes: [],
      conversationsByChannel: [],
      popularProcedures: [],
      insuranceProviders: [],
      patientTypes: [],
      revenueByType: [],
      patientSatisfaction: []
    },
    loading: false,
    error: null,
    lastFetched: null
  },
  reducers: {
    clearMetrics: (state) => {
      state.summary = {
        totalRevenue: 0,
        totalBookings: 0,
        totalConversations: 0,
        recentBooking: null,
        revenueGrowth: 0,
        conversationGrowth: 0
      };
      state.charts = {
        revenueData: [],
        appointmentTypes: [],
        conversationsByChannel: [],
        popularProcedures: [],
        insuranceProviders: [],
        patientTypes: [],
        revenueByType: [],
        patientSatisfaction: []
      };
      state.error = null;
      state.lastFetched = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOverviewMetrics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOverviewMetrics.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload.summary;
        state.charts = action.payload.charts;
        state.lastFetched = new Date().toISOString();
      })
      .addCase(fetchOverviewMetrics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch metrics';
      });
  }
});

export const { clearMetrics } = metricsSlice.actions;
export default metricsSlice.reducer;