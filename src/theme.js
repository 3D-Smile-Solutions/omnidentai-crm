import { createTheme } from '@mui/material/styles';
import '@fontsource/montserrat';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0B1929',
      light: '#1e3a5f',
      dark: '#051119',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#3EE4C8',
      light: '#6FEDD6',
      dark: '#2BC4A8',
      contrastText: '#0B1929',
    },
    background: {
      default: 'linear-gradient(135deg, #f5f7fa 0%, #e8f4f8 100%)',
      paper: '#ffffff',
    },
    text: {
      primary: '#0B1929',
      secondary: 'rgba(11, 25, 41, 0.7)',
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

export default theme;