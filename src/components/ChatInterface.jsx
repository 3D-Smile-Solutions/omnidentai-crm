// frontend/src/components/ChatInterface.jsx - FIXED BOT MESSAGE ALIGNMENT
import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRefreshDocumentUrl } from "../components/Dashboard/hooks/useDocumentUrl";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  IconButton,
  InputBase,
  Chip,
  CircularProgress,
  Alert,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import {
  AttachFile as AttachFileIcon,
  Send as SendIcon,
  MoreVert as MoreVertIcon,
  Phone as PhoneIcon,
  VideoCall as VideoCallIcon,
  ChatBubbleOutline as ChatBubbleOutlineIcon,
  InsertDriveFile as FileIcon,
  GetApp as DownloadIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Sms as SmsIcon,
} from "@mui/icons-material";
// At the top with other imports
import { useConversationControl } from "./Dashboard/hooks/useConversationControl";
import { SmartToy as BotIcon, Person as PersonIcon } from "@mui/icons-material";
import { Tooltip, Switch, FormControlLabel } from "@mui/material";
import CustomCheckbox from "./CustomCheckbox";
import TypingIndicator from "./Dashboard/TypingIndicator";
import UnifiedUploadModal from "./Dashboard/components/UploadModal/UnifiedUploadModal";
import PatientDetailsModal from "./Dashboard/components/PatientDetails/PatientDetailsModal";
import useWebSocket from "./Dashboard/hooks/useWebSocket";
import { useVoiceCall } from "./Dashboard/hooks/useVoiceCall";
import { useSMS } from "./Dashboard/hooks/useSMS";
import { useTheme } from "../context/ThemeContext";

console.log("🔥 ChatInterface.jsx LOADED - FIXED BOT ALIGNMENT VERSION");

