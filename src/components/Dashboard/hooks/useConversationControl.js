// frontend/src/components/Dashboard/hooks/useConversationControl.js

import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux'; //  ADD THIS IMPORT
import api from '../../../api/axiosInstance';

export const useConversationControl = (contactId) => {
  const [botPaused, setBotPaused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  //  GET DENTIST FROM REDUX (this was missing!)
  const currentUser = useSelector((state) => state.auth.user);
  const dentistId = currentUser?.id;

  // Fetch current control status
  const fetchControlStatus = useCallback(async () => {
    if (!contactId) return;
    
    try {
      setLoading(true);
      const response = await api.get(`/api/conversation-control/${contactId}`);
      setBotPaused(response.data.data?.bot_paused || false);
      setError(null);
    } catch (err) {
      console.error('Error fetching control status:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [contactId]);

  // Pause bot (dentist takes over)
  const pauseBot = useCallback(async (reason = 'manual_intervention') => {
    console.log('🎯 PAUSE BOT CALLED');
    console.log('📦 contactId:', contactId);
    console.log('👤 dentistId:', dentistId);
    console.log('👤 currentUser:', currentUser);
    
    if (!contactId || !dentistId) {
      console.error(' Missing contactId or dentistId:', { contactId, dentistId });
      return false;
    }
    
    const payload = {
      contactId,
      dentistId,
      reason
    };
    
    console.log('📤 Sending to backend:', payload);
    
    try {
      setLoading(true);
      
      const response = await api.post('/api/conversation-control/pause', payload);
      
      console.log(' Backend response:', response.data);
      
      setBotPaused(true);
      setError(null);
      return true;
    } catch (err) {
      console.error(' Error pausing bot:', err);
      console.error(' Error response:', err.response?.data);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [contactId, dentistId, currentUser]); //  ADD DEPENDENCIES

  // Resume bot (bot takes over)
  const resumeBot = useCallback(async () => {
    console.log('🎯 RESUME BOT CALLED');
    console.log('📦 contactId:', contactId);
    console.log('👤 dentistId:', dentistId);
    
    if (!contactId || !dentistId) {
      console.error(' Missing contactId or dentistId:', { contactId, dentistId });
      return false;
    }
    
    const payload = {
      contactId,
      dentistId
    };
    
    console.log('📤 Sending to backend:', payload);
    
    try {
      setLoading(true);
      
      const response = await api.post('/api/conversation-control/resume', payload);
      
      console.log(' Backend response:', response.data);
      
      setBotPaused(false);
      setError(null);
      return true;
    } catch (err) {
      console.error(' Error resuming bot:', err);
      console.error(' Error response:', err.response?.data);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [contactId, dentistId]); //  ADD DEPENDENCIES

  // Fetch status when contactId changes
  useEffect(() => {
    fetchControlStatus();
  }, [fetchControlStatus]);

  return {
    botPaused,
    loading,
    error,
    pauseBot,
    resumeBot,
    refreshStatus: fetchControlStatus
  };
};