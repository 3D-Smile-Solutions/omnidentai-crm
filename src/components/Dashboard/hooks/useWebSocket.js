// frontend/src/components/Dashboard/hooks/useWebSocket.js
import { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { WEBSOCKET_URL } from "../../../config/api";
import { addMessage } from "../../../redux/slices/messageSlice";
import { updatePatientLastMessage } from "../../../redux/slices/patientSlice";
import { setUserTyping } from "../../../redux/slices/typingSlice";

// ✅ SINGLETON: Global socket instance (outside component)
let globalSocket = null;
let globalSocketToken = null;
let isConnecting = false;
let listenersAttached = false; // ✅ NEW: Prevent duplicate listeners
let connectionId = 0;

// ✅ Store dispatch reference globally for event handlers
let globalDispatch = null;

const useWebSocket = () => {
  const dispatch = useDispatch();
  const { session } = useSelector((state) => state.auth);

  // ✅ Update global dispatch reference
  globalDispatch = dispatch;

  useEffect(() => {
    const token = session?.access_token;
    
    // No token - don't connect
    if (!token) {
      console.log("⏳ No access token - WebSocket not connecting");
      return;
    }

    // ✅ Already connected with same token - just return (don't add more listeners)
    if (globalSocket?.connected && globalSocketToken === token) {
      console.log("♻️ Reusing existing WebSocket connection");
      return;
    }

    // Currently connecting - skip
    if (isConnecting) {
      console.log("⏳ Connection already in progress, skipping...");
      return;
    }

    // Token changed - disconnect old socket first
    if (globalSocket && globalSocketToken !== token) {
      console.log("🔄 Token changed, disconnecting old socket...");
      globalSocket.disconnect();
      globalSocket = null;
      globalSocketToken = null;
      listenersAttached = false; // ✅ Reset listeners flag
    }

    // ✅ Socket exists but not connected - wait for reconnection
    if (globalSocket && !globalSocket.connected) {
      console.log("⏳ Socket exists, waiting for reconnection...");
      return;
    }

    isConnecting = true;
    connectionId++;
    const currentConnectionId = connectionId;
    
    console.log(`🔌 Creating WebSocket connection #${currentConnectionId} to:`, WEBSOCKET_URL);

    const socket = io(WEBSOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log(`✅ WebSocket #${currentConnectionId} connected:`, socket.id);
      isConnecting = false;
      globalSocket = socket;
      globalSocketToken = token;
    });

    socket.on("disconnect", (reason) => {
      console.log(`🔌 WebSocket #${currentConnectionId} disconnected:`, reason);
      isConnecting = false;
    });

    socket.on("connect_error", (error) => {
      console.error(`❌ WebSocket #${currentConnectionId} error:`, error.message);
      isConnecting = false;
    });

    // ✅ ATTACH LISTENERS ONLY ONCE
    if (!listenersAttached) {
      console.log("📡 Attaching WebSocket event listeners (once)");
      
      socket.on("new_message", (message) => {
        console.log("📨 New message received via WebSocket:", message);

        if (globalDispatch) {
          globalDispatch(
            addMessage({
              patientId: message.patientId,
              message: message,
            })
          );

          globalDispatch(
            updatePatientLastMessage({
              patientId: message.patientId,
              lastMessage: message.message,
              lastMessageTime: message.timestamp,
              lastMessageChannel: message.channel,
            })
          );
        }
      });

      socket.on("message_sent", (message) => {
        console.log("✅ Message sent confirmation:", message);

        if (globalDispatch) {
          globalDispatch(
            updatePatientLastMessage({
              patientId: message.patientId,
              lastMessage: message.message,
              lastMessageTime: message.timestamp,
              lastMessageChannel: message.channel,
            })
          );
        }
      });

      socket.on("message_error", (error) => {
        console.error("❌ Message error:", error);
      });

      socket.on("user_typing", (data) => {
        const { userId, userEmail, isTyping, patientId } = data;
        if (globalDispatch) {
          globalDispatch(setUserTyping({ patientId, userId, userEmail, isTyping }));
        }
      });

      socket.on("messages_read", (data) => {
        console.log("👁️ Messages read:", data);
      });

      listenersAttached = true; // ✅ Mark listeners as attached
    }

    // Store reference
    globalSocket = socket;
    globalSocketToken = token;

    // Cleanup - DON'T disconnect, just log
    return () => {
      console.log(`🧹 Cleanup called for connection #${currentConnectionId}`);
      // Don't disconnect or reset listenersAttached here
    };
  }, [session?.access_token]);

  // ==========================================
  // SOCKET UTILITY FUNCTIONS
  // ==========================================

  const isConnected = globalSocket?.connected || false;

  const joinPatientConversation = useCallback((patientId) => {
    if (globalSocket?.connected && patientId) {
      globalSocket.emit("join_patient_conversation", patientId);
    }
  }, []);

  const leavePatientConversation = useCallback((patientId) => {
    if (globalSocket?.connected && patientId) {
      globalSocket.emit("leave_patient_conversation", patientId);
    }
  }, []);

  const sendMessageViaWebSocket = useCallback((patientId, content, channelType = "webchat") => {
    if (!globalSocket?.connected) {
      console.warn("⚠️ WebSocket not connected, message not sent");
      return false;
    }

    if (!patientId || !content?.trim()) {
      console.error("❌ Invalid message data");
      return false;
    }

    console.log(`📤 Sending message via WebSocket to patient ${patientId}`);
    globalSocket.emit("send_message", {
      patientId,
      content: content.trim(),
      channelType,
    });

    return true;
  }, []);

  const startTyping = useCallback((patientId) => {
    if (globalSocket?.connected && patientId) {
      globalSocket.emit("typing_start", { patientId });
    }
  }, []);

  const stopTyping = useCallback((patientId) => {
    if (globalSocket?.connected && patientId) {
      globalSocket.emit("typing_stop", { patientId });
    }
  }, []);

  const markMessagesAsRead = useCallback((patientId) => {
    if (globalSocket?.connected && patientId) {
      globalSocket.emit("mark_messages_read", { patientId });
    }
  }, []);

  // Force disconnect (call on logout)
  const disconnect = useCallback(() => {
    if (globalSocket) {
      console.log("🔌 Force disconnecting WebSocket");
      globalSocket.disconnect();
      globalSocket = null;
      globalSocketToken = null;
      listenersAttached = false; // ✅ Reset for next login
    }
  }, []);

  return {
    isConnected,
    joinPatientConversation,
    leavePatientConversation,
    sendMessageViaWebSocket,
    startTyping,
    stopTyping,
    markMessagesAsRead,
    disconnect,
  };
};

export default useWebSocket;