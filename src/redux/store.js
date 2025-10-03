// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import patientReducer from "./slices/patientSlice";
import messageReducer from "./slices/messageSlice";
import typingReducer from "./slices/typingSlice";
import metricsReducer from "./slices/metricsSlice"; // NEW: Add this line

const store = configureStore({
  reducer: {
    auth: authReducer,
    patients: patientReducer,
    messages: messageReducer,
    typing: typingReducer,
    metrics: metricsReducer, // NEW: Add this line
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/login/fulfilled', 'auth/refreshToken/fulfilled'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['items.dates'],
      },
    }),
});

export default store;