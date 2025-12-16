// frontend/src/components/Dashboard/components/Forms/Forms.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Button,
  Tooltip,
  TablePagination,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  alpha,
  CircularProgress,
  Alert,
  Snackbar,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Description as FormsIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  MoreVert as MoreIcon,
  CloudUpload as UploadIcon,
  PersonAdd as PatientIntakeIcon,
  LocalHospital as MedicalIcon,
  Gavel as ConsentIcon,
  AccountBalance as InsuranceIcon,
  OpenInNew as OpenInNewIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  InsertDriveFile as FileIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  KeyboardArrowDown as ArrowDownIcon,
} from '@mui/icons-material';
import { fetchDocuments, deleteDocument } from '../../../../redux/slices/uploadsSlice';
import UnifiedUploadModal from '../uploadModal/UnifiedUploadModal';
import { useTheme } from '../../../../context/ThemeContext';

const CATEGORIES = [
  { id: 'all', label: 'All Forms', icon: FormsIcon },
  { id: 'patient_intake', label: 'Patient Intake', icon: PatientIntakeIcon },
  { id: 'medical_history', label: 'Medical History', icon: MedicalIcon },
  { id: 'consent_forms', label: 'Consent Forms', icon: ConsentIcon },
  { id: 'insurance_forms', label: 'Insurance', icon: InsuranceIcon },
];

const SORT_OPTIONS = [
  { id: 'date_desc', label: 'Newest First', field: 'uploaded_at', order: 'desc' },
  { id: 'date_asc', label: 'Oldest First', field: 'uploaded_at', order: 'asc' },
  { id: 'size_desc', label: 'Size: High to Low', field: 'file_size', order: 'desc' },
  { id: 'size_asc', label: 'Size: Low to High', field: 'file_size', order: 'asc' },
  { id: 'name_asc', label: 'Name: A to Z', field: 'filename', order: 'asc' },
  { id: 'name_desc', label: 'Name: Z to A', field: 'filename', order: 'desc' },
];

