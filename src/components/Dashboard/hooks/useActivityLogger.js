// src/hooks/useActivityLogger.js
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logActivity } from '../../../redux/slices/activitySlice';

export const useActivityLogger = () => {
  const dispatch = useDispatch();
  const { currentSessionId, logStatus } = useSelector((state) => state.activity);

  const log = useCallback(
    async (activityType, details = {}) => {
      if (!currentSessionId) {
        console.warn('⚠️ No active session ID for logging activity');
        return;
      }

      try {
        await dispatch(
          logActivity({ 
            sessionId: currentSessionId, 
            activityType, 
            details 
          })
        ).unwrap();
      } catch (error) {
        console.error('Failed to log activity:', error);
      }
    },
    [dispatch, currentSessionId]
  );

  return { 
    logActivity: log, 
    isLogging: logStatus === 'loading' 
  };
};