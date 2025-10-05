// frontend/src/components/Dashboard/hooks/useVoiceCall.js - FINAL
import { useState, useEffect, useCallback, useRef } from 'react';
import { Device } from '@twilio/voice-sdk';
import api from '../../../api/axiosInstance';

export const useVoiceCall = () => {
  const [device, setDevice] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [isCallInProgress, setIsCallInProgress] = useState(false);
  const [currentCall, setCurrentCall] = useState(null);
  const [error, setError] = useState(null);
  const [callDuration, setCallDuration] = useState(0);
  
  const durationIntervalRef = useRef(null);

  useEffect(() => {
    let twilioDevice = null;

    const initializeDevice = async () => {
      try {
        console.log('📞 Initializing Twilio Device...');
        
        const response = await api.get('/api/voice/token');
        const { token } = response.data;

        twilioDevice = new Device(token, {
          logLevel: 'debug',
          codecPreferences: ['opus', 'pcmu'],
          edge: 'ashburn'
        });

        twilioDevice.on('registered', () => {
          console.log('✅ Twilio Device registered');
          setIsReady(true);
          setError(null);
        });

        twilioDevice.on('error', (twilioError) => {
          console.error('❌ Twilio Device error:', twilioError);
          setError(twilioError?.message || 'Device error occurred');
          setIsReady(false);
        });

        twilioDevice.on('incoming', (call) => {
          console.log('📞 Incoming call:', call);
          setCurrentCall(call);
          setIsCallInProgress(true);
        });

        await twilioDevice.register();
        setDevice(twilioDevice);

      } catch (err) {
        console.error('❌ Failed to initialize Twilio Device:', err);
        setError(err?.message || 'Failed to initialize device');
        setIsReady(false);
      }
    };

    initializeDevice();

    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
      if (twilioDevice) {
        twilioDevice.unregister();
        twilioDevice.destroy();
      }
    };
  }, []);

  const makeCall = useCallback(async (patientId, patientPhone) => {
    if (!device || !isReady) {
      setError('Device not ready. Please refresh the page.');
      return;
    }

    try {
      console.log('📞 Initiating call to patient:', patientId);
      setError(null);
      setCallDuration(0);

      // First, tell backend to initiate the call
      const response = await api.post('/api/voice/make-call', { patientId });
      console.log('✅ Backend call initiated:', response.data);

      // The call will come to us as an "incoming" call from the device
      // OR we need to connect directly if using client SDK
      
      // For direct browser-to-phone calling:
      const call = await device.connect({
        params: {
          To: patientPhone,
          patientId: patientId
        }
      });

      console.log('📞 Call connecting...');
      setCurrentCall(call);
      setIsCallInProgress(true);

      // Start duration timer
      durationIntervalRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);

      // Call event handlers
      call.on('accept', () => {
        console.log('✅ Call accepted/connected');
      });

      call.on('disconnect', () => {
        console.log('📴 Call disconnected');
        handleCallEnd();
      });

      call.on('cancel', () => {
        console.log('❌ Call cancelled');
        handleCallEnd();
      });

      call.on('reject', () => {
        console.log('❌ Call rejected');
        handleCallEnd();
      });

      call.on('error', (callError) => {
        console.error('❌ Call error:', callError);
        setError(callError?.message || 'Call error occurred');
        handleCallEnd();
      });

      return call;
    } catch (err) {
      console.error('❌ Error making call:', err);
      setError(err.response?.data?.error || err?.message || 'Failed to make call');
      handleCallEnd();
    }
  }, [device, isReady]);

  const handleCallEnd = useCallback(() => {
    setIsCallInProgress(false);
    setCurrentCall(null);
    setCallDuration(0);
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }
  }, []);

  const endCall = useCallback(() => {
    if (currentCall) {
      console.log('📴 Ending call...');
      currentCall.disconnect();
    }
    handleCallEnd();
  }, [currentCall, handleCallEnd]);

  const toggleMute = useCallback(() => {
    if (currentCall) {
      const isMuted = currentCall.isMuted();
      currentCall.mute(!isMuted);
      console.log(isMuted ? '🔊 Unmuted' : '🔇 Muted');
      return !isMuted;
    }
    return false;
  }, [currentCall]);

  const formatDuration = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    isReady,
    isCallInProgress,
    currentCall,
    error,
    callDuration: formatDuration(callDuration),
    makeCall,
    endCall,
    toggleMute
  };
};