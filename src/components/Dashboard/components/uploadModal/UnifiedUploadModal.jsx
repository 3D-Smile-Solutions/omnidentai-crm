// frontend/src/components/Dashboard/components/UploadModal/UnifiedUploadModal.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  LinearProgress,
  IconButton,
  Alert,
  Chip,
  TextField
} from '@mui/material';
import {
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
  InsertDriveFile as FileIcon,
  Image as ImageIcon,
  PictureAsPdf as PdfIcon,
  Description as DocIcon
} from '@mui/icons-material';
import { uploadDocument, resetUploadState } from '../../../../redux/slices/uploadsSlice';

const UnifiedUploadModal = ({ 
  open, 
  onClose, 
  onUploadComplete,
  documentType, // 'chat_attachment', 'form', 'report'
  category, // 'patient_intake', 'financial_report', 'chat', etc.
  title = 'Upload Document',
  allowedTypes = 'all', // 'all', 'images', 'documents', 'pdf'
  patientId = null
}) => {
  const dispatch = useDispatch();
  const { uploading, uploadProgress, uploadError } = useSelector((state) => state.uploads);
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [description, setDescription] = useState('');
  const [localError, setLocalError] = useState(null);

  // Reset on mount
  useEffect(() => {
    if (open) {
      dispatch(resetUploadState());
      setLocalError(null);
    }
  }, [open, dispatch]);

  const getAcceptedFileTypes = () => {
    switch (allowedTypes) {
      case 'images':
        return 'image/*';
      case 'documents':
        return '.pdf,.doc,.docx,.xls,.xlsx';
      case 'pdf':
        return '.pdf';
      default:
        return 'image/*,.pdf,.doc,.docx,.xls,.xlsx';
    }
  };

  const getAllowedMimeTypes = () => {
    const allTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    switch (allowedTypes) {
      case 'images':
        return allTypes.filter(type => type.startsWith('image/'));
      case 'documents':
        return allTypes.filter(type => !type.startsWith('image/'));
      case 'pdf':
        return ['application/pdf'];
      default:
        return allTypes;
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      setLocalError('File size must be less than 50MB');
      return;
    }

    const allowedMimeTypes = getAllowedMimeTypes();
    if (!allowedMimeTypes.includes(file.type)) {
      setLocalError('Invalid file type for this upload');
      return;
    }

    setSelectedFile(file);
    setLocalError(null);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const result = await dispatch(uploadDocument({
        file: selectedFile,
        documentType,
        category,
        patientId,
        description,
        onProgress: (progress) => {
          // Progress is handled by Redux state
        }
      })).unwrap();

      console.log('✅ Upload successful:', result);
      
      if (onUploadComplete) {
        onUploadComplete(result);
      }

      // Small delay to show 100% progress
      setTimeout(() => {
        handleClose();
      }, 500);

    } catch (error) {
      console.error('❌ Upload failed:', error);
      // Error is in Redux state
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreview(null);
    setDescription('');
    setLocalError(null);
    dispatch(resetUploadState());
    onClose();
  };

  const getFileIcon = (file) => {
    if (!file) return <FileIcon />;
    if (file.type.startsWith('image/')) return <ImageIcon sx={{ color: '#4ECDC4' }} />;
    if (file.type === 'application/pdf') return <PdfIcon sx={{ color: '#FF6B6B' }} />;
    return <DocIcon sx={{ color: '#45B7D1' }} />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const displayError = localError || uploadError;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 2,
        borderBottom: '1px solid rgba(62, 228, 200, 0.15)'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#0B1929' }}>
          {title}
        </Typography>
        <IconButton onClick={handleClose} size="small" disabled={uploading}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {displayError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {displayError}
          </Alert>
        )}

        {!selectedFile ? (
          <Box
            sx={{
              border: '2px dashed rgba(62, 228, 200, 0.3)',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: '#3EE4C8',
                backgroundColor: 'rgba(62, 228, 200, 0.05)'
              }
            }}
            onClick={() => document.getElementById(`unified-file-input-${documentType}-${category}`).click()}
          >
            <CloudUploadIcon sx={{ fontSize: 48, color: '#3EE4C8', mb: 2 }} />
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
              Click to browse or drag and drop
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(11, 25, 41, 0.6)' }}>
              {allowedTypes === 'images' && 'Images only (Max 50MB)'}
              {allowedTypes === 'pdf' && 'PDF files only (Max 50MB)'}
              {allowedTypes === 'documents' && 'Documents: PDF, Word, Excel (Max 50MB)'}
              {allowedTypes === 'all' && 'Images, PDFs, Word, Excel (Max 50MB)'}
            </Typography>
            <input
              id={`unified-file-input-${documentType}-${category}`}
              type="file"
              accept={getAcceptedFileTypes()}
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
          </Box>
        ) : (
          <Box>
            {preview && (
              <Box
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  overflow: 'hidden',
                  maxHeight: 200,
                  display: 'flex',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0,0,0,0.05)'
                }}
              >
                <img 
                  src={preview} 
                  alt="Preview" 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: 200,
                    objectFit: 'contain'
                  }} 
                />
              </Box>
            )}

            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              p: 2,
              backgroundColor: 'rgba(62, 228, 200, 0.05)',
              borderRadius: 2,
              mb: 2
            }}>
              <Box sx={{ fontSize: 40 }}>
                {getFileIcon(selectedFile)}
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 500,
                    color: '#0B1929',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {selectedFile.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5 }}>
                  <Chip 
                    label={formatFileSize(selectedFile.size)} 
                    size="small"
                    sx={{ 
                      height: 20,
                      fontSize: '0.7rem',
                      backgroundColor: 'rgba(62, 228, 200, 0.2)',
                      color: '#0B1929'
                    }}
                  />
                  <Chip 
                    label={selectedFile.type.split('/')[1].toUpperCase()} 
                    size="small"
                    sx={{ 
                      height: 20,
                      fontSize: '0.7rem',
                      backgroundColor: 'rgba(62, 228, 200, 0.2)',
                      color: '#0B1929'
                    }}
                  />
                </Box>
              </Box>
              {!uploading && (
                <IconButton 
                  size="small" 
                  onClick={() => {
                    setSelectedFile(null);
                    setPreview(null);
                  }}
                  sx={{ color: 'rgba(11, 25, 41, 0.6)' }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              )}
            </Box>

            {/* Optional Description */}
            <TextField
              fullWidth
              label="Description (Optional)"
              multiline
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={uploading}
              sx={{ mb: 2 }}
            />

            {uploading && (
              <Box sx={{ mb: 2 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={uploadProgress}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'rgba(62, 228, 200, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#3EE4C8'
                    }
                  }}
                />
                <Typography 
                  variant="caption" 
                  sx={{ 
                    display: 'block', 
                    textAlign: 'center', 
                    mt: 1,
                    color: 'rgba(11, 25, 41, 0.7)'
                  }}
                >
                  Uploading... {uploadProgress}%
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button 
          onClick={handleClose}
          disabled={uploading}
          sx={{ 
            color: 'rgba(11, 25, 41, 0.7)',
            textTransform: 'none'
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          variant="contained"
          sx={{
            backgroundColor: '#3EE4C8',
            color: '#0B1929',
            textTransform: 'none',
            px: 3,
            '&:hover': {
              backgroundColor: '#35ccb3'
            },
            '&.Mui-disabled': {
              backgroundColor: 'rgba(62, 228, 200, 0.3)'
            }
          }}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UnifiedUploadModal;