const Forms = () => {
  const { isDarkMode } = useTheme();
  const dispatch = useDispatch();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOption, setSortOption] = useState('date_desc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedForm, setSelectedForm] = useState(null);
  
  // Upload modal state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadCategory, setUploadCategory] = useState('patient_intake');
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Get documents from Redux store
  const { documentsByFilter, loading, error } = useSelector((state) => state.uploads);

  // Fetch documents for all form categories on mount
  useEffect(() => {
    const categories = ['patient_intake', 'medical_history', 'consent_forms', 'insurance_forms'];
    categories.forEach(category => {
      dispatch(fetchDocuments({ type: 'form', category }));
    });
  }, [dispatch]);

  // Combine all form documents from different categories
  const allForms = useMemo(() => {
    const categories = ['patient_intake', 'medical_history', 'consent_forms', 'insurance_forms'];
    const forms = [];
    
    categories.forEach(category => {
      const filterKey = `form-${category}`;
      const categoryDocs = documentsByFilter[filterKey] || [];
      categoryDocs.forEach(doc => {
        forms.push({
          ...doc,
          category: category,
        });
      });
    });
    
    return forms;
  }, [documentsByFilter]);

  // Theme-aware colors
  const accentColor = isDarkMode ? '#64ffda' : '#3EE4C8';
  const accentColorDark = isDarkMode ? '#4dd4b4' : '#2BC4A8';
  
  // Category colors
  const categoryColors = {
    patient_intake: isDarkMode ? '#64ffda' : '#3EE4C8',
    medical_history: isDarkMode ? '#60a5fa' : '#1976D2',
    consent_forms: isDarkMode ? '#a78bfa' : '#7B1FA2',
    insurance_forms: isDarkMode ? '#34d399' : '#2E7D32',
  };

  // Calculate category counts
  const categoriesWithCounts = useMemo(() => {
    return CATEGORIES.map(cat => ({
      ...cat,
      count: cat.id === 'all' 
        ? allForms.length 
        : allForms.filter(f => f.category === cat.id).length
    }));
  }, [allForms]);

  // Filter and sort forms
  const filteredForms = useMemo(() => {
    let forms = allForms.filter(form => {
      const matchesSearch = form.filename?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || form.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Apply sorting
    const sortConfig = SORT_OPTIONS.find(opt => opt.id === sortOption);
    if (sortConfig) {
      forms = [...forms].sort((a, b) => {
        let aVal = a[sortConfig.field];
        let bVal = b[sortConfig.field];

        // Handle different field types
        if (sortConfig.field === 'uploaded_at') {
          aVal = new Date(aVal).getTime();
          bVal = new Date(bVal).getTime();
        } else if (sortConfig.field === 'filename') {
          aVal = (aVal || '').toLowerCase();
          bVal = (bVal || '').toLowerCase();
        }

        if (sortConfig.order === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
    }

    return forms;
  }, [allForms, searchQuery, selectedCategory, sortOption]);

  // Paginated forms
  const paginatedForms = useMemo(() => {
    return filteredForms.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredForms, page, rowsPerPage]);

  // Menu handlers
  const handleMenuOpen = (event, form) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedForm(form);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedForm(null);
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // VIEW handler - Opens file in new tab
  const handleView = (form) => {
    if (form?.url) {
      window.open(form.url, '_blank', 'noopener,noreferrer');
    }
    handleMenuClose();
  };

  // DOWNLOAD handler
  const handleDownload = async (form) => {
    if (!form?.url) return;
    
    try {
      const response = await fetch(form.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = form.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setSnackbar({
        open: true,
        message: `Downloading "${form.filename}"...`,
        severity: 'info'
      });
    } catch (error) {
      console.error('Download failed:', error);
      setSnackbar({
        open: true,
        message: 'Failed to download file',
        severity: 'error'
      });
    }
    handleMenuClose();
  };

  // DELETE handler
  const handleDelete = async (form) => {
    if (!form) return;
    
    if (window.confirm(`Are you sure you want to delete "${form.filename}"?`)) {
      try {
        await dispatch(deleteDocument(form.id)).unwrap();
        dispatch(fetchDocuments({ type: 'form', category: form.category }));
        
        setSnackbar({
          open: true,
          message: `"${form.filename}" has been deleted.`,
          severity: 'success'
        });
        
        const newFilteredCount = filteredForms.length - 1;
        const maxPage = Math.max(0, Math.ceil(newFilteredCount / rowsPerPage) - 1);
        if (page > maxPage) {
          setPage(maxPage);
        }
      } catch (error) {
        console.error('Delete failed:', error);
        setSnackbar({
          open: true,
          message: 'Failed to delete document',
          severity: 'error'
        });
      }
    }
    handleMenuClose();
  };

  // Upload handlers
  const handleUploadClick = (category = 'patient_intake') => {
    setUploadCategory(category);
    setUploadModalOpen(true);
  };

  const handleUploadComplete = (doc) => {
    setUploadModalOpen(false);
    const categories = ['patient_intake', 'medical_history', 'consent_forms', 'insurance_forms'];
    categories.forEach(category => {
      dispatch(fetchDocuments({ type: 'form', category }));
    });
    
    setSnackbar({
      open: true,
      message: 'Document uploaded successfully!',
      severity: 'success'
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Helper functions
  const getCategoryIcon = (category) => {
    const cat = CATEGORIES.find(c => c.id === category);
    return cat ? cat.icon : FormsIcon;
  };

  const getCategoryLabel = (category) => {
    const cat = CATEGORIES.find(c => c.id === category);
    return cat ? cat.label : category;
  };

  const getFileIcon = (mimeType) => {
    if (mimeType?.startsWith('image/')) return ImageIcon;
    if (mimeType === 'application/pdf') return PdfIcon;
    return FileIcon;
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Common select styles
  const selectStyles = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: isDarkMode 
        ? 'rgba(255, 255, 255, 0.03)' 
        : 'rgba(255, 255, 255, 0.8)',
      borderRadius: '10px',
      fontSize: '0.875rem',
      '& fieldset': {
        borderColor: isDarkMode 
          ? 'rgba(255, 255, 255, 0.1)' 
          : 'rgba(11, 25, 41, 0.15)',
      },
      '&:hover fieldset': {
        borderColor: alpha(accentColor, 0.4),
      },
      '&.Mui-focused fieldset': {
        borderColor: accentColor,
        borderWidth: '1.5px',
      },
    },
    '& .MuiInputLabel-root': {
      color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
      fontSize: '0.875rem',
      '&.Mui-focused': {
        color: accentColor,
      },
    },
    '& .MuiSelect-select': {
      color: isDarkMode ? '#ffffff' : '#0B1929',
    },
    '& .MuiSelect-icon': {
      color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)',
    },
  };

  return (
    <Box sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      p: { xs: 2, sm: 3 },
    }}>
      {/* Header Section */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'stretch', md: 'flex-start' },
        gap: 2,
        mb: 3,
      }}>
        <Box>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700,
              color: isDarkMode ? '#ffffff' : '#0B1929',
              letterSpacing: '-0.02em',
              mb: 0.5,
              fontSize: { xs: '1.75rem', sm: '2rem' },
            }}
          >
            Digital Forms
          </Typography>
          <Typography 
            sx={{
              color: isDarkMode 
                ? 'rgba(255, 255, 255, 0.6)' 
                : 'rgba(11, 25, 41, 0.6)',
              fontSize: '0.95rem',
            }}
          >
            Manage all patient forms, consents, and documentation
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<UploadIcon />}
          onClick={() => handleUploadClick(selectedCategory === 'all' ? 'patient_intake' : selectedCategory)}
          sx={{
            background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColorDark} 100%)`,
            color: '#0B1929',
            fontWeight: 600,
            px: 3,
            py: 1.25,
            borderRadius: '10px',
            boxShadow: `0 4px 14px ${alpha(accentColor, 0.4)}`,
            flexShrink: 0,
            alignSelf: { xs: 'stretch', md: 'flex-start' },
            '&:hover': {
              background: `linear-gradient(135deg, ${accentColorDark} 0%, ${accentColor} 100%)`,
              boxShadow: `0 6px 20px ${alpha(accentColor, 0.5)}`,
            },
          }}
        >
          Upload Form
        </Button>
      </Box>

      {/* Search, Category Filter, and Sort - Single Row */}
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        mb: 3,
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'stretch', sm: 'center' },
      }}>
        {/* Search Bar */}
        <TextField
          placeholder="Search forms..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(0);
          }}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)', fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
          sx={{
            flex: 1,
            minWidth: { xs: '100%', sm: 200 },
            maxWidth: { sm: 300 },
            '& .MuiOutlinedInput-root': {
              backgroundColor: isDarkMode 
                ? 'rgba(255, 255, 255, 0.03)' 
                : 'rgba(255, 255, 255, 0.8)',
              borderRadius: '10px',
              '& fieldset': {
                borderColor: isDarkMode 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'rgba(11, 25, 41, 0.15)',
              },
              '&:hover fieldset': {
                borderColor: alpha(accentColor, 0.4),
              },
              '&.Mui-focused fieldset': {
                borderColor: accentColor,
                borderWidth: '1.5px',
              },
            },
            '& .MuiInputBase-input': {
              color: isDarkMode ? '#ffffff' : '#0B1929',
              fontSize: '0.875rem',
              '&::placeholder': {
                color: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
                opacity: 1,
              },
            },
          }}
        />

        {/* Category Dropdown */}
        <FormControl size="small" sx={{ minWidth: 160, ...selectStyles }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            label="Category"
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(0);
            }}
            IconComponent={ArrowDownIcon}
            MenuProps={{
              PaperProps: {
                sx: {
                  backgroundColor: isDarkMode 
                    ? 'rgba(17, 24, 39, 0.98)' 
                    : 'rgba(255, 255, 255, 0.98)',
                  backdropFilter: 'blur(20px)',
                  border: isDarkMode 
                    ? '1px solid rgba(255,255,255,0.1)' 
                    : '1px solid rgba(11, 25, 41, 0.1)',
                  borderRadius: '10px',
                  boxShadow: isDarkMode
                    ? '0 8px 32px rgba(0,0,0,0.4)'
                    : '0 8px 32px rgba(0,0,0,0.1)',
                  mt: 1,
                },
              },
            }}
          >
            {categoriesWithCounts.map((cat) => {
              const Icon = cat.icon;
              return (
                <MenuItem 
                  key={cat.id} 
                  value={cat.id}
                  sx={{
                    color: isDarkMode ? '#ffffff' : '#0B1929',
                    fontSize: '0.875rem',
                    py: 1.25,
                    '&:hover': {
                      backgroundColor: alpha(accentColor, 0.1),
                    },
                    '&.Mui-selected': {
                      backgroundColor: alpha(accentColor, 0.15),
                      '&:hover': {
                        backgroundColor: alpha(accentColor, 0.2),
                      },
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Icon sx={{ fontSize: 18, color: cat.id !== 'all' ? categoryColors[cat.id] : accentColor }} />
                    <span>{cat.label}</span>
                    <Chip 
                      label={cat.count} 
                      size="small" 
                      sx={{ 
                        height: 20, 
                        fontSize: '0.7rem',
                        ml: 'auto',
                        backgroundColor: isDarkMode 
                          ? 'rgba(255,255,255,0.1)' 
                          : 'rgba(11, 25, 41, 0.08)',
                        color: isDarkMode 
                          ? 'rgba(255,255,255,0.7)' 
                          : 'rgba(11, 25, 41, 0.7)',
                      }} 
                    />
                  </Box>
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        {/* Sort Dropdown */}
        <FormControl size="small" sx={{ minWidth: 160, ...selectStyles }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortOption}
            label="Sort By"
            onChange={(e) => setSortOption(e.target.value)}
            IconComponent={ArrowDownIcon}
            MenuProps={{
              PaperProps: {
                sx: {
                  backgroundColor: isDarkMode 
                    ? 'rgba(17, 24, 39, 0.98)' 
                    : 'rgba(255, 255, 255, 0.98)',
                  backdropFilter: 'blur(20px)',
                  border: isDarkMode 
                    ? '1px solid rgba(255,255,255,0.1)' 
                    : '1px solid rgba(11, 25, 41, 0.1)',
                  borderRadius: '10px',
                  boxShadow: isDarkMode
                    ? '0 8px 32px rgba(0,0,0,0.4)'
                    : '0 8px 32px rgba(0,0,0,0.1)',
                  mt: 1,
                },
              },
            }}
          >
            {SORT_OPTIONS.map((option) => (
              <MenuItem 
                key={option.id} 
                value={option.id}
                sx={{
                  color: isDarkMode ? '#ffffff' : '#0B1929',
                  fontSize: '0.875rem',
                  py: 1.25,
                  '&:hover': {
                    backgroundColor: alpha(accentColor, 0.1),
                  },
                  '&.Mui-selected': {
                    backgroundColor: alpha(accentColor, 0.15),
                    '&:hover': {
                      backgroundColor: alpha(accentColor, 0.2),
                    },
                  },
                }}
              >
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Results count - shows on right side */}
        <Box sx={{ 
          display: { xs: 'none', md: 'flex' }, 
          alignItems: 'center', 
          ml: 'auto',
          color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(11, 25, 41, 0.5)',
          fontSize: '0.875rem',
        }}>
          {filteredForms.length} {filteredForms.length === 1 ? 'form' : 'forms'}
        </Box>
      </Box>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress sx={{ color: accentColor }} />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Forms Table */}
      {!loading && (
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: isDarkMode 
              ? 'rgba(17, 24, 39, 0.5)' 
              : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            border: isDarkMode 
              ? '1px solid rgba(255, 255, 255, 0.08)' 
              : '1px solid rgba(11, 25, 41, 0.08)',
            borderRadius: '16px',
            overflow: 'hidden',
          }}
        >
          <TableContainer sx={{ flex: 1 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell 
                    sx={{ 
                      backgroundColor: isDarkMode 
                        ? 'rgba(17, 24, 39, 0.95)' 
                        : 'rgba(248, 250, 252, 0.95)',
                      color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(11, 25, 41, 0.7)',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderBottom: isDarkMode 
                        ? '1px solid rgba(255,255,255,0.08)' 
                        : '1px solid rgba(11, 25, 41, 0.08)',
                      py: 2,
                    }}
                  >
                    File Name
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      backgroundColor: isDarkMode 
                        ? 'rgba(17, 24, 39, 0.95)' 
                        : 'rgba(248, 250, 252, 0.95)',
                      color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(11, 25, 41, 0.7)',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderBottom: isDarkMode 
                        ? '1px solid rgba(255,255,255,0.08)' 
                        : '1px solid rgba(11, 25, 41, 0.08)',
                      py: 2,
                    }}
                  >
                    Category
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      backgroundColor: isDarkMode 
                        ? 'rgba(17, 24, 39, 0.95)' 
                        : 'rgba(248, 250, 252, 0.95)',
                      color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(11, 25, 41, 0.7)',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderBottom: isDarkMode 
                        ? '1px solid rgba(255,255,255,0.08)' 
                        : '1px solid rgba(11, 25, 41, 0.08)',
                      py: 2,
                      display: { xs: 'none', md: 'table-cell' },
                    }}
                  >
                    Uploaded
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      backgroundColor: isDarkMode 
                        ? 'rgba(17, 24, 39, 0.95)' 
                        : 'rgba(248, 250, 252, 0.95)',
                      color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(11, 25, 41, 0.7)',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderBottom: isDarkMode 
                        ? '1px solid rgba(255,255,255,0.08)' 
                        : '1px solid rgba(11, 25, 41, 0.08)',
                      py: 2,
                      display: { xs: 'none', lg: 'table-cell' },
                    }}
                  >
                    Size
                  </TableCell>
                  <TableCell 
                    align="right"
                    sx={{ 
                      backgroundColor: isDarkMode 
                        ? 'rgba(17, 24, 39, 0.95)' 
                        : 'rgba(248, 250, 252, 0.95)',
                      color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(11, 25, 41, 0.7)',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderBottom: isDarkMode 
                        ? '1px solid rgba(255,255,255,0.08)' 
                        : '1px solid rgba(11, 25, 41, 0.08)',
                      py: 2,
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedForms.map((form) => {
                  const CategoryIcon = getCategoryIcon(form.category);
                  const FileTypeIcon = getFileIcon(form.mime_type);
                  const categoryColor = categoryColors[form.category] || accentColor;
                  
                  return (
                    <TableRow 
                      key={form.id}
                      hover
                      sx={{
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease',
                        '&:hover': {
                          backgroundColor: isDarkMode 
                            ? 'rgba(100, 255, 218, 0.04)' 
                            : 'rgba(62, 228, 200, 0.04)',
                        },
                        '& td': {
                          borderBottom: isDarkMode 
                            ? '1px solid rgba(255,255,255,0.05)' 
                            : '1px solid rgba(11, 25, 41, 0.05)',
                        },
                      }}
                      onClick={() => handleView(form)}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: '10px',
                              backgroundColor: alpha(categoryColor, isDarkMode ? 0.15 : 0.1),
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <FileTypeIcon sx={{ color: categoryColor, fontSize: 20 }} />
                          </Box>
                          <Tooltip title={form.filename}>
                            <Typography 
                              sx={{ 
                                fontWeight: 500,
                                color: isDarkMode ? '#ffffff' : '#0B1929',
                                fontSize: '0.925rem',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                maxWidth: { xs: 150, sm: 250, md: 350 },
                              }}
                            >
                              {form.filename}
                            </Typography>
                          </Tooltip>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          icon={<CategoryIcon sx={{ fontSize: 14 }} />}
                          label={getCategoryLabel(form.category)}
                          sx={{
                            backgroundColor: alpha(categoryColor, isDarkMode ? 0.12 : 0.08),
                            color: categoryColor,
                            border: `1px solid ${alpha(categoryColor, 0.2)}`,
                            fontWeight: 500,
                            fontSize: '0.75rem',
                            '& .MuiChip-icon': {
                              color: categoryColor,
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                        <Typography 
                          sx={{ 
                            color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(11,25,41,0.6)',
                            fontSize: '0.875rem',
                          }}
                        >
                          {formatDate(form.uploaded_at)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>
                        <Typography 
                          sx={{ 
                            color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(11,25,41,0.6)',
                            fontSize: '0.875rem',
                          }}
                        >
                          {formatFileSize(form.file_size)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                          <Tooltip title="Open in new tab">
                            <IconButton 
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleView(form);
                              }}
                              sx={{
                                color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(11,25,41,0.5)',
                                '&:hover': {
                                  color: accentColor,
                                  backgroundColor: alpha(accentColor, 0.1),
                                },
                              }}
                            >
                              <OpenInNewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Download">
                            <IconButton 
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(form);
                              }}
                              sx={{
                                color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(11,25,41,0.5)',
                                '&:hover': {
                                  color: accentColor,
                                  backgroundColor: alpha(accentColor, 0.1),
                                },
                              }}
                            >
                              <DownloadIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="More options">
                            <IconButton 
                              size="small"
                              onClick={(e) => handleMenuOpen(e, form)}
                              sx={{
                                color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(11,25,41,0.5)',
                                '&:hover': {
                                  color: isDarkMode ? '#ffffff' : '#0B1929',
                                  backgroundColor: isDarkMode 
                                    ? 'rgba(255,255,255,0.1)' 
                                    : 'rgba(11,25,41,0.08)',
                                },
                              }}
                            >
                              <MoreIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
                
                {paginatedForms.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ py: 8, textAlign: 'center' }}>
                      <FormsIcon 
                        sx={{ 
                          fontSize: 48, 
                          color: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(11,25,41,0.15)',
                          mb: 2,
                        }} 
                      />
                      <Typography 
                        sx={{ 
                          color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(11,25,41,0.5)',
                          fontSize: '1rem',
                          mb: 2,
                        }}
                      >
                        {searchQuery ? 'No forms match your search' : 'No forms uploaded yet'}
                      </Typography>
                      {!searchQuery && (
                        <Button
                          variant="outlined"
                          startIcon={<UploadIcon />}
                          onClick={() => handleUploadClick()}
                          sx={{
                            borderColor: alpha(accentColor, 0.5),
                            color: accentColor,
                            '&:hover': {
                              borderColor: accentColor,
                              backgroundColor: alpha(accentColor, 0.1),
                            },
                          }}
                        >
                          Upload Your First Form
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {filteredForms.length > 0 && (
            <TablePagination
              component="div"
              count={filteredForms.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
              sx={{
                borderTop: isDarkMode 
                  ? '1px solid rgba(255,255,255,0.08)' 
                  : '1px solid rgba(11, 25, 41, 0.08)',
                color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(11,25,41,0.7)',
                '& .MuiTablePagination-select': {
                  color: isDarkMode ? '#ffffff' : '#0B1929',
                },
                '& .MuiTablePagination-selectIcon': {
                  color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(11,25,41,0.5)',
                },
                '& .MuiIconButton-root': {
                  color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(11,25,41,0.6)',
                  '&.Mui-disabled': {
                    color: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(11,25,41,0.2)',
                  },
                },
              }}
            />
          )}
        </Paper>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            backgroundColor: isDarkMode 
              ? 'rgba(17, 24, 39, 0.95)' 
              : 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            border: isDarkMode 
              ? '1px solid rgba(255,255,255,0.1)' 
              : '1px solid rgba(11, 25, 41, 0.1)',
            borderRadius: '12px',
            boxShadow: isDarkMode
              ? '0 8px 32px rgba(0,0,0,0.4)'
              : '0 8px 32px rgba(0,0,0,0.1)',
            minWidth: 180,
          },
        }}
      >
        <MenuItem 
          onClick={() => handleView(selectedForm)}
          sx={{ 
            py: 1.5,
            color: isDarkMode ? '#ffffff' : '#0B1929',
            '&:hover': {
              backgroundColor: alpha(accentColor, 0.1),
            },
          }}
        >
          <ListItemIcon>
            <OpenInNewIcon fontSize="small" sx={{ color: accentColor }} />
          </ListItemIcon>
          <ListItemText>Open in New Tab</ListItemText>
        </MenuItem>
        <MenuItem 
          onClick={() => handleDownload(selectedForm)}
          sx={{ 
            py: 1.5,
            color: isDarkMode ? '#ffffff' : '#0B1929',
            '&:hover': {
              backgroundColor: alpha(accentColor, 0.1),
            },
          }}
        >
          <ListItemIcon>
            <DownloadIcon fontSize="small" sx={{ color: isDarkMode ? '#60a5fa' : '#1976D2' }} />
          </ListItemIcon>
          <ListItemText>Download</ListItemText>
        </MenuItem>
        <Divider sx={{ my: 1, borderColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(11,25,41,0.08)' }} />
        <MenuItem 
          onClick={() => handleDelete(selectedForm)}
          sx={{ 
            py: 1.5,
            color: '#ef4444',
            '&:hover': {
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
            },
          }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" sx={{ color: '#ef4444' }} />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Upload Modal */}
      <UnifiedUploadModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUploadComplete={handleUploadComplete}
        documentType="form"
        category={uploadCategory}
        title={`Upload ${getCategoryLabel(uploadCategory)} Form`}
        allowedTypes="documents"
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ 
            borderRadius: '10px',
            backgroundColor: isDarkMode 
              ? 'rgba(17, 24, 39, 0.95)' 
              : undefined,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Forms;