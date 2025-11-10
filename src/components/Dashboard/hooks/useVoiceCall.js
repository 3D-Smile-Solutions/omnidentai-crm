// frontend/src/components/Dashboard/hooks/useVoiceCall.js - FIXED CLEANUP
import { useState, useEffect, useCallback, useRef } from "react";
import { Device } from "@twilio/voice-sdk";
import api from "../../../api/axiosInstance";

export const useVoiceCall = () => {
  const [device, setDevice] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [isCallInProgress, setIsCallInProgress] = useState(false);
  const [currentCall, setCurrentCall] = useState(null);
  const [error, setError] = useState(null);
  const [callDuration, setCallDuration] = useState(0);

  const durationIntervalRef = useRef(null);
  const deviceRef = useRef(null); // ✅ NEW: Track device instance

  useEffect(() => {
    const initializeDevice = async () => {
      try {
        console.log("📞 Initializing Twilio Device...");

        const response = await api.get("/api/voice/token");
        const { token } = response.data;

        console.log("✅ Got token from backend");

        const twilioDevice = new Device(token, {
          logLevel: "debug",
          codecPreferences: ["opus", "pcmu"],
          edge: "roaming",
        });

        twilioDevice.on("registered", () => {
          console.log("✅ Twilio Device registered");
          setIsReady(true);
          setError(null);
        });

        twilioDevice.on("error", (twilioError) => {
          console.error("❌ Twilio Device error:", twilioError);
          setError(twilioError?.message || "Device error occurred");
          setIsReady(false);
        });

        twilioDevice.on("incoming", (call) => {
          console.log("📞 Incoming call:", call);
          handleIncomingCall(call);
        });

        await twilioDevice.register();

        // ✅ Store device in both state and ref
        setDevice(twilioDevice);
        deviceRef.current = twilioDevice;
      } catch (err) {
        console.error("❌ Failed to initialize Twilio Device:", err);
        setError(err?.message || "Failed to initialize device");
        setIsReady(false);
      }
    };

    initializeDevice();

    // ✅ FIXED CLEANUP - Check device state before unregistering
    return () => {
      console.log("🧹 Cleaning up Twilio Device...");

      // Clear duration interval
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }

      // Cleanup device safely
      if (deviceRef.current) {
        const currentDevice = deviceRef.current;

        // Only unregister if device is registered
        if (currentDevice.state === "registered") {
          console.log("📴 Unregistering device...");
          currentDevice
            .unregister()
            .then(() => console.log("✅ Device unregistered successfully"))
            .catch((err) =>
              console.warn("⚠️ Error unregistering device:", err.message)
            );
        } else {
          console.log("ℹ️ Device not registered, skipping unregister");
        }

        // Destroy device
        try {
          currentDevice.destroy();
          console.log("✅ Device destroyed");
        } catch (err) {
          console.warn("⚠️ Error destroying device:", err.message);
        }

        deviceRef.current = null;
      }
    };
  }, []); // ✅ Empty dependency array - only run once

  const handleIncomingCall = (call) => {
    setCurrentCall(call);
    setIsCallInProgress(true);
    call.accept();
    setupCallHandlers(call);
  };

  const setupCallHandlers = (call) => {
    durationIntervalRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    call.on("accept", () => {
      console.log("✅ Call accepted/connected");
    });

    call.on("disconnect", () => {
      console.log("📴 Call disconnected");
      handleCallEnd();
    });

    call.on("cancel", () => {
      console.log("❌ Call cancelled");
      handleCallEnd();
    });

    call.on("reject", () => {
      console.log("❌ Call rejected");
      handleCallEnd();
    });

    call.on("error", (callError) => {
      console.error("❌ Call error:", callError);
      setError(callError?.message || "Call error occurred");
      handleCallEnd();
    });
  };

  const handleCallEnd = useCallback(() => {
    setIsCallInProgress(false);
    setCurrentCall(null);
    setCallDuration(0);
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }
  }, []);

  // ✅ Accept dentistId as third parameter
  const makeCall = useCallback(
    async (patientId, patientPhone, dentistId) => {
      if (!device || !isReady) {
        setError("Device not ready. Please refresh the page.");
        return;
      }

      try {
        console.log("═══════════════════════════════════════");
        console.log("📞 Initiating call...");
        console.log("Patient ID:", patientId);
        console.log("Patient Phone:", patientPhone);
        console.log("Dentist ID:", dentistId);
        console.log("═══════════════════════════════════════");

        setError(null);
        setCallDuration(0);

        // ✅ Pass DentistId to Twilio
        const call = await device.connect({
          params: {
            To: patientPhone,
            PatientId: patientId,
            DentistId: dentistId,
          },
        });

        console.log("✅ Call connecting via device.connect()");
        setCurrentCall(call);
        setIsCallInProgress(true);

        setupCallHandlers(call);

        return call;
      } catch (err) {
        console.error("❌ Error making call:", err);
        setError(err?.message || "Failed to make call");
        handleCallEnd();
      }
    },
    [device, isReady, handleCallEnd]
  );

  const endCall = useCallback(() => {
    if (currentCall) {
      console.log("📴 Ending call...");
      currentCall.disconnect();
    }
    handleCallEnd();
  }, [currentCall, handleCallEnd]);

  const toggleMute = useCallback(() => {
    if (currentCall) {
      const isMuted = currentCall.isMuted();
      currentCall.mute(!isMuted);
      console.log(isMuted ? "🔊 Unmuted" : "🔇 Muted");
      return !isMuted;
    }
    return false;
  }, [currentCall]);

  const formatDuration = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }, []);

  return {
    isReady,
    isCallInProgress,
    currentCall,
    error,
    callDuration: formatDuration(callDuration),
    makeCall,
    endCall,
    toggleMute,
  };
};
