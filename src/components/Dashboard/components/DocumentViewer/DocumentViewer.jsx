// frontend/src/components/Dashboard/components/DocumentViewer/DocumentViewer.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  MenuItem
} from '@mui/material';
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
  Description as DocIcon
} from '@mui/icons-material';
import { fetchDocuments, deleteDocument } from '../../../../redux/slices/uploadsSlice';
import UnifiedUploadModal from '../UploadModal/UnifiedUploadModal';

const DocumentViewer = ({ open, onClose, category, title, documentType, onUpload }) => {
  const dispatch = useDispatch();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const { documentsByFilter, loading, error } = useSelector((state) => state.uploads);
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
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download file');
    }
    handleMenuClose();
  };

  const handleView = (doc) => {
    window.open(doc.url, '_blank');
    handleMenuClose();
  };

  const handleDelete = async (doc) => {
    if (window.confirm(`Are you sure you want to delete "${doc.filename}"?`)) {
      try {
        await dispatch(deleteDocument(doc.id)).unwrap();
        alert('Document deleted successfully');
        // Refresh the list
        dispatch(fetchDocuments({ type: documentType, category }));
      } catch (error) {
        console.error('Delete failed:', error);
        alert('Failed to delete document');
      }
    }
    handleMenuClose();
  };

  const getFileIcon = (mimeType) => {
    if (mimeType?.startsWith('image/')) return <ImageIcon sx={{ color: '#4ECDC4', fontSize: 60 }} />;
    if (mimeType === 'application/pdf') return <PdfIcon sx={{ color: '#FF6B6B', fontSize: 60 }} />;
    if (mimeType?.includes('word') || mimeType?.includes('document')) return <DocIcon sx={{ color: '#45B7D1', fontSize: 60 }} />;
    return <FileIcon sx={{ color: '#96CEB4', fontSize: 60 }} />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
            borderRadius: 2,
            minHeight: '70vh'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '1px solid rgba(0,0,0,0.1)',
          pb: 2
        }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#0B1929' }}>
              {title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(11, 25, 41, 0.6)', mt: 0.5 }}>
              {categoryDocuments.length} document{categoryDocuments.length !== 1 ? 's' : ''}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Upload New Document">
              <IconButton
                onClick={() => setUploadModalOpen(true)}
                sx={{
                  backgroundColor: '#3EE4C8',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#35CEB5'
                  }
                }}
              >
                <UploadIcon />
              </IconButton>
            </Tooltip>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ mt: 3 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
              <CircularProgress sx={{ color: '#3EE4C8' }} />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          ) : categoryDocuments.length === 0 ? (
            <Box sx={{ 
              textAlign: 'center', 
              py: 8,
              px: 3
            }}>
              <FileIcon sx={{ fontSize: 80, color: 'rgba(0,0,0,0.2)', mb: 2 }} />
              <Typography variant="h6" sx={{ color: 'rgba(0,0,0,0.6)', mb: 1 }}>
                No documents uploaded yet
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.4)', mb: 3 }}>
                Click the upload button to add your first document
              </Typography>
              <IconButton
                onClick={() => setUploadModalOpen(true)}
                sx={{
                  backgroundColor: '#3EE4C8',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#35CEB5'
                  },
                  px: 3,
                  py: 1.5
                }}
              >
                <UploadIcon sx={{ mr: 1 }} />
                <Typography variant="button">Upload Document</Typography>
              </IconButton>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {categoryDocuments.map((doc) => (
                <Grid item xs={12} sm={6} md={4} key={doc.id}>
                  <Card 
                    elevation={0}
                    sx={{
                      border: '1px solid rgba(0,0,0,0.1)',
                      borderRadius: 2,
                      transition: 'all 0.2s',
                      cursor: 'pointer',
                      '&:hover': {
                        boxShadow: '0 4px 20px rgba(62, 228, 200, 0.15)',
                        borderColor: '#3EE4C8',
                        transform: 'translateY(-2px)'
                      }
                    }}
                    onClick={() => handleView(doc)}
                  >
                    {doc.mime_type?.startsWith('image/') ? (
                      <CardMedia
                        component="img"
                        height="200"
                        image={doc.url}
                        alt={doc.filename}
                        sx={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <Box
                        sx={{
                          height: 200,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'rgba(62, 228, 200, 0.1)'
                        }}
                      >
                        {getFileIcon(doc.mime_type)}
                      </Box>
                    )}
                    
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Tooltip title={doc.filename}>
                          <Typography 
                            variant="subtitle2" 
                            sx={{ 
                              fontWeight: 600,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              flex: 1,
                              mr: 1
                            }}
                          >
                            {doc.filename}
                          </Typography>
                        </Tooltip>
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, doc)}
                          sx={{ p: 0.5 }}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </Box>

                      <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip 
                          label={formatFileSize(doc.file_size)} 
                          size="small"
                          sx={{ 
                            backgroundColor: 'rgba(62, 228, 200, 0.1)',
                            color: '#0B1929',
                            fontSize: '0.7rem'
                          }}
                        />
                        <Chip 
                          label={formatDate(doc.uploaded_at)} 
                          size="small"
                          sx={{ 
                            backgroundColor: 'rgba(0,0,0,0.05)',
                            fontSize: '0.7rem'
                          }}
                        />
                      </Box>

                      {doc.description && (
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            mt: 1,
                            color: 'rgba(0,0,0,0.6)',
                            fontSize: '0.75rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
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
      >
        <MenuItem onClick={() => handleView(selectedDoc)}>
          <ViewIcon sx={{ mr: 1, fontSize: 20 }} />
          View
        </MenuItem>
        <MenuItem onClick={() => handleDownload(selectedDoc)}>
          <DownloadIcon sx={{ mr: 1, fontSize: 20 }} />
          Download
        </MenuItem>
        <MenuItem onClick={() => handleDelete(selectedDoc)} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1, fontSize: 20 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Upload Modal */}
      <UnifiedUploadModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUploadComplete={(doc) => {
          console.log('Document uploaded:', doc);
          if (onUpload) onUpload(doc);
          setUploadModalOpen(false);
          // Refresh documents list
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