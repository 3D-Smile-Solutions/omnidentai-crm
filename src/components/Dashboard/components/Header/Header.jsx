// frontend/src/components/Dashboard/components/Header/Header.jsx
import React, { useState, useRef, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Box,
  InputBase,
  alpha,
  ClickAwayListener,
  Slide,
  useMediaQuery,
  Tooltip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import UserMenu from './UserMenu';
import GlobalSearchResults from '../../Globalsearchresults.jsx';
import { DRAWER_WIDTH } from '../../utils/constants';
import { useTheme } from '../../../../context/ThemeContext';

const Header = ({ 
  currentUser, 
  anchorEl, 
  onDrawerToggle, 
  onMenuOpen, 
  onMenuClose, 
  onLogout,
  searchQuery = '',
  onSearchChange,
  searchResults = {},
  onSearchResultClick
}) => {
  const { isDarkMode } = useTheme();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const searchInputRef = useRef(null);
  const mobileSearchInputRef = useRef(null);
  const isMobile = useMediaQuery('(max-width:600px)');

  const getInitials = () => {
    if (!currentUser) return 'D';
    
    const firstName = currentUser.first_name || currentUser.firstName || '';
    const lastName = currentUser.last_name || currentUser.lastName || '';
    
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    } else if (firstName) {
      return firstName.slice(0, 2).toUpperCase();
    } else if (currentUser.email) {
      return currentUser.email[0].toUpperCase();
    }
    
    return 'D';
  };

  const formatDate = () => {
    const today = new Date();
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return today.toLocaleDateString('en-US', options);
  };

  const handleSearchChange = (event) => {
    if (onSearchChange) {
      onSearchChange(event.target.value);
    }
  };

  const handleClearSearch = () => {
    if (onSearchChange) {
      onSearchChange('');
    }
    setIsSearchFocused(false);
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleClickAway = () => {
    setIsSearchFocused(false);
  };

  const handleResultClick = (navIndex, item, category) => {
    setIsSearchFocused(false);
    setIsMobileSearchOpen(false);
    if (onSearchResultClick) {
      onSearchResultClick(navIndex, item, category);
    }
  };

  const handleSettingsClick = () => {
    // Navigate to Settings (index 5)
    if (onSearchResultClick) {
      onSearchResultClick(5, null, 'settings');
    }
  };

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Cmd/Ctrl + K to focus search
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        if (isMobile) {
          setIsMobileSearchOpen(true);
        } else {
          searchInputRef.current?.focus();
        }
      }
      // Escape to close search
      if (event.key === 'Escape') {
        setIsSearchFocused(false);
        setIsMobileSearchOpen(false);
        searchInputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobile]);

  // Focus mobile search input when overlay opens
  useEffect(() => {
    if (isMobileSearchOpen && mobileSearchInputRef.current) {
      setTimeout(() => {
        mobileSearchInputRef.current?.focus();
      }, 300);
    }
  }, [isMobileSearchOpen]);

  const handleMobileSearchOpen = () => {
    setIsMobileSearchOpen(true);
  };

  const handleMobileSearchClose = () => {
    setIsMobileSearchOpen(false);
    if (onSearchChange) {
      onSearchChange('');
    }
  };

  // Mobile Search Overlay Component
  const MobileSearchOverlay = () => (
    <Slide direction="down" in={isMobileSearchOpen} mountOnEnter unmountOnExit>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1300,
          background: isDarkMode 
            ? 'rgba(17, 24, 39, 0.98)'
            : 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Mobile Search Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            p: 2,
            borderBottom: isDarkMode 
              ? '1px solid rgba(100, 255, 218, 0.1)' 
              : '1px solid rgba(62, 228, 200, 0.2)',
          }}
        >
          <IconButton
            onClick={handleMobileSearchClose}
            sx={{
              color: isDarkMode ? '#64ffda' : '#0B1929',
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          
          <Box
            sx={{
              flex: 1,
              position: 'relative',
              borderRadius: '12px',
              backgroundColor: isDarkMode 
                ? alpha('#64ffda', 0.08)
                : alpha('#0B1929', 0.04),
              border: '1px solid',
              borderColor: isDarkMode 
                ? 'rgba(100, 255, 218, 0.2)'
                : 'rgba(62, 228, 200, 0.25)',
            }}
          >
            <Box
              sx={{
                padding: '0 12px',
                height: '100%',
                position: 'absolute',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <SearchIcon 
                sx={{ 
                  color: isDarkMode 
                    ? 'rgba(100, 255, 218, 0.6)' 
                    : 'rgba(11, 25, 41, 0.5)',
                  fontSize: '1.25rem',
                }} 
              />
            </Box>
            <InputBase
              inputRef={mobileSearchInputRef}
              placeholder="Search everything..."
              value={searchQuery}
              onChange={handleSearchChange}
              fullWidth
              sx={{
                color: isDarkMode ? '#e2e8f0' : '#0B1929',
                '& .MuiInputBase-input': {
                  padding: '12px 12px 12px 44px',
                  fontSize: '1rem',
                  '&::placeholder': {
                    color: isDarkMode 
                      ? 'rgba(226, 232, 240, 0.5)' 
                      : 'rgba(11, 25, 41, 0.45)',
                    opacity: 1,
                  },
                },
              }}
            />
            {searchQuery && (
              <IconButton
                size="small"
                onClick={() => onSearchChange && onSearchChange('')}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: isDarkMode 
                    ? 'rgba(100, 255, 218, 0.6)' 
                    : 'rgba(11, 25, 41, 0.5)',
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Box>

        {/* Mobile Search Results */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          <GlobalSearchResults
            results={searchResults}
            searchQuery={searchQuery}
            onResultClick={handleResultClick}
            isVisible={searchQuery.trim().length > 0}
            isMobile={true}
          />
        </Box>
      </Box>
    </Slide>
  );

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
          background: isDarkMode 
            ? 'rgba(17, 24, 39, 0.25)'
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: isDarkMode 
            ? '1px solid rgba(100, 255, 218, 0.1)' 
            : '1px solid rgba(62, 228, 200, 0.3)',
          boxShadow: isDarkMode
            ? '0 4px 20px rgba(0, 0, 0, 0.15)'
            : '0 4px 20px rgba(62, 228, 200, 0.15)',
        }}
      >
        <Toolbar sx={{ 
          px: { xs: 2, sm: 3 },
          py: 1,
          minHeight: { xs: 64, sm: 70 },
          gap: { xs: 1, sm: 2 },
        }}>
          {/* Mobile Menu Button */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={onDrawerToggle}
            sx={{ 
              display: { sm: 'none' },
              color: isDarkMode ? '#64ffda' : '#0B1929',
              flexShrink: 0,
              '&:hover': {
                backgroundColor: isDarkMode 
                  ? 'rgba(100, 255, 218, 0.08)'
                  : 'rgba(62, 228, 200, 0.08)',
              }
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* Mobile Search Button */}
          <IconButton
            onClick={handleMobileSearchOpen}
            sx={{
              display: { xs: 'flex', sm: 'none' },
              color: isDarkMode ? '#64ffda' : '#0B1929',
              backgroundColor: isDarkMode 
                ? 'rgba(100, 255, 218, 0.08)'
                : 'rgba(62, 228, 200, 0.08)',
              '&:hover': {
                backgroundColor: isDarkMode 
                  ? 'rgba(100, 255, 218, 0.12)'
                  : 'rgba(62, 228, 200, 0.12)',
              }
            }}
          >
            <SearchIcon />
          </IconButton>

          {/* Desktop/Tablet Search Bar */}
          <ClickAwayListener onClickAway={handleClickAway}>
            <Box
              sx={{
                position: 'relative',
                display: { xs: 'none', sm: 'block' },
                flexGrow: 1,
                maxWidth: { sm: 360, md: 400 },
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: '12px',
                  backgroundColor: isDarkMode 
                    ? alpha('#64ffda', 0.08)
                    : alpha('#0B1929', 0.04),
                  border: '1px solid',
                  borderColor: isDarkMode 
                    ? 'rgba(100, 255, 218, 0.15)'
                    : 'rgba(62, 228, 200, 0.2)',
                  '&:hover': {
                    backgroundColor: isDarkMode 
                      ? alpha('#64ffda', 0.12)
                      : alpha('#0B1929', 0.06),
                    borderColor: isDarkMode 
                      ? 'rgba(100, 255, 218, 0.25)'
                      : 'rgba(62, 228, 200, 0.35)',
                  },
                  boxShadow: isSearchFocused 
                    ? (isDarkMode 
                      ? '0 0 0 3px rgba(100, 255, 218, 0.1)'
                      : '0 0 0 3px rgba(62, 228, 200, 0.1)')
                    : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <Box
                  sx={{
                    padding: '0 16px',
                    height: '100%',
                    position: 'absolute',
                    pointerEvents: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <SearchIcon 
                    sx={{ 
                      color: isDarkMode 
                        ? 'rgba(100, 255, 218, 0.6)' 
                        : 'rgba(11, 25, 41, 0.5)',
                      fontSize: '1.25rem',
                    }} 
                  />
                </Box>
                <InputBase
                  inputRef={searchInputRef}
                  placeholder="Search everything..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  sx={{
                    color: isDarkMode ? '#e2e8f0' : '#0B1929',
                    width: '100%',
                    '& .MuiInputBase-input': {
                      padding: '10px 40px 10px 48px',
                      fontSize: '0.9rem',
                      '&::placeholder': {
                        color: isDarkMode 
                          ? 'rgba(226, 232, 240, 0.5)' 
                          : 'rgba(11, 25, 41, 0.45)',
                        opacity: 1,
                      },
                    },
                  }}
                  inputProps={{ 'aria-label': 'global search' }}
                />
                {searchQuery && (
                  <IconButton
                    size="small"
                    onClick={handleClearSearch}
                    sx={{
                      position: 'absolute',
                      right: 8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: isDarkMode 
                        ? 'rgba(100, 255, 218, 0.6)' 
                        : 'rgba(11, 25, 41, 0.5)',
                      '&:hover': {
                        color: isDarkMode ? '#64ffda' : '#0B1929',
                      }
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>

              {/* Search Results Dropdown */}
              <GlobalSearchResults
                results={searchResults}
                searchQuery={searchQuery}
                onResultClick={handleResultClick}
                isVisible={isSearchFocused && searchQuery.trim().length > 0}
              />
            </Box>
          </ClickAwayListener>

          {/* Today's Date - Desktop */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              px: 2,
              py: 0.75,
              borderRadius: '10px',
              backgroundColor: isDarkMode 
                ? 'rgba(100, 255, 218, 0.06)'
                : 'rgba(62, 228, 200, 0.08)',
              border: '1px solid',
              borderColor: isDarkMode 
                ? 'rgba(100, 255, 218, 0.1)'
                : 'rgba(62, 228, 200, 0.15)',
              flexShrink: 0,
              whiteSpace: 'nowrap',
            }}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 500,
                fontSize: '0.85rem',
                color: isDarkMode ? '#94a3b8' : '#475569',
                letterSpacing: '0.01em',
              }}
            >
              {formatDate()}
            </Typography>
          </Box>

          {/* Compact Date for Tablets */}
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex', md: 'none' },
              alignItems: 'center',
              px: 1.5,
              py: 0.5,
              borderRadius: '8px',
              backgroundColor: isDarkMode 
                ? 'rgba(100, 255, 218, 0.06)'
                : 'rgba(62, 228, 200, 0.08)',
              flexShrink: 0,
            }}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 500,
                fontSize: '0.8rem',
                color: isDarkMode ? '#94a3b8' : '#475569',
              }}
            >
              {new Date().toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </Typography>
          </Box>

          {/* Spacer to push icons to far right */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Settings Icon */}
          <Tooltip title="Settings" arrow>
            <IconButton 
              onClick={handleSettingsClick}
              sx={{ 
                color: isDarkMode ? 'rgba(100, 255, 218, 0.7)' : 'rgba(11, 25, 41, 0.6)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: isDarkMode ? '#64ffda' : '#0B1929',
                  backgroundColor: isDarkMode 
                    ? 'rgba(100, 255, 218, 0.1)'
                    : 'rgba(62, 228, 200, 0.1)',
                  transform: 'rotate(45deg)',
                }
              }}
            >
              <SettingsIcon sx={{ fontSize: { xs: 22, sm: 24 } }} />
            </IconButton>
          </Tooltip>

          {/* User Avatar Button */}
          <IconButton 
            onClick={onMenuOpen}
            sx={{ 
              p: 0.5,
              flexShrink: 0,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              }
            }}
          >
            <Avatar 
              sx={{ 
                width: { xs: 36, sm: 40 }, 
                height: { xs: 36, sm: 40 },
                background: isDarkMode
                  ? 'linear-gradient(135deg, #64ffda 0%, #a78bfa 100%)'
                  : 'linear-gradient(135deg, #3EE4C8 0%, #0B1929 100%)',
                fontSize: { xs: '0.85rem', sm: '0.95rem' },
                fontWeight: 600,
                border: '2px solid',
                borderColor: isDarkMode 
                  ? 'rgba(100, 255, 218, 0.3)'
                  : 'rgba(62, 228, 200, 0.3)',
                boxShadow: isDarkMode
                  ? '0 4px 12px rgba(100, 255, 218, 0.2)'
                  : '0 4px 12px rgba(62, 228, 200, 0.2)',
                '&:hover': {
                  borderColor: isDarkMode 
                    ? 'rgba(100, 255, 218, 0.5)'
                    : 'rgba(62, 228, 200, 0.5)',
                }
              }}
            >
              {getInitials()}
            </Avatar>
          </IconButton>

          <UserMenu 
            anchorEl={anchorEl}
            onClose={onMenuClose}
            onLogout={onLogout}
          />
        </Toolbar>
      </AppBar>

      {/* Mobile Search Overlay */}
      <MobileSearchOverlay />
    </>
  );
};

export default Header;