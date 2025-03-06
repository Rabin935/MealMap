import { createContext, useContext, useState, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('themeMode');
    return savedMode || 'light';
  });

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#2A6470',
            light: '#3C8A99',
            dark: '#1B4B54',
            contrastText: '#FFFFFF',
          },
          secondary: {
            main: '#E8AA9B',
            light: '#F4C3B7',
            dark: '#D88D7B',
            contrastText: '#2A2A2A',
          },
          accent: {
            main: '#F7D794',
            light: '#FFE9B1',
            dark: '#E5C16F',
            contrastText: '#2A2A2A',
          },
          background: {
            default: mode === 'light' ? '#F8F9FA' : '#121212',
            paper: mode === 'light' ? '#FFFFFF' : '#1E1E1E',
            navbar: mode === 'light' 
              ? 'linear-gradient(135deg, #2A6470 0%, #3C8A99 100%)'
              : 'linear-gradient(135deg, #1B4B54 0%, #2A6470 100%)',
          },
          text: {
            primary: mode === 'light' ? '#2A2A2A' : '#FFFFFF',
            secondary: mode === 'light' ? '#666666' : '#B0B0B0',
          },
        },
        typography: {
          fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
          h1: {
            fontWeight: 700,
            letterSpacing: '-0.02em',
          },
          h2: {
            fontWeight: 600,
            letterSpacing: '-0.01em',
          },
          h3: {
            fontWeight: 600,
          },
          h4: {
            fontWeight: 600,
          },
          h5: {
            fontWeight: 500,
          },
          h6: {
            fontWeight: 500,
          },
          button: {
            textTransform: 'none',
            fontWeight: 500,
          },
        },
        shape: {
          borderRadius: 12,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                textTransform: 'none',
                fontWeight: 500,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 12px rgba(42, 100, 112, 0.15)',
                },
              },
              contained: {
                background: 'linear-gradient(135deg, #2A6470 0%, #3C8A99 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1B4B54 0%, #2A6470 100%)',
                },
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: 16,
                backgroundImage: 'none',
              },
              elevation1: {
                boxShadow: mode === 'light' 
                  ? '0 2px 12px rgba(0,0,0,0.05)'
                  : '0 2px 12px rgba(0,0,0,0.2)',
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 16,
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: mode === 'light'
                    ? '0 12px 24px rgba(42, 100, 112, 0.12)'
                    : '0 12px 24px rgba(0, 0, 0, 0.3)',
                },
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
                boxShadow: mode === 'light'
                  ? '0 2px 12px rgba(42, 100, 112, 0.08)'
                  : '0 2px 12px rgba(0, 0, 0, 0.2)',
              },
            },
          },
        },
      }),
    [mode]
  );

  const value = {
    mode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider; 