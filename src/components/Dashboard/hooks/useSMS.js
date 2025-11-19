// frontend/src/hooks/useSMS.js
import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { addMessage } from '../../../redux/slices/messageSlice';

const API_URL =  'https://omnidentai-crm.onrender.com';

export const useSMS = () => {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  
  const { session } = useSelector((state) => state.auth);

  /**
   * Send SMS to a patient
   * Now uses direct HTTP - WebSocket will handle the real-time update
   */
  const sendSMS = useCallback(async (patientId, content) => {
    if (!patientId || !content?.trim()) {
      setError('Patient ID and message content are required');
      return { success: false, error: 'Invalid input' };
    }

    setIsSending(true);
    setError(null);

    try {
      const token = session?.access_token;
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : { withCredentials: true };

      console.log('📱 Sending SMS via HTTP to patient:', patientId);

      const response = await axios.post(
        `${API_URL}/api/sms/send`,
        {
          patientId,
          content: content.trim()
        },
        config
      );

      console.log(' SMS sent successfully:', response.data);

      // Note: WebSocket will emit 'message_sent' event automatically
      // The message will appear via WebSocket listener in useWebSocket

      setIsSending(false);
      return { 
        success: true, 
        message: response.data.message,
        twilioSid: response.data.message.twilioSid
      };

    } catch (err) {
      console.error(' Error sending SMS:', err);
      
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.details || 
                          err.message || 
                          'Failed to send SMS';
      
      setError(errorMessage);
      setIsSending(false);
      
      return { success: false, error: errorMessage };
    }
  }, [session?.access_token]);

  /**
   * Get SMS history for a patient
   */
  const getSMSHistory = useCallback(async (patientId) => {
    try {
      const token = session?.access_token;
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : { withCredentials: true };

      const response = await axios.get(
        `${API_URL}/api/sms/history/${patientId}`,
        config
      );

      console.log(' SMS history fetched:', response.data.messages.length);
      return { success: true, messages: response.data.messages };

    } catch (err) {
      console.error(' Error fetching SMS history:', err);
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to fetch SMS history' 
      };
    }
  }, [session?.access_token]);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    sendSMS,
    getSMSHistory,
    isSending,
    error,
    clearError
  };
};