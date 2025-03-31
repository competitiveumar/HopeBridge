import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50', // Green color for primary actions
      light: '#80E27E',
      dark: '#087f23',
      contrastText: '#fff',
    },
    secondary: {
      main: '#2196F3', // Blue color for secondary actions
      light: '#6EC6FF',
      dark: '#0069C0',
      contrastText: '#fff',
    },
    error: {
      main: '#F44336',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
  },
  // Enhanced breakpoints for better responsiveness
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      '@media (max-width:600px)': {
        fontSize: '2rem',
      },
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.3,
      '@media (max-width:600px)': {
        fontSize: '1.75rem',
      },
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.4,
      '@media (max-width:600px)': {
        fontSize: '1.5rem',
      },
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
      '@media (max-width:600px)': {
        fontSize: '1.25rem',
      },
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
      lineHeight: 1.4,
      '@media (max-width:600px)': {
        fontSize: '1.1rem',
      },
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.4,
      '@media (max-width:600px)': {
        fontSize: '0.9rem',
      },
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
    body1: {
      '@media (max-width:600px)': {
        fontSize: '0.95rem',
      },
    },
    body2: {
      '@media (max-width:600px)': {
        fontSize: '0.85rem',
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 30,
          padding: '8px 24px',
          boxShadow: '0 3px 5px 2px rgba(0, 0, 0, 0.1)',
          '@media (max-width:600px)': {
            padding: '6px 16px',
            fontSize: '0.85rem',
          },
        },
        sizeLarge: {
          padding: '12px 32px',
          fontSize: '1.1rem',
          '@media (max-width:600px)': {
            padding: '10px 24px',
            fontSize: '1rem',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.05)',
          borderRadius: 16,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.23)',
              borderWidth: '1px',
              boxShadow: 'none',
            },
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: 'rgba(0, 0, 0, 0.87)', // Default text color when focused
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(0, 0, 0, 0.23)',
            borderWidth: '1px',
            boxShadow: 'none',
          },
        },
      },
    },
    // Enhanced container responsiveness
    MuiContainer: {
      styleOverrides: {
        root: {
          '@media (max-width:600px)': {
            padding: '0 16px',
          },
        },
      },
    },
  },
});

export default theme; 