import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import patientReducer from "./slices/patientSlice";
import messageReducer from "./slices/messageSlice";
import typingReducer from "./slices/typingSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    patients: patientReducer,
    messages: messageReducer,
    typing: typingReducer, 
  },
});