const ChatInterface = ({ patient, onSendMessage, isMobile }) => {
  const { isDarkMode } = useTheme();
  const [message, setMessage] = useState("");
  const { refreshUrl } = useRefreshDocumentUrl();
  const [isTyping, setIsTyping] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [callDialogOpen, setCallDialogOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // SMS STATE
  const [showSMSDialog, setShowSMSDialog] = useState(false);
  const [smsContent, setSmsContent] = useState("");
  const [smsSuccess, setSmsSuccess] = useState(false);

  const [localSelectedChannels, setLocalSelectedChannels] = useState({
    sms: true,
    call: true,
    webchat: true,
  });

  const messagesEndRef = useRef(null);
  const currentUser = useSelector((state) => state.auth.user);
  const { startTyping, stopTyping } = useWebSocket();

  // SMS HOOK
  const { sendSMS, isSending: isSendingSMS, error: smsError } = useSMS();

  // Voice call hook
  const {
    isReady,
    isCallInProgress,
    currentCall,
    error: callError,
    callDuration,
    makeCall,
    endCall,
    toggleMute,
  } = useVoiceCall();

  useEffect(() => {
    console.log("📞 Voice Call State:", {
      isReady,
      isCallInProgress,
      hasCurrentCall: !!currentCall,
      callError,
      callDuration,
    });
  }, [isReady, isCallInProgress, currentCall, callError, callDuration]);

  const { currentMessages, fetchStatus, sendStatus, error } = useSelector(
    (state) => state.messages
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  const handleSendMessage = () => {
    if (patient?.id) {
      stopTyping(patient.id);
      setIsTyping(false);
    }

    if (message.trim()) {
      onSendMessage(patient.id, message, "webchat");
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);

    if (!isTyping && patient?.id && e.target.value.trim()) {
      startTyping(patient.id);
      setIsTyping(true);
    }

    if (isTyping && !e.target.value.trim() && patient?.id) {
      stopTyping(patient.id);
      setIsTyping(false);
    }
  };

  const handleSMSClick = () => {
    if (!patient?.phone) {
      alert("This patient has no phone number");
      return;
    }
    setShowSMSDialog(true);
    setSmsContent("");
    setSmsSuccess(false);
  };

  const handleSendSMS = async () => {
    if (!smsContent.trim() || !patient?.id) {
      console.warn("Cannot send SMS: missing content or patient ID");
      return;
    }

    console.log("📱 Sending SMS to patient:", patient.id);

    const result = await sendSMS(patient.id, smsContent);

    if (result.success) {
      console.log(" SMS sent successfully");
      setSmsSuccess(true);

      setTimeout(() => {
        setShowSMSDialog(false);
        setSmsContent("");
        setSmsSuccess(false);
      }, 1500);
    } else {
      console.error(" Failed to send SMS:", result.error);
    }
  };

  const handlePhoneClick = () => {
    console.log("═══════════════════════════════════════");
    console.log("📞 PHONE ICON CLICKED");
    console.log("═══════════════════════════════════════");
    console.log("Patient:", patient);
    console.log("Patient ID:", patient?.id);
    console.log("Patient Name:", patient?.first_name, patient?.last_name);
    console.log("Patient Phone:", patient?.phone);
    console.log("Current User (Dentist):", currentUser);
    console.log("Dentist ID:", currentUser?.id);
    console.log("isReady:", isReady);
    console.log("isCallInProgress:", isCallInProgress);
    console.log("═══════════════════════════════════════");

    if (!patient) {
      console.log(" No patient selected");
      alert("No patient selected");
      return;
    }

    if (!patient.phone) {
      console.log(" Patient has no phone number");
      alert("This patient has no phone number on file.");
      return;
    }

    if (!currentUser?.id) {
      console.log(" No current user/dentist ID");
      alert("Authentication error. Please refresh the page.");
      return;
    }

    if (!isReady) {
      console.log(" Voice device not ready");
      alert("Voice calling is not ready. Please refresh the page.");
      return;
    }

    if (isCallInProgress) {
      console.log("📞 Call already in progress, opening dialog");
      setCallDialogOpen(true);
      return;
    }

    const confirmed = window.confirm(
      `Call ${patient.first_name} ${patient.last_name} at ${patient.phone}?`
    );

    console.log("User confirmation:", confirmed);

    if (confirmed) {
      console.log(" User confirmed - Attempting to make call...");

      try {
        const result = makeCall(patient.id, patient.phone, currentUser.id);
        console.log(" makeCall executed, result:", result);
        setCallDialogOpen(true);
      } catch (err) {
        console.error(" Error calling makeCall:", err);
        alert(`Error making call: ${err.message}`);
      }
    } else {
      console.log(" User cancelled call");
    }
  };

  const handleEndCall = () => {
    console.log("📴 Ending call...");
    endCall();
    setCallDialogOpen(false);
    setIsMuted(false);
  };

  const handleToggleMute = () => {
    console.log("🔇 Toggling mute...");
    const newMuteState = toggleMute();
    setIsMuted(newMuteState);
    console.log("New mute state:", newMuteState);
  };
  useEffect(() => {
    console.log("🔍 Current patient:", patient);
    console.log("📋 Patient contact_id:", patient?.contact_id);
  }, [patient]);
  //  NEW: Add conversation control hook (uses contact_id)
  const {
    botPaused,
    loading: controlLoading,
    pauseBot,
    resumeBot,
  } = useConversationControl(patient?.contact_id); //  Using contact_id
  useEffect(() => {
    console.log("🎛️ Bot control state:", {
      botPaused,
      controlLoading,
      hasContactId: !!patient?.contact_id,
    });
  }, [botPaused, controlLoading, patient?.contact_id]);
  //  NEW: Handle bot control toggle
  const handleBotControlToggle = async (event) => {
    const shouldPause = event.target.checked;

    if (shouldPause) {
      const success = await pauseBot("manual_intervention");
      if (success) {
        console.log(" Bot paused - you are now in control");
      }
    } else {
      const success = await resumeBot();
      if (success) {
        console.log(" Bot resumed - bot will respond automatically");
      }
    }
  };
  const handleFileUploadComplete = (document) => {
    console.log(" File uploaded:", document);

    const fileMessage = JSON.stringify({
      type: "file",
      filename: document.filename,
      url: document.url,
      mimeType: document.mime_type,
      size: document.file_size,
      documentId: document.id,
    });

    onSendMessage(patient.id, fileMessage, "webchat");
  };

  const isFileMessage = (messageText) => {
    try {
      const parsed = JSON.parse(messageText);
      return parsed.type === "file";
    } catch {
      return false;
    }
  };

  const parseFileMessage = (messageText) => {
    try {
      return JSON.parse(messageText);
    } catch {
      return null;
    }
  };

  const renderFileAttachment = (fileData) => {
    const isImage = fileData.mimeType?.startsWith("image/");

    const handleDownload = async (e) => {
      e.stopPropagation();

      try {
        const response = await fetch(fileData.url);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileData.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Download failed:", error);
        window.open(fileData.url, "_blank");
      }
    };

    return (
      <Box
        sx={{
          maxWidth: 300,
          borderRadius: "10px",
          overflow: "hidden",
          backgroundColor: isDarkMode
            ? "rgba(100, 255, 218, 0.05)"
            : "rgba(62, 228, 200, 0.08)",
          border: isDarkMode
            ? "1px solid rgba(100, 255, 218, 0.1)"
            : "1px solid rgba(62, 228, 200, 0.1)",
        }}
      >
        {isImage ? (
          <Box>
            <Link
              href={fileData.url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ display: "block", textDecoration: "none" }}
            >
              <img
                src={fileData.url}
                alt={fileData.filename}
                style={{
                  width: "100%",
                  maxHeight: 200,
                  objectFit: "cover",
                  display: "block",
                  cursor: "pointer",
                }}
                onError={async (e) => {
                  //  ADD THIS: Auto-refresh URL when image fails to load
                  if (fileData.documentId) {
                    console.log("🔄 Chat image failed to load, refreshing URL");
                    const newUrl = await refreshUrl(fileData.documentId);
                    if (newUrl) {
                      e.target.src = newUrl;
                    }
                  }
                }}
              />
            </Link>
            {fileData.filename && (
              <Box
                sx={{
                  p: 1,
                  backgroundColor: isDarkMode
                    ? "rgba(17, 24, 39, 0.5)"
                    : "rgba(0, 0, 0, 0.3)",
                  backdropFilter: "blur(10px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: isDarkMode ? "#64ffda" : "#fff",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    flex: 1,
                  }}
                >
                  {fileData.filename}
                </Typography>
                <IconButton
                  size="small"
                  sx={{
                    color: isDarkMode ? "#64ffda" : "#fff",
                    ml: 1,
                  }}
                  onClick={handleDownload}
                >
                  <DownloadIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              p: 1.5,
              backgroundColor: isDarkMode
                ? "rgba(100, 255, 218, 0.08)"
                : "rgba(62, 228, 200, 0.1)",
              backdropFilter: "blur(5px)",
            }}
          >
            <FileIcon
              sx={{
                fontSize: 40,
                color: isDarkMode ? "#64ffda" : "#3EE4C8",
              }}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body2"
                sx={{
                  color: isDarkMode ? "#64ffda" : "#0B1929",
                  fontWeight: 500,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {fileData.filename}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: isDarkMode
                    ? "rgba(255, 255, 255, 0.5)"
                    : "rgba(11, 25, 41, 0.6)",
                }}
              >
                {formatFileSize(fileData.size)}
              </Typography>
            </Box>
            <IconButton
              size="small"
              sx={{ color: isDarkMode ? "#64ffda" : "#3EE4C8" }}
              onClick={handleDownload}
            >
              <DownloadIcon />
            </IconButton>
          </Box>
        )}
      </Box>
    );
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const getInitials = (firstName, lastName) => {
    const first = (firstName || "").trim();
    const last = (lastName || "").trim();

    if (!first && !last) return "??";
    if (first && last)
      return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
    if (first) return first.slice(0, 2).toUpperCase();
    return last.slice(0, 2).toUpperCase();
  };

  const getAvatarColor = (id) => {
    const colors = isDarkMode
      ? [
          "#64ffda",
          "#a78bfa",
          "#f472b6",
          "#60a5fa",
          "#34d399",
          "#fbbf24",
          "#f87171",
          "#a3e635",
        ]
      : [
          "#3EE4C8",
          "#2BC4A8",
          "#62E4C8",
          "#45D4B8",
          "#4ECDC4",
          "#38C9B4",
          "#2BB4A4",
          "#1FA494",
        ];
    return colors[id % colors.length];
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year:
          date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  const groupMessagesByDate = (messages) => {
    const groups = [];
    let currentDate = null;

    messages.forEach((msg) => {
      const msgDate = formatDate(msg.timestamp);
      if (msgDate !== currentDate) {
        currentDate = msgDate;
        groups.push({ type: "date", date: msgDate });
      }
      groups.push({ type: "message", ...msg });
    });

    return groups;
  };

  const renderError = (error) => {
    if (typeof error === "string") return error;
    if (error && typeof error === "object") {
      return error.message || error.error || JSON.stringify(error);
    }
    return "An error occurred";
  };

  const handleLocalChannelChange = (channel, checked) => {
    setLocalSelectedChannels((prev) => ({
      ...prev,
      [channel]: checked,
    }));
  };

  //  FIXED: Determine if message should appear on RIGHT side
  // Bot messages AND dentist messages go on the right
  const isOwnMessage = (sender) => {
    return sender === "dentist" || sender === "bot";
  };

  //  NEW: Get background color based on sender
  const getMessageBackgroundColor = (sender) => {
    if (sender === "dentist") {
      // Dentist messages - Teal
      return isDarkMode
        ? "rgba(100, 255, 218, 0.15)"
        : "rgba(62, 228, 200, 0.2)";
    } else if (sender === "bot") {
      // Bot messages - Blue
      return isDarkMode
        ? "rgba(96, 165, 250, 0.15)"
        : "rgba(33, 150, 243, 0.15)";
    } else {
      // Patient messages - Gray
      return isDarkMode ? "rgba(17, 24, 39, 0.4)" : "rgba(255, 255, 255, 0.6)";
    }
  };

  //  NEW: Get border color based on sender
  const getMessageBorderColor = (sender) => {
    if (sender === "dentist") {
      return isDarkMode
        ? "1px solid rgba(100, 255, 218, 0.2)"
        : "1px solid rgba(62, 228, 200, 0.25)";
    } else if (sender === "bot") {
      return isDarkMode
        ? "1px solid rgba(96, 165, 250, 0.2)"
        : "1px solid rgba(33, 150, 243, 0.25)";
    } else {
      return isDarkMode
        ? "1px solid rgba(100, 255, 218, 0.1)"
        : "1px solid rgba(62, 228, 200, 0.15)";
    }
  };

  if (!patient) {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: isDarkMode
            ? "rgba(17, 24, 39, 0.25)"
            : "rgba(255, 255, 255, 0.25)",
          backdropFilter: "blur(20px)",
          borderRadius: isMobile ? "16px" : "0 16px 16px 0",
          position: "relative",
          overflow: "hidden",
          height: "100%",
          minHeight: "100%",
          border: isDarkMode
            ? "1px solid rgba(100, 255, 218, 0.1)"
            : "1px solid rgba(62, 228, 200, 0.1)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: isDarkMode
              ? "linear-gradient(135deg, rgba(100, 255, 218, 0.02) 0%, rgba(167, 139, 250, 0.02) 100%)"
              : "linear-gradient(135deg, rgba(62, 228, 200, 0.03) 0%, rgba(43, 196, 168, 0.03) 100%)",
            pointerEvents: "none",
          }}
        />

        <Box
          sx={{
            textAlign: "center",
            zIndex: 1,
            p: 4,
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              backgroundColor: isDarkMode
                ? "rgba(100, 255, 218, 0.1)"
                : "rgba(62, 228, 200, 0.15)",
              backdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
              border: isDarkMode
                ? "1px solid rgba(100, 255, 218, 0.2)"
                : "1px solid rgba(62, 228, 200, 0.2)",
            }}
          >
            <ChatBubbleOutlineIcon
              sx={{
                fontSize: 40,
                color: isDarkMode ? "#64ffda" : "#3EE4C8",
                opacity: 0.9,
              }}
            />
          </Box>

          <Typography
            variant="h5"
            sx={{
              color: isDarkMode
                ? "rgba(255, 255, 255, 0.4)"
                : "rgba(11, 25, 41, 0.4)",
              fontWeight: 600,
              mb: 1,
              letterSpacing: "-0.02em",
            }}
          >
            No Conversation Selected
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: isDarkMode
                ? "rgba(255, 255, 255, 0.35)"
                : "rgba(11, 25, 41, 0.35)",
              maxWidth: 300,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Choose a patient from the list to view and manage their
            conversations across all channels
          </Typography>
        </Box>
      </Box>
    );
  }

  const safeCurrentMessages = Array.isArray(currentMessages)
    ? currentMessages
    : [];
  const filteredMessages = safeCurrentMessages.filter(
    (msg) => localSelectedChannels[msg.channel]
  );
  const groupedMessages = groupMessagesByDate(filteredMessages);

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: isMobile ? "calc(100vh - 200px)" : "100%",
        background: isDarkMode
          ? "rgba(17, 24, 39, 0.25)"
          : "rgba(255, 255, 255, 0.25)",
        backdropFilter: "blur(20px)",
        borderRadius: isMobile ? "16px" : "0 16px 16px 0",
        overflow: "hidden",
        border: isDarkMode
          ? "1px solid rgba(100, 255, 218, 0.1)"
          : "1px solid rgba(62, 228, 200, 0.1)",
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isDarkMode
            ? "linear-gradient(135deg, rgba(100, 255, 218, 0.02) 0%, rgba(167, 139, 250, 0.02) 100%)"
            : "linear-gradient(135deg, rgba(62, 228, 200, 0.03) 0%, rgba(43, 196, 168, 0.03) 100%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: isMobile ? 1.5 : 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: isDarkMode
            ? "1px solid rgba(100, 255, 218, 0.1)"
            : "1px solid rgba(62, 228, 200, 0.1)",
          background: isDarkMode
            ? "rgba(17, 24, 39, 0.3)"
            : "rgba(255, 255, 255, 0.3)",
          backdropFilter: "blur(10px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Left side - Patient info */}
        <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
          <Avatar
            sx={{
              bgcolor: getAvatarColor(patient.id),
              width: isMobile ? 36 : 40,
              height: isMobile ? 36 : 40,
              mr: isMobile ? 1.5 : 2,
              fontSize: isMobile ? "0.9rem" : "1rem",
              border: isDarkMode
                ? "2px solid rgba(100, 255, 218, 0.2)"
                : "2px solid rgba(62, 228, 200, 0.2)",
            }}
          >
            {getInitials(
              patient.first_name || patient.firstName,
              patient.last_name || patient.lastName
            )}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant={isMobile ? "body2" : "subtitle1"}
              sx={{
                fontWeight: 600,
                color: isDarkMode ? "#64ffda" : "#0B1929",
              }}
            >
              {patient.first_name || patient.firstName}{" "}
              {patient.last_name || patient.lastName}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: isDarkMode
                  ? "rgba(255, 255, 255, 0.5)"
                  : "rgba(11, 25, 41, 0.6)",
                fontSize: isMobile ? "0.7rem" : "0.75rem",
              }}
            >
              Patient ID: {patient.id.substring(0, 8)}...
            </Typography>
          </Box>
        </Box>

        {/* Right side - Bot control toggle + Action buttons */}
        <Box
          sx={{
            display: "flex",
            gap: isMobile ? 0.5 : 1,
            alignItems: "center",
          }}
        >
          {/*  NEW: Bot Control Toggle */}
          <Tooltip
            title={
              botPaused
                ? "Manual Mode: You're responding to patient messages"
                : "Auto Mode: Bot is responding automatically"
            }
            placement="bottom"
            arrow
          >
            <FormControlLabel
              control={
                <Switch
                  checked={botPaused}
                  onChange={handleBotControlToggle}
                  disabled={controlLoading || !patient?.contact_id}
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": {
                      color: isDarkMode ? "#64ffda" : "#3EE4C8",
                    },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: isDarkMode ? "#64ffda" : "#3EE4C8",
                    },
                    "& .MuiSwitch-track": {
                      backgroundColor: isDarkMode
                        ? "rgba(255, 255, 255, 0.3)"
                        : "rgba(11, 25, 41, 0.3)",
                    },
                  }}
                />
              }
              label={
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    minWidth: isMobile ? 65 : 75,
                    ml: isMobile ? -0.5 : 0,
                  }}
                >
                  {botPaused ? (
                    <PersonIcon
                      fontSize="small"
                      sx={{
                        color: isDarkMode ? "#64ffda" : "#3EE4C8",
                        fontSize: isMobile ? "1rem" : "1.2rem",
                      }}
                    />
                  ) : (
                    <BotIcon
                      fontSize="small"
                      sx={{
                        color: isDarkMode
                          ? "rgba(255, 255, 255, 0.6)"
                          : "rgba(11, 25, 41, 0.6)",
                        fontSize: isMobile ? "1rem" : "1.2rem",
                      }}
                    />
                  )}
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 600,
                      fontSize: isMobile ? "0.7rem" : "0.75rem",
                      color: botPaused
                        ? isDarkMode
                          ? "#64ffda"
                          : "#3EE4C8"
                        : isDarkMode
                        ? "rgba(255, 255, 255, 0.6)"
                        : "rgba(11, 25, 41, 0.6)",
                      transition: "color 0.25s ease",
                    }}
                  >
                    {botPaused ? "Manual" : "Auto"}
                  </Typography>
                </Box>
              }
              labelPlacement="start"
              sx={{
                mr: isMobile ? 0.5 : 1.5,
                ml: 0,
                "& .MuiFormControlLabel-label": {
                  ml: 0,
                },
              }}
            />
          </Tooltip>

          {/* Divider (optional visual separator) */}
          {!isMobile && (
            <Box
              sx={{
                width: "1px",
                height: 32,
                backgroundColor: isDarkMode
                  ? "rgba(100, 255, 218, 0.1)"
                  : "rgba(62, 228, 200, 0.1)",
                mx: 0.5,
              }}
            />
          )}

          {/* Phone Call Button */}
          <IconButton
            sx={{
              color: isCallInProgress
                ? "#64ffda"
                : isDarkMode
                ? "rgba(255, 255, 255, 0.6)"
                : "rgba(11, 25, 41, 0.6)",
              backgroundColor: isDarkMode
                ? "rgba(100, 255, 218, 0.05)"
                : "rgba(62, 228, 200, 0.08)",
              "&:hover": {
                color: isDarkMode ? "#64ffda" : "#3EE4C8",
                backgroundColor: isDarkMode
                  ? "rgba(100, 255, 218, 0.1)"
                  : "rgba(62, 228, 200, 0.15)",
              },
              "&:disabled": {
                color: isDarkMode
                  ? "rgba(255, 255, 255, 0.3)"
                  : "rgba(11, 25, 41, 0.3)",
              },
              transition: "all 0.25s ease",
            }}
            onClick={handlePhoneClick}
            disabled={!isReady || !patient?.phone}
            title={
              !isReady
                ? "Voice calling initializing..."
                : !patient?.phone
                ? "No phone number"
                : "Call patient"
            }
          >
            <PhoneIcon fontSize={isMobile ? "small" : "medium"} />
          </IconButton>

          {/* SMS Button */}
          <IconButton
            onClick={handleSMSClick}
            disabled={!patient?.phone}
            title={patient?.phone ? "Send SMS" : "No phone number"}
            sx={{
              color: isDarkMode
                ? "rgba(255, 255, 255, 0.6)"
                : "rgba(11, 25, 41, 0.6)",
              backgroundColor: isDarkMode
                ? "rgba(100, 255, 218, 0.05)"
                : "rgba(62, 228, 200, 0.08)",
              "&:hover": {
                backgroundColor: isDarkMode
                  ? "rgba(100, 255, 218, 0.1)"
                  : "rgba(62, 228, 200, 0.15)",
                color: isDarkMode ? "#64ffda" : "#3EE4C8",
              },
              "&:disabled": {
                color: isDarkMode
                  ? "rgba(255, 255, 255, 0.3)"
                  : "rgba(11, 25, 41, 0.3)",
              },
              transition: "all 0.25s ease",
            }}
          >
            <SmsIcon fontSize={isMobile ? "small" : "medium"} />
          </IconButton>

          {/* More Options Button */}
          <IconButton
            sx={{
              color: isDarkMode
                ? "rgba(255, 255, 255, 0.6)"
                : "rgba(11, 25, 41, 0.6)",
              backgroundColor: isDarkMode
                ? "rgba(100, 255, 218, 0.05)"
                : "rgba(62, 228, 200, 0.08)",
              "&:hover": {
                backgroundColor: isDarkMode
                  ? "rgba(100, 255, 218, 0.1)"
                  : "rgba(62, 228, 200, 0.15)",
                color: isDarkMode ? "#64ffda" : "#3EE4C8",
              },
              transition: "all 0.25s ease",
            }}
            onClick={() => setDetailsModalOpen(true)}
          >
            <MoreVertIcon fontSize={isMobile ? "small" : "medium"} />
          </IconButton>
        </Box>
      </Paper>

      {/* Messages Area */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          p: 2,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          zIndex: 1,
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: isDarkMode
              ? "rgba(100, 255, 218, 0.05)"
              : "rgba(62, 228, 200, 0.05)",
          },
          "&::-webkit-scrollbar-thumb": {
            background: isDarkMode
              ? "rgba(100, 255, 218, 0.3)"
              : "rgba(62, 228, 200, 0.3)",
            borderRadius: "3px",
            "&:hover": {
              background: isDarkMode
                ? "rgba(100, 255, 218, 0.5)"
                : "rgba(62, 228, 200, 0.5)",
            },
          },
        }}
      >
        {fetchStatus === "loading" && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
            }}
          >
            <CircularProgress
              sx={{ color: isDarkMode ? "#64ffda" : "#3EE4C8" }}
            />
          </Box>
        )}

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              backgroundColor: isDarkMode
                ? "rgba(248, 113, 113, 0.1)"
                : "rgba(239, 68, 68, 0.1)",
              color: isDarkMode ? "#f87171" : "#dc2626",
            }}
          >
            {renderError(error)}
          </Alert>
        )}

        {fetchStatus !== "loading" &&
          groupedMessages.map((item, index) => {
            if (item.type === "date") {
              return (
                <Box
                  key={`date-${index}`}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    my: 2,
                  }}
                >
                  <Chip
                    label={item.date}
                    size="small"
                    sx={{
                      backgroundColor: isDarkMode
                        ? "rgba(100, 255, 218, 0.1)"
                        : "rgba(62, 228, 200, 0.1)",
                      color: isDarkMode
                        ? "rgba(255, 255, 255, 0.7)"
                        : "rgba(11, 25, 41, 0.7)",
                      fontSize: "0.75rem",
                      backdropFilter: "blur(5px)",
                    }}
                  />
                </Box>
              );
            }

            //  FIXED: Check if message is from bot OR dentist for positioning
            const isStaff = isOwnMessage(item.sender);
            const isFile = isFileMessage(item.message);
            const fileData = isFile ? parseFileMessage(item.message) : null;

            return (
              <Box
                key={item.id}
                sx={{
                  display: "flex",
                  justifyContent: isStaff ? "flex-end" : "flex-start",
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-end",
                    maxWidth: "70%",
                    flexDirection: isStaff ? "row-reverse" : "row",
                  }}
                >
                  {!isStaff && (
                    <Avatar
                      sx={{
                        bgcolor: getAvatarColor(patient.id),
                        width: 32,
                        height: 32,
                        mr: 1,
                        fontSize: "0.9rem",
                        border: isDarkMode
                          ? "1px solid rgba(100, 255, 218, 0.2)"
                          : "1px solid rgba(62, 228, 200, 0.2)",
                      }}
                    >
                      {getInitials(
                        patient.first_name || patient.firstName,
                        patient.last_name || patient.lastName
                      )}
                    </Avatar>
                  )}
                  <Box>
                    <Paper
                      elevation={0}
                      sx={{
                        p: isFile ? 0.5 : 1.5,
                        backgroundColor: getMessageBackgroundColor(item.sender),
                        backdropFilter: "blur(10px)",
                        color: isStaff
                          ? isDarkMode
                            ? "#ffffff"
                            : "#0B1929"
                          : isDarkMode
                          ? "rgba(255, 255, 255, 0.9)"
                          : "#0B1929",
                        border: getMessageBorderColor(item.sender),
                        borderRadius: 2,
                        borderTopLeftRadius: isStaff ? 16 : 4,
                        borderTopRightRadius: isStaff ? 4 : 16,
                      }}
                    >
                      {/*  NEW: Bot label */}
                      {item.sender === "bot" && (
                        <Typography
                          variant="caption"
                          sx={{
                            display: "block",
                            fontSize: "0.7rem",
                            fontWeight: 600,
                            mb: 0.5,
                            color: isDarkMode ? "#60a5fa" : "#1976D2",
                            opacity: 0.9,
                          }}
                        >
                          OmniDent AI
                        </Typography>
                      )}

                      {isFile && fileData ? (
                        renderFileAttachment(fileData)
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{ whiteSpace: "pre-wrap" }}
                        >
                          {typeof item.message === "object"
                            ? Object.values(item.message).join("\n\n")
                            : item.message}
                        </Typography>
                      )}
                    </Paper>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: isStaff ? "flex-end" : "flex-start",
                        gap: 1,
                        mt: 0.5,
                        px: 0.5,
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: isDarkMode
                            ? "rgba(255, 255, 255, 0.5)"
                            : "rgba(11, 25, 41, 0.5)",
                          fontSize: "0.7rem",
                        }}
                      >
                        {formatTime(item.timestamp)}
                      </Typography>
                      {/*  ENHANCED: Channel badge with icons */}
                      <Chip
                        label={
                          item.channel === "sms"
                            ? "SMS"
                            : item.channel === "call"
                            ? "Call"
                            : "Webchat"
                        }
                        size="small"
                        sx={{
                          height: 16,
                          fontSize: "0.65rem",
                          backgroundColor:
                            item.channel === "sms"
                              ? isDarkMode
                                ? "rgba(52, 211, 153, 0.15)"
                                : "rgba(46, 125, 50, 0.1)"
                              : item.channel === "call"
                              ? isDarkMode
                                ? "rgba(96, 165, 250, 0.15)"
                                : "rgba(33, 150, 243, 0.1)"
                              : isDarkMode
                              ? "rgba(167, 139, 250, 0.15)"
                              : "rgba(156, 39, 176, 0.1)",
                          color:
                            item.channel === "sms"
                              ? isDarkMode
                                ? "#34d399"
                                : "#2E7D32"
                              : item.channel === "call"
                              ? isDarkMode
                                ? "#60a5fa"
                                : "#1976D2"
                              : isDarkMode
                              ? "#a78bfa"
                              : "#7B1FA2",
                          "& .MuiChip-label": {
                            px: 0.5,
                          },
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
            );
          })}

        <TypingIndicator patientId={patient?.id} />

        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Paper
        elevation={0}
        sx={{
          p: isMobile ? 1.5 : 2,
          borderTop: isDarkMode
            ? "1px solid rgba(100, 255, 218, 0.1)"
            : "1px solid rgba(62, 228, 200, 0.1)",
          background: isDarkMode
            ? "rgba(17, 24, 39, 0.3)"
            : "rgba(255, 255, 255, 0.3)",
          backdropFilter: "blur(10px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: isMobile ? 0.75 : 1.5,
            mb: isMobile ? 0.75 : 1.5,
            alignItems: "center",
            flexWrap: isMobile ? "wrap" : "nowrap",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: isDarkMode
                ? "rgba(255, 255, 255, 0.6)"
                : "rgba(11, 25, 41, 0.6)",
              fontWeight: 600,
              fontSize: isMobile ? "0.65rem" : "0.75rem",
            }}
          >
            Filter:
          </Typography>
          <CustomCheckbox
            checked={localSelectedChannels.sms}
            onChange={(e) => handleLocalChannelChange("sms", e.target.checked)}
            label="SMS"
          />
          <CustomCheckbox
            checked={localSelectedChannels.call}
            onChange={(e) => handleLocalChannelChange("call", e.target.checked)}
            label="Call"
          />
          <CustomCheckbox
            checked={localSelectedChannels.webchat}
            onChange={(e) =>
              handleLocalChannelChange("webchat", e.target.checked)
            }
            label="Webchat"
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            gap: isMobile ? 0.5 : 1,
            p: isMobile ? 0.75 : 1,
            border: isDarkMode
              ? "1px solid rgba(100, 255, 218, 0.15)"
              : "1px solid rgba(62, 228, 200, 0.2)",
            borderRadius: "10px",
            backgroundColor: isDarkMode
              ? "rgba(100, 255, 218, 0.03)"
              : "rgba(62, 228, 200, 0.03)",
            backdropFilter: "blur(5px)",
          }}
        >
          <IconButton
            size={isMobile ? "small" : "medium"}
            onClick={() => setUploadModalOpen(true)}
            sx={{
              color: isDarkMode
                ? "rgba(255, 255, 255, 0.6)"
                : "rgba(11, 25, 41, 0.6)",
              "&:hover": {
                color: isDarkMode ? "#64ffda" : "#3EE4C8",
              },
            }}
            aria-label="attach file"
          >
            <AttachFileIcon fontSize={isMobile ? "small" : "medium"} />
          </IconButton>
          <InputBase
            sx={{
              flex: 1,
              color: isDarkMode ? "rgba(255, 255, 255, 0.9)" : "#0B1929",
              fontSize: isMobile ? "0.875rem" : "1rem",
              "& ::placeholder": {
                color: isDarkMode
                  ? "rgba(255, 255, 255, 0.5)"
                  : "rgba(11, 25, 41, 0.5)",
                fontSize: isMobile ? "0.875rem" : "1rem",
              },
            }}
            placeholder="Type a message..."
            multiline
            maxRows={isMobile ? 3 : 4}
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={sendStatus === "loading"}
          />
          <IconButton
            size={isMobile ? "small" : "medium"}
            onClick={handleSendMessage}
            disabled={!message.trim() || sendStatus === "loading"}
            sx={{
              color:
                message.trim() && sendStatus !== "loading"
                  ? isDarkMode
                    ? "#64ffda"
                    : "#3EE4C8"
                  : isDarkMode
                  ? "rgba(255, 255, 255, 0.3)"
                  : "rgba(11, 25, 41, 0.3)",
              "&:hover": {
                color:
                  message.trim() && sendStatus !== "loading"
                    ? isDarkMode
                      ? "#64ffda"
                      : "#2BC4A8"
                    : isDarkMode
                    ? "rgba(255, 255, 255, 0.3)"
                    : "rgba(11, 25, 41, 0.3)",
              },
              "&.Mui-disabled": {
                color: isDarkMode
                  ? "rgba(255, 255, 255, 0.3)"
                  : "rgba(11, 25, 41, 0.3)",
              },
            }}
            aria-label="send message"
          >
            {sendStatus === "loading" ? (
              <CircularProgress
                size={20}
                sx={{ color: isDarkMode ? "#64ffda" : "#3EE4C8" }}
              />
            ) : (
              <SendIcon fontSize={isMobile ? "small" : "medium"} />
            )}
          </IconButton>
        </Box>
      </Paper>

      {/* UnifiedUploadModal */}
      <UnifiedUploadModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUploadComplete={handleFileUploadComplete}
        documentType="chat_attachment"
        category="chat"
        title="Upload Chat Attachment"
        allowedTypes="all"
        patientId={patient.id}
      />

      {/* Patient Details Modal */}
      <PatientDetailsModal
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        patient={patient}
      />

      {/* Voice Call Dialog */}
      <Dialog
        open={callDialogOpen}
        onClose={() => !isCallInProgress && setCallDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: isDarkMode
              ? "rgba(17, 24, 39, 0.95)"
              : "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            border: isDarkMode
              ? "1px solid rgba(100, 255, 218, 0.1)"
              : "1px solid rgba(62, 228, 200, 0.1)",
          },
        }}
      >
        <DialogTitle sx={{ color: isDarkMode ? "#64ffda" : "#0B1929" }}>
          {isCallInProgress ? "Call in Progress" : "Calling..."}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: "center", py: 3 }}>
            <Avatar
              sx={{
                bgcolor: getAvatarColor(patient?.id || 0),
                width: 80,
                height: 80,
                margin: "0 auto 16px",
                fontSize: "2rem",
                border: isDarkMode
                  ? "2px solid rgba(100, 255, 218, 0.2)"
                  : "2px solid rgba(62, 228, 200, 0.2)",
              }}
            >
              {getInitials(patient?.first_name || "", patient?.last_name || "")}
            </Avatar>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: isDarkMode ? "#ffffff" : "#0B1929" }}
            >
              {patient?.first_name} {patient?.last_name}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              gutterBottom
              sx={{
                color: isDarkMode
                  ? "rgba(255, 255, 255, 0.6)"
                  : "rgba(11, 25, 41, 0.6)",
              }}
            >
              {patient?.phone}
            </Typography>

            {isCallInProgress && (
              <Box sx={{ mt: 3 }}>
                <Typography
                  variant="h4"
                  sx={{
                    color: isDarkMode ? "#64ffda" : "#3EE4C8",
                    fontWeight: 600,
                  }}
                >
                  {callDuration}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: isDarkMode
                      ? "rgba(255, 255, 255, 0.5)"
                      : "rgba(11, 25, 41, 0.5)",
                  }}
                >
                  Duration
                </Typography>
              </Box>
            )}

            {callError && (
              <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                {callError}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          {isCallInProgress && (
            <Button
              variant="outlined"
              startIcon={isMuted ? <MicOffIcon /> : <MicIcon />}
              onClick={handleToggleMute}
              sx={{
                borderColor: isDarkMode ? "#64ffda" : "#3EE4C8",
                color: isMuted ? "#FF6B6B" : isDarkMode ? "#64ffda" : "#3EE4C8",
                "&:hover": {
                  borderColor: isDarkMode ? "#64ffda" : "#2BC4A8",
                  backgroundColor: isDarkMode
                    ? "rgba(100, 255, 218, 0.1)"
                    : "rgba(62, 228, 200, 0.1)",
                },
              }}
            >
              {isMuted ? "Unmute" : "Mute"}
            </Button>
          )}
          <Button
            variant="contained"
            color="error"
            onClick={handleEndCall}
            disabled={!isCallInProgress}
          >
            {isCallInProgress ? "End Call" : "Cancel"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* SMS Dialog */}
      <Dialog
        open={showSMSDialog}
        onClose={() => !isSendingSMS && setShowSMSDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: isDarkMode
              ? "rgba(17, 24, 39, 0.95)"
              : "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            border: isDarkMode
              ? "1px solid rgba(100, 255, 218, 0.1)"
              : "1px solid rgba(62, 228, 200, 0.1)",
          },
        }}
      >
        <DialogTitle sx={{ color: isDarkMode ? "#64ffda" : "#0B1929" }}>
          Send SMS to {patient?.first_name} {patient?.last_name}
        </DialogTitle>

        <DialogContent>
          {patient?.phone && (
            <Typography
              variant="body2"
              sx={{
                mb: 2,
                color: isDarkMode
                  ? "rgba(255, 255, 255, 0.6)"
                  : "rgba(11, 25, 41, 0.6)",
                fontSize: "0.875rem",
              }}
            >
              To: {patient.phone}
            </Typography>
          )}

          <TextField
            autoFocus
            multiline
            rows={4}
            fullWidth
            label="Message"
            value={smsContent}
            onChange={(e) => setSmsContent(e.target.value)}
            disabled={isSendingSMS || smsSuccess}
            placeholder="Type your SMS message..."
            inputProps={{ maxLength: 1600 }}
            helperText={`${smsContent.length}/1600 characters`}
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                color: isDarkMode ? "#ffffff" : "#0B1929",
                "& fieldset": {
                  borderColor: isDarkMode
                    ? "rgba(100, 255, 218, 0.2)"
                    : "rgba(62, 228, 200, 0.2)",
                },
                "&:hover fieldset": {
                  borderColor: isDarkMode ? "#64ffda" : "#3EE4C8",
                },
                "&.Mui-focused fieldset": {
                  borderColor: isDarkMode ? "#64ffda" : "#3EE4C8",
                },
              },
              "& .MuiInputLabel-root": {
                color: isDarkMode
                  ? "rgba(255, 255, 255, 0.6)"
                  : "rgba(11, 25, 41, 0.6)",
              },
              "& .MuiFormHelperText-root": {
                color: isDarkMode
                  ? "rgba(255, 255, 255, 0.5)"
                  : "rgba(11, 25, 41, 0.5)",
              },
            }}
          />

          {smsError && (
            <Alert
              severity="error"
              sx={{
                mt: 2,
                backgroundColor: isDarkMode
                  ? "rgba(248, 113, 113, 0.1)"
                  : "rgba(239, 68, 68, 0.1)",
                color: isDarkMode ? "#f87171" : "#dc2626",
              }}
            >
              {smsError}
            </Alert>
          )}

          {smsSuccess && (
            <Alert
              severity="success"
              sx={{
                mt: 2,
                backgroundColor: isDarkMode
                  ? "rgba(52, 211, 153, 0.1)"
                  : "rgba(76, 175, 80, 0.1)",
                color: isDarkMode ? "#34d399" : "#388E3C",
              }}
            >
              SMS sent successfully!
            </Alert>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setShowSMSDialog(false)}
            disabled={isSendingSMS}
            sx={{
              color: isDarkMode
                ? "rgba(255, 255, 255, 0.6)"
                : "rgba(11, 25, 41, 0.6)",
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSendSMS}
            variant="contained"
            disabled={!smsContent.trim() || isSendingSMS || smsSuccess}
            startIcon={
              isSendingSMS ? (
                <CircularProgress size={20} color="inherit" />
              ) : smsSuccess ? (
                ""
              ) : (
                <SmsIcon />
              )
            }
            sx={{
              backgroundColor: isDarkMode ? "#64ffda" : "#3EE4C8",
              color: isDarkMode ? "#0B1929" : "#ffffff",
              "&:hover": {
                backgroundColor: isDarkMode ? "#52d4c2" : "#2BC4A8",
              },
              "&:disabled": {
                backgroundColor: isDarkMode
                  ? "rgba(100, 255, 218, 0.3)"
                  : "rgba(62, 228, 200, 0.3)",
                color: isDarkMode
                  ? "rgba(11, 25, 41, 0.5)"
                  : "rgba(255, 255, 255, 0.5)",
              },
            }}
          >
            {isSendingSMS ? "Sending..." : smsSuccess ? "Sent!" : "Send SMS"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChatInterface;
