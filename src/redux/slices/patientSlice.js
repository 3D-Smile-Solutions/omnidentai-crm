import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000";

export const fetchPatients = createAsyncThunk(
  "patients/fetchPatients",
  async (token) => {
    const res = await axios.get(`${API_URL}/patients`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.patients;
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
    builder.addCase(fetchPatients.fulfilled, (state, action) => {
      state.list = action.payload;
    });
  },
});

export default patientSlice.reducer;
