// src/redux/slices/twilioUsageSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosInstance';

/**
 *  UNIFIED API - Fetch everything in one call
 */
export const fetchUsageStats = createAsyncThunk(
  'twilioUsage/fetchUsageStats',
  async (period, { rejectWithValue }) => {
    try {
      console.log('📊 Fetching Twilio usage for period:', period);
      
      const response = await api.get('/api/usage/stats', {
        params: { period }
      });
      
      console.log(' Twilio usage data fetched:', response.data);
      
      return {
        stats: response.data.stats,
        costBreakdown: response.data.costBreakdown,
        dailyUsage: response.data.dailyUsage || [],
        period: period
      };
    } catch (error) {
      console.error(' Error fetching Twilio usage:', error);
      return rejectWithValue(error.response?.data || { error: 'Failed to fetch usage data' });
    }
  }
);

const twilioUsageSlice = createSlice({
  name: 'twilioUsage',
  initialState: {
    stats: null,
    dailyUsage: [],
    costBreakdown: null,
    period: 'monthly',
    loading: false,
    error: null,
    lastFetched: null
  },
  reducers: {
    setPeriod: (state, action) => {
      console.log('🔄 Period changed to:', action.payload);
      state.period = action.payload;
    },
    clearUsageData: (state) => {
      state.stats = null;
      state.dailyUsage = [];
      state.costBreakdown = null;
      state.error = null;
      state.lastFetched = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsageStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsageStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats;
        state.costBreakdown = action.payload.costBreakdown;
        state.dailyUsage = action.payload.dailyUsage;
        state.period = action.payload.period;
        state.lastFetched = new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchUsageStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch usage data';
      });
  }
});

export const { setPeriod, clearUsageData } = twilioUsageSlice.actions;
export default twilioUsageSlice.reducer;