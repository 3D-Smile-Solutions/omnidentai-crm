import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import patientReducer from "./slices/patientSlice";
import messageReducer from "./slices/messageSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    patients: patientReducer,
    messages: messageReducer,
  },
});
