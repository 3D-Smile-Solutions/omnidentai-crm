// frontend/src/redux/slices/patientSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000";

export const fetchPatients = createAsyncThunk(
  "patients/fetchPatients",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth?.session?.access_token;

      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : { withCredentials: true };

      // console.log('🔍 Fetching patients from API...');
      const res = await axios.get(`${API_URL}/patients`, config);
      
      // console.log('📦 Raw API response:', res.data);
      // console.log('📦 Patients array:', res.data.patients);
      
      if (res.data.patients && res.data.patients.length > 0) {
        // console.log('📦 First patient from API:', {
        //   id: res.data.patients[0].id,
        //   first_name: res.data.patients[0].first_name,
        //   last_name: res.data.patients[0].last_name,
        //   lastMessage: res.data.patients[0].lastMessage,
        //   lastMessageTime: res.data.patients[0].lastMessageTime,
        //   allKeys: Object.keys(res.data.patients[0])
        // });
      }
      
      return res.data.patients;
    } catch (err) {
      console.error('❌ Error fetching patients:', err);
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
  reducers: {
    updatePatientLastMessage: (state, action) => {
      const { patientId, lastMessage, lastMessageTime, lastMessageChannel } = action.payload;
      
      // console.log('🔄 updatePatientLastMessage called:', {
      //   patientId,
      //   lastMessage: lastMessage?.substring(0, 30),
      //   lastMessageTime
      // });
      
      const patient = state.list.find(p => p.id === patientId);
      
      if (patient) {
        patient.lastMessage = lastMessage;
        patient.lastMessageTime = lastMessageTime;
        if (lastMessageChannel) {
          patient.lastMessageChannel = lastMessageChannel;
        }
        
        // console.log(`✅ Updated last message for patient ${patientId}`);
      } else {
        console.warn(`⚠️ Patient ${patientId} not found in list`);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatients.pending, (state) => {
        console.log('⏳ fetchPatients.pending');
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        console.log('✅ fetchPatients.fulfilled');
        // console.log('📦 Payload received in reducer:', action.payload);
        
        if (action.payload && action.payload.length > 0) {
          // console.log('📦 First patient in reducer:', {
          //   id: action.payload[0].id,
          //   first_name: action.payload[0].first_name,
          //   last_name: action.payload[0].last_name,
          //   lastMessage: action.payload[0].lastMessage,
          //   lastMessageTime: action.payload[0].lastMessageTime,
          //   allKeys: Object.keys(action.payload[0])
          // });
        }
        
        state.status = "succeeded";
        state.list = action.payload;
        
        console.log('📦 State.list after update:', state.list);
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        console.error('❌ fetchPatients.rejected:', action.payload);
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const { updatePatientLastMessage } = patientSlice.actions;

export default patientSlice.reducer;