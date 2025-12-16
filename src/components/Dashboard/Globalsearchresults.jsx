// frontend/src/components/Dashboard/components/Header/GlobalSearchResults.jsx
import React from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  alpha
} from '@mui/material';
import {
  Person as PersonIcon,
  Description as FormsIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { useTheme } from '../../context/ThemeContext';

const GlobalSearchResults = ({ 
  results, 
  searchQuery, 
  onResultClick, 
  isVisible,
  isMobile = false
}) => {
  const { isDarkMode } = useTheme();

  if (!isVisible || !searchQuery.trim()) return null;

  const hasResults = Object.values(results).some(arr => arr.length > 0);

  const categoryConfig = {
    patients: {
      icon: PersonIcon,
      label: 'Patients',
      color: '#3EE4C8',
      navIndex: 1
    },
    forms: {
      icon: FormsIcon,
      label: 'Forms',
      color: '#a78bfa',
      navIndex: 2
    },
    reports: {
      icon: ReportsIcon,
      label: 'Reports',
      color: '#f472b6',
      navIndex: 3
    },
    settings: {
      icon: SettingsIcon,
      label: 'Settings',
      color: '#fbbf24',
      navIndex: 5
    }
  };

  const handleItemClick = (category, item) => {
    const config = categoryConfig[category];
    onResultClick(config.navIndex, item, category);
  };

  // For mobile, render without the Paper wrapper (it's inside the overlay)
  const ResultsContent = () => (
    <>
      {!hasResults ? (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <SearchIcon 
            sx={{ 
              fontSize: 48, 
              color: isDarkMode 
                ? 'rgba(100, 255, 218, 0.3)' 
                : 'rgba(62, 228, 200, 0.4)',
              mb: 2
            }} 
          />
          <Typography 
            variant="body1" 
            sx={{ 
              color: isDarkMode ? '#94a3b8' : '#64748b',
              fontWeight: 500
            }}
          >
            No results found for "{searchQuery}"
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: isDarkMode ? '#64748b' : '#94a3b8',
              mt: 1
            }}
          >
            Try searching for patients, forms, reports, or settings
          </Typography>
        </Box>
      ) : (
        <Box sx={{ py: 1 }}>
          {Object.entries(results).map(([category, items], categoryIndex) => {
            if (!items || items.length === 0) return null;
            
            const config = categoryConfig[category];
            const IconComponent = config.icon;

            return (
              <Box key={category}>
                {categoryIndex > 0 && items.length > 0 && (
                  <Divider sx={{ 
                    borderColor: isDarkMode 
                      ? 'rgba(100, 255, 218, 0.1)' 
                      : 'rgba(62, 228, 200, 0.15)',
                    my: 1
                  }} />
                )}
                
                {/* Category Header */}
                <Box sx={{ 
                  px: 2, 
                  py: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <Chip
                    size="small"
                    label={config.label}
                    icon={<IconComponent sx={{ fontSize: '1rem !important' }} />}
                    sx={{
                      backgroundColor: alpha(config.color, isDarkMode ? 0.15 : 0.1),
                      color: isDarkMode ? config.color : config.color,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      '& .MuiChip-icon': {
                        color: 'inherit'
                      }
                    }}
                  />
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: isDarkMode ? '#64748b' : '#94a3b8',
                    }}
                  >
                    {items.length} result{items.length !== 1 ? 's' : ''}
                  </Typography>
                </Box>

                {/* Results List */}
                <List dense sx={{ py: 0 }}>
                  {items.slice(0, 5).map((item, index) => (
                    <ListItem
                      key={item.id || index}
                      onClick={() => handleItemClick(category, item)}
                      sx={{
                        px: 2,
                        py: 1,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        '&:hover': {
                          backgroundColor: isDarkMode 
                            ? alpha(config.color, 0.1)
                            : alpha(config.color, 0.08),
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <IconComponent 
                          sx={{ 
                            fontSize: '1.25rem',
                            color: isDarkMode 
                              ? alpha(config.color, 0.7)
                              : alpha(config.color, 0.8)
                          }} 
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: 500,
                              color: isDarkMode ? '#e2e8f0' : '#1e293b'
                            }}
                          >
                            {item.title || item.name || `${item.first_name || item.firstName || ''} ${item.last_name || item.lastName || ''}`.trim() || 'Untitled'}
                          </Typography>
                        }
                        secondary={
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: isDarkMode ? '#64748b' : '#94a3b8'
                            }}
                          >
                            {item.subtitle || item.email || item.description || item.type || ''}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                  
                  {items.length > 5 && (
                    <ListItem
                      onClick={() => handleItemClick(category, null)}
                      sx={{
                        px: 2,
                        py: 1,
                        cursor: 'pointer',
                        justifyContent: 'center',
                        '&:hover': {
                          backgroundColor: isDarkMode 
                            ? 'rgba(100, 255, 218, 0.05)'
                            : 'rgba(62, 228, 200, 0.05)',
                        }
                      }}
                    >
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: isDarkMode ? '#64ffda' : '#0B1929',
                          fontWeight: 600
                        }}
                      >
                        View all {items.length} results in {config.label}
                      </Typography>
                    </ListItem>
                  )}
                </List>
              </Box>
            );
          })}
        </Box>
      )}
    </>
  );

  // For mobile, return content without Paper wrapper
  if (isMobile) {
    return <ResultsContent />;
  }

  // For desktop, return with Paper wrapper
  return (
    <Paper
      elevation={8}
      sx={{
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        mt: 1,
        maxHeight: '70vh',
        overflow: 'auto',
        zIndex: 1300,
        borderRadius: '12px',
        backgroundColor: isDarkMode 
          ? 'rgba(17, 24, 39, 0.98)'
          : 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(20px)',
        border: '1px solid',
        borderColor: isDarkMode 
          ? 'rgba(100, 255, 218, 0.15)'
          : 'rgba(62, 228, 200, 0.2)',
        boxShadow: isDarkMode
          ? '0 20px 40px rgba(0, 0, 0, 0.4)'
          : '0 20px 40px rgba(0, 0, 0, 0.15)',
        // Custom scrollbar
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: isDarkMode 
            ? 'rgba(100, 255, 218, 0.3)' 
            : 'rgba(62, 228, 200, 0.3)',
          borderRadius: '3px',
        },
      }}
    >
      <ResultsContent />
    </Paper>
  );
};

export default GlobalSearchResults;