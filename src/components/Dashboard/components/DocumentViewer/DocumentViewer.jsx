// frontend/src/components/Dashboard/components/DocumentViewer/DocumentViewer.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRefreshDocumentUrl } from "../../../../components/Dashboard/hooks/useDocumentUrl";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Alert,
  Tooltip,
  Menu,
  MenuItem,
  Button,
  Badge,
} from "@mui/material";
import {
  Close as CloseIcon,
  CloudUpload as UploadIcon,
  GetApp as DownloadIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  InsertDriveFile as FileIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  Description as DocIcon,
  Add as AddIcon,
  FolderOpen as FolderIcon,
} from "@mui/icons-material";
import {
  fetchDocuments,
  deleteDocument,
} from "../../../../redux/slices/uploadsSlice";
import UnifiedUploadModal from "../UploadModal/UnifiedUploadModal";
import { useTheme } from "../../../../context/ThemeContext";

const DocumentViewer = ({
  open,
  onClose,
  category,
  title,
  documentType,
  onUpload,
}) => {
  const { isDarkMode } = useTheme();
  const dispatch = useDispatch();
  const { refreshUrl } = useRefreshDocumentUrl();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  const { documentsByFilter, loading, error } = useSelector(
    (state) => state.uploads
  );
  const filterKey = `${documentType}-${category}`;
  const categoryDocuments = documentsByFilter[filterKey] || [];

  useEffect(() => {
    if (open && category) {
      dispatch(fetchDocuments({ type: documentType, category }));
    }
  }, [open, category, documentType, dispatch]);

  const handleMenuOpen = (event, doc) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setSelectedDoc(doc);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedDoc(null);
  };

  const handleDownload = async (doc) => {
    try {
      const response = await fetch(doc.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = doc.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download file");
    }
    handleMenuClose();
  };

  const handleView = (doc) => {
    window.open(doc.url, "_blank");
    handleMenuClose();
  };

  const handleDelete = async (doc) => {
    if (window.confirm(`Are you sure you want to delete "${doc.filename}"?`)) {
      try {
        await dispatch(deleteDocument(doc.id)).unwrap();
        dispatch(fetchDocuments({ type: documentType, category }));
      } catch (error) {
        console.error("Delete failed:", error);
        alert("Failed to delete document");
      }
    }
    handleMenuClose();
  };

  const getFileIcon = (mimeType) => {
    const iconProps = { fontSize: 60 };
    if (mimeType?.startsWith("image/"))
      return (
        <ImageIcon
          sx={{ ...iconProps, color: isDarkMode ? "#34d399" : "#2E7D32" }}
        />
      );
    if (mimeType === "application/pdf")
      return (
        <PdfIcon
          sx={{ ...iconProps, color: isDarkMode ? "#f87171" : "#dc2626" }}
        />
      );
    if (mimeType?.includes("word") || mimeType?.includes("document"))
      return (
        <DocIcon
          sx={{ ...iconProps, color: isDarkMode ? "#60a5fa" : "#1976D2" }}
        />
      );
    return (
      <FileIcon
        sx={{ ...iconProps, color: isDarkMode ? "#a78bfa" : "#7B1FA2" }}
      />
    );
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            minHeight: "70vh",
            background: isDarkMode
              ? "linear-gradient(135deg, rgba(17, 24, 39, 0.98) 0%, rgba(17, 24, 39, 0.95) 100%)"
              : "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%)",
            backdropFilter: "blur(20px)",
            border: isDarkMode
              ? "1px solid rgba(100, 255, 218, 0.1)"
              : "1px solid rgba(62, 228, 200, 0.1)",
            overflow: "hidden",
          },
        }}
      >
        {/* Header */}
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: isDarkMode
              ? "1px solid rgba(100, 255, 218, 0.1)"
              : "1px solid rgba(62, 228, 200, 0.1)",
            pb: 2,
            background: isDarkMode
              ? "rgba(17, 24, 39, 0.5)"
              : "rgba(255, 255, 255, 0.5)",
            backdropFilter: "blur(10px)",
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "2px",
              background: `linear-gradient(90deg, 
              transparent 0%, 
              ${isDarkMode ? "#64ffda" : "#3EE4C8"} 50%, 
              transparent 100%)`,
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "10px",
                backgroundColor: isDarkMode
                  ? "rgba(100, 255, 218, 0.1)"
                  : "rgba(62, 228, 200, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: isDarkMode
                  ? "1px solid rgba(100, 255, 218, 0.2)"
                  : "1px solid rgba(62, 228, 200, 0.2)",
              }}
            >
              <FolderIcon
                sx={{
                  color: isDarkMode ? "#64ffda" : "#3EE4C8",
                  fontSize: 24,
                }}
              />
            </Box>
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color: isDarkMode ? "#ffffff" : "#0B1929",
                  letterSpacing: "-0.01em",
                }}
              >
                {title}
              </Typography>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}
              >
                <Chip
                  size="small"
                  label={`${categoryDocuments.length} files`}
                  sx={{
                    height: 20,
                    fontSize: "0.75rem",
                    backgroundColor: isDarkMode
                      ? "rgba(100, 255, 218, 0.1)"
                      : "rgba(62, 228, 200, 0.1)",
                    color: isDarkMode ? "#64ffda" : "#3EE4C8",
                    border: "none",
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: isDarkMode
                      ? "rgba(255, 255, 255, 0.5)"
                      : "rgba(11, 25, 41, 0.5)",
                  }}
                >
                  {formatFileSize(
                    categoryDocuments.reduce(
                      (acc, doc) => acc + doc.file_size,
                      0
                    )
                  )}{" "}
                  total
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="Upload New Document">
              <Button
                onClick={() => setUploadModalOpen(true)}
                startIcon={
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      backgroundColor: isDarkMode ? "#0B1929" : "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <AddIcon
                      sx={{
                        fontSize: 18,
                        color: isDarkMode ? "#64ffda" : "#3EE4C8",
                      }}
                    />
                  </Box>
                }
                sx={{
                  backgroundColor: isDarkMode ? "#64ffda" : "#3EE4C8",
                  color: isDarkMode ? "#0B1929" : "#ffffff",
                  fontWeight: 600,
                  px: 2.5,
                  py: 1,
                  borderRadius: "10px",
                  textTransform: "none",
                  fontSize: "0.9rem",
                  boxShadow: isDarkMode
                    ? "0 4px 20px rgba(100, 255, 218, 0.3)"
                    : "0 4px 20px rgba(62, 228, 200, 0.3)",
                  "&:hover": {
                    backgroundColor: isDarkMode ? "#52d4c2" : "#2BC4A8",
                    transform: "translateY(-2px)",
                    boxShadow: isDarkMode
                      ? "0 6px 24px rgba(100, 255, 218, 0.4)"
                      : "0 6px 24px rgba(62, 228, 200, 0.4)",
                  },
                  transition: "all 0.25s ease",
                }}
              >
                Upload
              </Button>
            </Tooltip>
            <IconButton
              onClick={onClose}
              sx={{
                color: isDarkMode
                  ? "rgba(255, 255, 255, 0.6)"
                  : "rgba(11, 25, 41, 0.6)",
                "&:hover": {
                  color: isDarkMode ? "#64ffda" : "#3EE4C8",
                  backgroundColor: isDarkMode
                    ? "rgba(100, 255, 218, 0.05)"
                    : "rgba(62, 228, 200, 0.05)",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ mt: 3, position: "relative", pb: 3 }}>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 300,
              }}
            >
              <CircularProgress
                sx={{ color: isDarkMode ? "#64ffda" : "#3EE4C8" }}
              />
            </Box>
          ) : error ? (
            <Alert
              severity="error"
              sx={{
                mb: 2,
                backgroundColor: isDarkMode
                  ? "rgba(248, 113, 113, 0.1)"
                  : "rgba(239, 68, 68, 0.1)",
                color: isDarkMode ? "#f87171" : "#dc2626",
                border: isDarkMode
                  ? "1px solid rgba(248, 113, 113, 0.2)"
                  : "1px solid rgba(239, 68, 68, 0.2)",
              }}
            >
              {error}
            </Alert>
          ) : categoryDocuments.length === 0 ? (
            <Box
              sx={{
                textAlign: "center",
                py: 8,
                px: 3,
              }}
            >
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: "24px",
                  background: isDarkMode
                    ? "linear-gradient(135deg, rgba(100, 255, 218, 0.1) 0%, rgba(167, 139, 250, 0.1) 100%)"
                    : "linear-gradient(135deg, rgba(62, 228, 200, 0.1) 0%, rgba(43, 196, 168, 0.1) 100%)",
                  backdropFilter: "blur(10px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 32px",
                  border: isDarkMode
                    ? "1px solid rgba(100, 255, 218, 0.2)"
                    : "1px solid rgba(62, 228, 200, 0.2)",
                  position: "relative",
                }}
              >
                <FolderIcon
                  sx={{
                    fontSize: 60,
                    color: isDarkMode ? "#64ffda" : "#3EE4C8",
                    opacity: 0.9,
                  }}
                />
                <Badge
                  badgeContent="0"
                  sx={{
                    position: "absolute",
                    top: 20,
                    right: 20,
                    "& .MuiBadge-badge": {
                      backgroundColor: isDarkMode ? "#a78bfa" : "#7B1FA2",
                      color: "#ffffff",
                    },
                  }}
                />
              </Box>

              <Typography
                variant="h6"
                sx={{
                  color: isDarkMode
                    ? "rgba(255, 255, 255, 0.7)"
                    : "rgba(11, 25, 41, 0.7)",
                  mb: 1,
                  fontWeight: 600,
                }}
              >
                Your folder is empty
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: isDarkMode
                    ? "rgba(255, 255, 255, 0.5)"
                    : "rgba(11, 25, 41, 0.5)",
                  mb: 4,
                  maxWidth: 400,
                  mx: "auto",
                }}
              >
                Upload your first document to get started. You can drag and drop
                files or click the button below.
              </Typography>

              <Button
                onClick={() => setUploadModalOpen(true)}
                variant="contained"
                size="large"
                startIcon={
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      backgroundColor: isDarkMode
                        ? "#0B1929"
                        : "rgba(255, 255, 255, 0.9)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 0.5,
                    }}
                  >
                    <AddIcon
                      sx={{
                        fontSize: 20,
                        color: isDarkMode ? "#64ffda" : "#3EE4C8",
                      }}
                    />
                  </Box>
                }
                sx={{
                  backgroundColor: isDarkMode ? "#64ffda" : "#3EE4C8",
                  color: isDarkMode ? "#0B1929" : "#ffffff",
                  fontWeight: 600,
                  fontSize: "1rem",
                  px: 3,
                  py: 1.5,
                  borderRadius: "12px",
                  textTransform: "none",
                  boxShadow: isDarkMode
                    ? "0 8px 32px rgba(100, 255, 218, 0.3)"
                    : "0 8px 32px rgba(62, 228, 200, 0.3)",
                  "&:hover": {
                    backgroundColor: isDarkMode ? "#52d4c2" : "#2BC4A8",
                    transform: "translateY(-2px)",
                    boxShadow: isDarkMode
                      ? "0 12px 40px rgba(100, 255, 218, 0.4)"
                      : "0 12px 40px rgba(62, 228, 200, 0.4)",
                  },
                  transition: "all 0.25s ease",
                }}
              >
                Upload Your First Document
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {categoryDocuments.map((doc) => (
                <Grid item xs={12} sm={6} md={4} key={doc.id}>
                  <Card
                    elevation={0}
                    onMouseEnter={() => setHoveredCard(doc.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    sx={{
                      position: "relative",
                      background: isDarkMode
                        ? "rgba(17, 24, 39, 0.4)"
                        : "rgba(255, 255, 255, 0.4)",
                      backdropFilter: "blur(20px)",
                      border: isDarkMode
                        ? "1px solid rgba(100, 255, 218, 0.1)"
                        : "1px solid rgba(62, 228, 200, 0.1)",
                      borderRadius: "12px",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      cursor: "pointer",
                      overflow: "hidden",
                      transform:
                        hoveredCard === doc.id
                          ? "translateY(-8px)"
                          : "translateY(0)",
                      "&:hover": {
                        border: isDarkMode
                          ? "1px solid rgba(100, 255, 218, 0.3)"
                          : "1px solid rgba(62, 228, 200, 0.3)",
                        boxShadow: isDarkMode
                          ? "0 20px 40px rgba(100, 255, 218, 0.2)"
                          : "0 20px 40px rgba(62, 228, 200, 0.2)",
                      },
                    }}
                    onClick={() => handleView(doc)}
                  >
                    {/* Hover overlay effect */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `linear-gradient(135deg, 
                          ${
                            isDarkMode
                              ? "rgba(100, 255, 218, 0.05)"
                              : "rgba(62, 228, 200, 0.05)"
                          } 0%, 
                          transparent 100%)`,
                        opacity: hoveredCard === doc.id ? 1 : 0,
                        transition: "opacity 0.3s ease",
                        pointerEvents: "none",
                      }}
                    />

                    {doc.mime_type?.startsWith("image/") ? (
                      <Box sx={{ position: "relative" }}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={doc.url}
                          alt={doc.filename}
                          sx={{ objectFit: "cover" }}
                          onError={async (e) => {
                            // ✅ ADD THIS: Auto-refresh URL when image fails to load
                            console.log(
                              "🔄 Image failed to load, refreshing URL for:",
                              doc.id
                            );
                            const newUrl = await refreshUrl(doc.id);
                            if (newUrl) {
                              e.target.src = newUrl;
                              // Update Redux state with new URL
                              dispatch(
                                fetchDocuments({ type: documentType, category })
                              );
                            }
                          }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: "50%",
                            background:
                              "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
                          }}
                        />
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          height: 200,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: isDarkMode
                            ? "rgba(100, 255, 218, 0.03)"
                            : "rgba(62, 228, 200, 0.05)",
                          borderBottom: isDarkMode
                            ? "1px solid rgba(100, 255, 218, 0.1)"
                            : "1px solid rgba(62, 228, 200, 0.1)",
                          position: "relative",
                        }}
                      >
                        {getFileIcon(doc.mime_type)}
                        {new Date(doc.uploaded_at) >
                          new Date(Date.now() - 24 * 60 * 60 * 1000) && (
                          <Chip
                            size="small"
                            label="NEW"
                            sx={{
                              position: "absolute",
                              top: 12,
                              right: 12,
                              height: 20,
                              fontSize: "0.65rem",
                              backgroundColor: isDarkMode
                                ? "#f87171"
                                : "#dc2626",
                              color: "#ffffff",
                              fontWeight: 600,
                            }}
                          />
                        )}
                      </Box>
                    )}

                    <CardContent sx={{ position: "relative" }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Tooltip title={doc.filename}>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontWeight: 600,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                color: isDarkMode ? "#ffffff" : "#0B1929",
                                mb: 0.5,
                              }}
                            >
                              {doc.filename}
                            </Typography>
                          </Tooltip>

                          <Box
                            sx={{
                              display: "flex",
                              gap: 0.5,
                              flexWrap: "wrap",
                              mb: 1,
                            }}
                          >
                            <Chip
                              label={formatFileSize(doc.file_size)}
                              size="small"
                              sx={{
                                height: 18,
                                fontSize: "0.65rem",
                                backgroundColor: isDarkMode
                                  ? "rgba(100, 255, 218, 0.1)"
                                  : "rgba(62, 228, 200, 0.1)",
                                color: isDarkMode ? "#64ffda" : "#3EE4C8",
                                "& .MuiChip-label": { px: 1 },
                              }}
                            />
                            <Chip
                              label={formatDate(doc.uploaded_at)}
                              size="small"
                              sx={{
                                height: 18,
                                fontSize: "0.65rem",
                                backgroundColor: isDarkMode
                                  ? "rgba(255, 255, 255, 0.05)"
                                  : "rgba(0, 0, 0, 0.05)",
                                color: isDarkMode
                                  ? "rgba(255, 255, 255, 0.6)"
                                  : "rgba(11, 25, 41, 0.6)",
                                "& .MuiChip-label": { px: 1 },
                              }}
                            />
                          </Box>
                        </Box>

                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, doc)}
                          sx={{
                            p: 0.5,
                            color: isDarkMode
                              ? "rgba(255, 255, 255, 0.6)"
                              : "rgba(11, 25, 41, 0.6)",
                            "&:hover": {
                              backgroundColor: isDarkMode
                                ? "rgba(100, 255, 218, 0.1)"
                                : "rgba(62, 228, 200, 0.1)",
                            },
                          }}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </Box>

                      {doc.description && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: isDarkMode
                              ? "rgba(255, 255, 255, 0.5)"
                              : "rgba(11, 25, 41, 0.5)",
                            fontSize: "0.75rem",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {doc.description}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>
      </Dialog>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            background: isDarkMode
              ? "rgba(17, 24, 39, 0.95)"
              : "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            border: isDarkMode
              ? "1px solid rgba(100, 255, 218, 0.1)"
              : "1px solid rgba(62, 228, 200, 0.1)",
            boxShadow: isDarkMode
              ? "0 8px 32px rgba(0, 0, 0, 0.3)"
              : "0 8px 32px rgba(0, 0, 0, 0.1)",
            "& .MuiMenuItem-root": {
              color: isDarkMode ? "#ffffff" : "#0B1929",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: isDarkMode
                  ? "rgba(100, 255, 218, 0.1)"
                  : "rgba(62, 228, 200, 0.1)",
              },
            },
          },
        }}
      >
        <MenuItem onClick={() => handleView(selectedDoc)}>
          <ViewIcon
            sx={{
              mr: 1.5,
              fontSize: 20,
              color: isDarkMode ? "#64ffda" : "#3EE4C8",
            }}
          />
          View
        </MenuItem>
        <MenuItem onClick={() => handleDownload(selectedDoc)}>
          <DownloadIcon
            sx={{
              mr: 1.5,
              fontSize: 20,
              color: isDarkMode ? "#60a5fa" : "#1976D2",
            }}
          />
          Download
        </MenuItem>
        <MenuItem
          onClick={() => handleDelete(selectedDoc)}
          sx={{
            color: isDarkMode ? "#f87171" : "#dc2626",
            "&:hover": {
              backgroundColor: isDarkMode
                ? "rgba(248, 113, 113, 0.1)"
                : "rgba(239, 68, 68, 0.1)",
            },
          }}
        >
          <DeleteIcon sx={{ mr: 1.5, fontSize: 20 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Upload Modal */}
      <UnifiedUploadModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUploadComplete={(doc) => {
          if (onUpload) onUpload(doc);
          setUploadModalOpen(false);
          dispatch(fetchDocuments({ type: documentType, category }));
        }}
        documentType={documentType}
        category={category}
        title={`Upload ${title}`}
        allowedTypes="documents"
      />
    </>
  );
};

export default DocumentViewer;
