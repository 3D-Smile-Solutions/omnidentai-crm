import { createSlice } from '@reduxjs/toolkit';

const typingSlice = createSlice({
  name: 'typing',
  initialState: {
    typingUsers: {}
  },
  reducers: {
    setUserTyping: (state, action) => {
      const { patientId, userId, userEmail, isTyping } = action.payload;
      
      if (!state.typingUsers[patientId]) {
        state.typingUsers[patientId] = {};
      }
      
      if (isTyping) {
        state.typingUsers[patientId][userId] = {
          userEmail,
          isTyping: true,
          timestamp: new Date().toISOString()
        };
      } else {
        delete state.typingUsers[patientId][userId];
        
        if (Object.keys(state.typingUsers[patientId]).length === 0) {
          delete state.typingUsers[patientId];
        }
      }
    }
  }
});

export const { setUserTyping } = typingSlice.actions;
export default typingSlice.reducer;