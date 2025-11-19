import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Chip,
  InputBase,
  IconButton,
  Paper,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useTheme } from "../context/ThemeContext";
// helper function for file formatting
const formatFileMessage = (message) => {
  try {
    const parsed = JSON.parse(message);
    if (parsed.type === "file" && parsed.filename) {
      const isImage = parsed.mimeType?.startsWith("image/");
      const isPDF = parsed.mimeType === "application/pdf";

      const icon = isImage ? "🖼️" : isPDF ? "📄" : "📎";
      return `${icon} ${parsed.filename}`;
    }
  } catch {
    // Not JSON, return original
  }
  return message;
};
const PatientList = ({
  patients = [],
  selectedPatient,
  onSelectPatient,
  isMobile,
}) => {
  const { isDarkMode } = useTheme();
  const [query, setQuery] = useState("");

  useEffect(() => {
    console.log("🔍 REDUX STATE CHECK:", {
      patientsCount: patients.length,
      firstPatient: patients[0]
        ? {
            id: patients[0].id,
            first_name: patients[0].first_name,
            last_name: patients[0].last_name,
            lastMessage: patients[0].lastMessage,
            lastMessageTime: patients[0].lastMessageTime,
          }
        : "No patients",
    });
  }, [patients]);

  const getInitials = (firstName = "", lastName = "") => {
    const a = (firstName || "").trim();
    const b = (lastName || "").trim();
    if (a && b) return `${a[0]}${b[0]}`.toUpperCase();
    if (a) return a.slice(0, 2).toUpperCase();
    if (b) return b.slice(0, 2).toUpperCase();
    return "??";
  };

  const getAvatarColor = (id = "") => {
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
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

const truncateMessage = (message = "", maxLength = 40) => {
  if (!message) return "No messages yet";
  
  // ✅ Convert to string if it's an object
  const messageStr = typeof message === 'string' ? message : String(message);
  
  if (messageStr.length <= maxLength) return messageStr;
  return messageStr.substring(0, maxLength) + "...";
};
  const getTimeAgo = (timestamp) => {
    if (!timestamp) return "";
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - messageTime) / 60000);

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const filtered = useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    if (!q) return patients;
    return patients.filter((p) => {
      const name = `${p.first_name || p.firstName || ""} ${
        p.last_name || p.lastName || ""
      }`.toLowerCase();
      const email = (p.email || "").toLowerCase();
      return name.includes(q) || email.includes(q);
    });
  }, [patients, query]);

  return (
    <Box
      sx={{
        width: isMobile ? "100%" : 320,
        height: "100%",
        borderRight: "none",
        display: "flex",
        flexDirection: "column",
        background: isDarkMode
          ? "rgba(17, 24, 39, 0.25)"
          : "rgba(255, 255, 255, 0.25)",
        backdropFilter: "blur(20px)",
        borderRadius: isMobile ? "16px" : "16px 0 0 16px",
        overflow: "hidden",
        border: isDarkMode
          ? "1px solid rgba(100, 255, 218, 0.1)"
          : "1px solid rgba(62, 228, 200, 0.1)",
        position: "relative",
      }}
    >
      {/* Subtle gradient overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isDarkMode
            ? "linear-gradient(180deg, rgba(100, 255, 218, 0.02) 0%, rgba(167, 139, 250, 0.02) 100%)"
            : "linear-gradient(180deg, rgba(62, 228, 200, 0.03) 0%, rgba(43, 196, 168, 0.03) 100%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Search Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: isDarkMode
            ? "1px solid rgba(100, 255, 218, 0.1)"
            : "1px solid rgba(62, 228, 200, 0.1)",
          position: "relative",
          zIndex: 1,
          background: isDarkMode
            ? "rgba(17, 24, 39, 0.3)"
            : "rgba(255, 255, 255, 0.3)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            background: isDarkMode
              ? "rgba(100, 255, 218, 0.05)"
              : "rgba(62, 228, 200, 0.05)",
            backdropFilter: "blur(5px)",
            border: isDarkMode
              ? "1px solid rgba(100, 255, 218, 0.15)"
              : "1px solid rgba(62, 228, 200, 0.2)",
            borderRadius: "10px",
            transition: "all 0.25s ease",
            "&:hover": {
              background: isDarkMode
                ? "rgba(100, 255, 218, 0.08)"
                : "rgba(62, 228, 200, 0.08)",
              border: isDarkMode
                ? "1px solid rgba(100, 255, 218, 0.2)"
                : "1px solid rgba(62, 228, 200, 0.25)",
            },
          }}
        >
          <IconButton
            sx={{
              p: "10px",
              color: isDarkMode ? "#64ffda" : "#3EE4C8",
              "&:hover": {
                backgroundColor: "transparent",
              },
            }}
            aria-label="search"
          >
            <SearchIcon />
          </IconButton>
          <InputBase
            sx={{
              ml: 1,
              flex: 1,
              color: isDarkMode ? "rgba(255, 255, 255, 0.9)" : "#0B1929",
              "& ::placeholder": {
                color: isDarkMode
                  ? "rgba(255, 255, 255, 0.5)"
                  : "rgba(11, 25, 41, 0.5)",
              },
            }}
            placeholder="Search patients..."
            inputProps={{ "aria-label": "search patients" }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Paper>
      </Box>

      {/* Patient List */}
      <List
        sx={{
          flexGrow: 1,
          overflow: "auto",
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
        {filtered.length === 0 && (
          <Box
            sx={{
              p: 3,
              textAlign: "center",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: isDarkMode
                  ? "rgba(255, 255, 255, 0.5)"
                  : "rgba(11, 25, 41, 0.6)",
              }}
            >
              No patients found
            </Typography>
          </Box>
        )}

        {filtered.map((patient, idx) => {
          // Determine last message - prioritize backend data
          let lastMessage = patient.lastMessage || "No messages yet";
          let lastTimestamp = patient.lastMessageTime || null;

          // Fallback to messages array if backend data not available
          if (!patient.lastMessage && patient.messages?.length > 0) {
            const msg = patient.messages[patient.messages.length - 1];
            lastMessage = msg.message || "No messages yet";
            lastTimestamp = msg.timestamp || msg.created_at || null;
          }
          //  Format file messages nicely
          lastMessage = formatFileMessage(lastMessage);
          const isSelected = selectedPatient?.id === patient.id;
          const firstName = patient.first_name ?? patient.firstName ?? "";
          const lastName = patient.last_name ?? patient.lastName ?? "";
          const unreadCount = patient.unreadCount ?? patient.unread_count ?? 0;

          return (
            <ListItem
              key={patient.id || idx}
              onClick={() => onSelectPatient && onSelectPatient(patient)}
              sx={{
                py: 1,
                px: 2,

                borderRadius: "10px",
                backgroundColor: isSelected
                  ? isDarkMode
                    ? "rgba(100, 255, 218, 0.12)"
                    : "rgba(62, 228, 200, 0.15)"
                  : "transparent",
                border: isSelected
                  ? isDarkMode
                    ? "1px solid rgba(100, 255, 218, 0.2)"
                    : "1px solid rgba(62, 228, 200, 0.2)"
                  : "1px solid transparent",
                position: "relative",
                cursor: "pointer",
                transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",

                "&:hover": {
                  backgroundColor: isSelected
                    ? isDarkMode
                      ? "rgba(100, 255, 218, 0.15)"
                      : "rgba(62, 228, 200, 0.18)"
                    : isDarkMode
                    ? "rgba(100, 255, 218, 0.05)"
                    : "rgba(62, 228, 200, 0.08)",
                  border: isDarkMode
                    ? "1px solid rgba(100, 255, 218, 0.15)"
                    : "1px solid rgba(62, 228, 200, 0.15)",
                },

                // Left accent bar for selected state
                "&::before": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "3px",
                  height: isSelected ? "60%" : "0%",
                  backgroundColor: isDarkMode ? "#64ffda" : "#3EE4C8",
                  borderRadius: "0 2px 2px 0",
                  transition: "height 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                },
              }}
            >
              <ListItemAvatar>
                <Avatar
                  sx={{
                    bgcolor: getAvatarColor(String(patient.id || "")),
                    width: 45,
                    height: 45,
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    border: isDarkMode
                      ? "2px solid rgba(100, 255, 218, 0.15)"
                      : "2px solid rgba(62, 228, 200, 0.15)",
                    boxShadow: isSelected
                      ? isDarkMode
                        ? "0 4px 12px rgba(100, 255, 218, 0.2)"
                        : "0 4px 12px rgba(62, 228, 200, 0.25)"
                      : "none",
                    transition: "all 0.25s ease",
                  }}
                >
                  {getInitials(firstName, lastName)}
                </Avatar>
              </ListItemAvatar>

              <ListItemText
                primary={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        color: isSelected
                          ? isDarkMode
                            ? "#64ffda"
                            : "#0B1929"
                          : isDarkMode
                          ? "rgba(255, 255, 255, 0.85)"
                          : "#0B1929",
                        letterSpacing: "0.15px",
                      }}
                    >
                      {firstName} {lastName}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: isDarkMode
                          ? "rgba(255, 255, 255, 0.4)"
                          : "rgba(11, 25, 41, 0.5)",
                        fontSize: "0.7rem",
                      }}
                    >
                      {getTimeAgo(lastTimestamp)}
                    </Typography>
                  </Box>
                }
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{
                        color: isDarkMode
                          ? "rgba(255, 255, 255, 0.6)"
                          : "rgba(11, 25, 41, 0.7)",
                        display: "block",
                        fontSize: "0.875rem",
                      }}
                    >
                      {truncateMessage(lastMessage)}
                    </Typography>
                    {unreadCount > 0 && (
                      <Chip
                        component="span"
                        label={unreadCount}
                        size="small"
                        sx={{
                          mt: 1,
                          height: 20,
                          backgroundColor: isDarkMode ? "#64ffda" : "#3EE4C8",
                          color: isDarkMode ? "#0B1929" : "#ffffff",
                          fontWeight: 600,
                          fontSize: "0.7rem",
                          display: "inline-flex",
                          boxShadow: isDarkMode
                            ? "0 2px 8px rgba(100, 255, 218, 0.3)"
                            : "0 2px 8px rgba(62, 228, 200, 0.4)",
                        }}
                      />
                    )}
                  </>
                }
              />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default PatientList;
