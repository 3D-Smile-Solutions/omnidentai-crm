// frontend/src/components/Dashboard/components/GenericDocumentUploadModal.jsx
import React, { useState } from 'react';
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

const GenericDocumentUploadModal = ({ 
  open, 
  onClose, 
  onUploadComplete,
  documentType, // 'form', 'report', 'chat_attachment'
  category, // 'patient_intake', 'financial_report', etc.
  title = 'Upload Document',
  allowedTypes = 'all', // 'all', 'images', 'documents', 'pdf'
  patientId = null // Optional: for patient-specific documents
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  const [description, setDescription] = useState('');

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
      setError('File size must be less than 50MB');
      return;
    }

    const allowedMimeTypes = getAllowedMimeTypes();
    if (!allowedMimeTypes.includes(file.type)) {
      setError('Invalid file type for this upload');
      return;
    }

    setSelectedFile(file);
    setError(null);

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

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('documentType', documentType);
      formData.append('category', category);
      formData.append('description', description);
      if (patientId) {
        formData.append('patientId', patientId);
      }

      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

     const response = await fetch('http://localhost:5000/practice-documents/upload', {
  method: 'POST',
  credentials: 'include',
  body: formData
})

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      console.log('✅ Document uploaded successfully:', data);

      if (onUploadComplete) {
        onUploadComplete(data.document);
      }

      setTimeout(() => {
        handleClose();
      }, 500);

    } catch (err) {
      console.error('❌ Upload error:', err);
      setError(err.message || 'Failed to upload document');
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreview(null);
    setUploadProgress(0);
    setError(null);
    setDescription('');
    onClose();
  };

  const getFileIcon = (file) => {
    if (!file) return <FileIcon />;

    if (file.type.startsWith('image/')) {
      return <ImageIcon sx={{ color: '#4ECDC4' }} />;
    } else if (file.type === 'application/pdf') {
      return <PdfIcon sx={{ color: '#FF6B6B' }} />;
    } else {
      return <DocIcon sx={{ color: '#45B7D1' }} />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

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
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
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
            onClick={() => document.getElementById(`file-input-${documentType}-${category}`).click()}
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
              id={`file-input-${documentType}-${category}`}
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
                  onClick={() => setSelectedFile(null)}
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

export default GenericDocumentUploadModal;