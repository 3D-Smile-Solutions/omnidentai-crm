import { createTheme } from '@mui/material/styles';
import '@fontsource/montserrat';

export const getTheme = (isDarkMode) => createTheme({
  palette: {
    mode: isDarkMode ? 'dark' : 'light',
    primary: {
      main: isDarkMode ? '#3EE4C8' : '#0B1929',
      light: isDarkMode ? '#6FEDD6' : '#1e3a5f',
      dark: isDarkMode ? '#2BC4A8' : '#051119',
      contrastText: isDarkMode ? '#0B1929' : '#ffffff',
    },
    secondary: {
      main: isDarkMode ? '#0B1929' : '#3EE4C8',
      light: isDarkMode ? '#1e3a5f' : '#6FEDD6',
      dark: isDarkMode ? '#051119' : '#2BC4A8',
      contrastText: isDarkMode ? '#ffffff' : '#0B1929',
    },
    background: {
      default: isDarkMode ? '#0a0e1a' : '#fafbfc',
      paper: isDarkMode ? '#0B1929' : '#ffffff',
    },
    text: {
      primary: isDarkMode ? '#ffffff' : '#ffffff',
      secondary: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.7)',
    },
    success: {
      main: '#3EE4C8',
      light: '#6FEDD6',
      dark: '#2BC4A8',
    },
    info: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
    },
  },
  typography: {
    fontFamily: [
      '"Montserrat"',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
      },
    },
  },
});

// Add default export for backward compatibility
const defaultTheme = getTheme(false);
export default defaultTheme;