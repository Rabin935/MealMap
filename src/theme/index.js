import { createTheme } from '@mui/material/styles';

// Custom color palette
const colors = {
  primary: {
    main: '#2D3250', // Deep navy blue
    light: '#424769',
    dark: '#1B1F3B',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#F76E11', // Vibrant orange
    light: '#FF8C3C',
    dark: '#D35400',
    contrastText: '#FFFFFF',
  },
  success: {
    main: '#4CAF50',
    light: '#66BB6A',
    dark: '#388E3C',
    contrastText: '#FFFFFF',
  },
  error: {
    main: '#F44336',
    light: '#EF5350',
    dark: '#D32F2F',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#FFC107',
    light: '#FFCA28',
    dark: '#FFA000',
    contrastText: '#000000',
  },
  info: {
    main: '#03A9F4',
    light: '#29B6F6',
    dark: '#0288D1',
    contrastText: '#FFFFFF',
  },
  grey: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  background: {
    light: '#FFFFFF',
    dark: '#121212',
  },
  accent: {
    orange: '#F76E11',
    teal: '#2DD4BF',
    purple: '#9333EA',
    pink: '#EC4899',
  },
};

// Custom shadows for light mode
const lightShadows = [
  'none',
  '0px 1px 2px rgba(15, 23, 42, 0.08)',
  '0px 2px 4px rgba(15, 23, 42, 0.08)',
  '0px 4px 8px rgba(15, 23, 42, 0.08)',
  '0px 6px 12px rgba(15, 23, 42, 0.08)',
  '0px 8px 16px rgba(15, 23, 42, 0.08)',
  '0px 12px 24px rgba(15, 23, 42, 0.12)',
  '0px 16px 32px rgba(15, 23, 42, 0.12)',
  '0px 20px 40px rgba(15, 23, 42, 0.12)',
  '0px 24px 48px rgba(15, 23, 42, 0.16)',
  '0px 28px 56px rgba(15, 23, 42, 0.16)',
  '0px 32px 64px rgba(15, 23, 42, 0.16)',
  '0px 36px 72px rgba(15, 23, 42, 0.16)',
  '0px 40px 80px rgba(15, 23, 42, 0.16)',
  '0px 44px 88px rgba(15, 23, 42, 0.16)',
  '0px 48px 96px rgba(15, 23, 42, 0.16)',
  '0px 52px 104px rgba(15, 23, 42, 0.16)',
  '0px 56px 112px rgba(15, 23, 42, 0.16)',
  '0px 60px 120px rgba(15, 23, 42, 0.16)',
  '0px 64px 128px rgba(15, 23, 42, 0.16)',
  '0px 68px 136px rgba(15, 23, 42, 0.16)',
  '0px 72px 144px rgba(15, 23, 42, 0.16)',
  '0px 76px 152px rgba(15, 23, 42, 0.16)',
  '0px 80px 160px rgba(15, 23, 42, 0.16)',
  '0px 84px 168px rgba(15, 23, 42, 0.16)',
];

// Custom shadows for dark mode
const darkShadows = [
  'none',
  '0px 1px 2px rgba(0, 0, 0, 0.24)',
  '0px 2px 4px rgba(0, 0, 0, 0.24)',
  '0px 4px 8px rgba(0, 0, 0, 0.24)',
  '0px 6px 12px rgba(0, 0, 0, 0.24)',
  '0px 8px 16px rgba(0, 0, 0, 0.24)',
  '0px 12px 24px rgba(0, 0, 0, 0.32)',
  '0px 16px 32px rgba(0, 0, 0, 0.32)',
  '0px 20px 40px rgba(0, 0, 0, 0.32)',
  '0px 24px 48px rgba(0, 0, 0, 0.36)',
  '0px 28px 56px rgba(0, 0, 0, 0.36)',
  '0px 32px 64px rgba(0, 0, 0, 0.36)',
  '0px 36px 72px rgba(0, 0, 0, 0.36)',
  '0px 40px 80px rgba(0, 0, 0, 0.36)',
  '0px 44px 88px rgba(0, 0, 0, 0.36)',
  '0px 48px 96px rgba(0, 0, 0, 0.36)',
  '0px 52px 104px rgba(0, 0, 0, 0.36)',
  '0px 56px 112px rgba(0, 0, 0, 0.36)',
  '0px 60px 120px rgba(0, 0, 0, 0.36)',
  '0px 64px 128px rgba(0, 0, 0, 0.36)',
  '0px 68px 136px rgba(0, 0, 0, 0.36)',
  '0px 72px 144px rgba(0, 0, 0, 0.36)',
  '0px 76px 152px rgba(0, 0, 0, 0.36)',
  '0px 80px 160px rgba(0, 0, 0, 0.36)',
  '0px 84px 168px rgba(0, 0, 0, 0.36)',
];

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...colors,
    ...(mode === 'light'
      ? {
          // Light mode
          background: {
            default: '#F8FAFC',
            paper: '#FFFFFF',
            card: '#FFFFFF',
          },
          text: {
            primary: colors.grey[900],
            secondary: colors.grey[600],
            disabled: colors.grey[400],
          },
          divider: 'rgba(0, 0, 0, 0.08)',
        }
      : {
          // Dark mode
          background: {
            default: '#0A0A0A',
            paper: '#1A1A1A',
            card: '#1A1A1A',
          },
          text: {
            primary: '#FFFFFF',
            secondary: colors.grey[400],
            disabled: colors.grey[600],
          },
          divider: 'rgba(255, 255, 255, 0.08)',
        }),
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '3.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.75rem',
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 700,
      fontSize: '2.25rem',
      lineHeight: 1.2,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.3,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    subtitle1: {
      fontSize: '1.125rem',
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
    },
    subtitle2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      letterSpacing: '0.00714em',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      letterSpacing: '0.00938em',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      letterSpacing: '0.00714em',
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0,0,0,0.05)',
    '0px 4px 8px rgba(0,0,0,0.08)',
    '0px 8px 16px rgba(0,0,0,0.10)',
    '0px 12px 24px rgba(0,0,0,0.12)',
    '0px 16px 32px rgba(0,0,0,0.14)',
    ...Array(19).fill('none'), // Fill remaining shadows
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 20px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
            transform: 'translateY(-1px)',
          },
          transition: 'all 0.2s ease-in-out',
        },
        containedPrimary: {
          background: `linear-gradient(45deg, ${colors.primary.dark} 0%, ${colors.primary.main} 100%)`,
          '&:hover': {
            background: `linear-gradient(45deg, ${colors.primary.main} 0%, ${colors.primary.light} 100%)`,
          },
        },
        containedSecondary: {
          background: `linear-gradient(45deg, ${colors.secondary.dark} 0%, ${colors.secondary.main} 100%)`,
          '&:hover': {
            background: `linear-gradient(45deg, ${colors.secondary.main} 0%, ${colors.secondary.light} 100%)`,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: mode === 'light' 
            ? '0px 4px 20px rgba(0, 0, 0, 0.05)'
            : '0px 4px 20px rgba(0, 0, 0, 0.3)',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: mode === 'light'
              ? '0px 8px 30px rgba(0, 0, 0, 0.08)'
              : '0px 8px 30px rgba(0, 0, 0, 0.4)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          '&.MuiChip-colorPrimary': {
            background: `linear-gradient(45deg, ${colors.primary.dark} 0%, ${colors.primary.main} 100%)`,
          },
          '&.MuiChip-colorSecondary': {
            background: `linear-gradient(45deg, ${colors.secondary.dark} 0%, ${colors.secondary.main} 100%)`,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: mode === 'light' ? 'rgba(0, 0, 0, 0.02)' : 'rgba(255, 255, 255, 0.05)',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: mode === 'light' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.08)',
            },
            '&.Mui-focused': {
              backgroundColor: mode === 'light' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.08)',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: mode === 'light'
            ? `linear-gradient(45deg, ${colors.primary.dark} 0%, ${colors.primary.main} 100%)`
            : `linear-gradient(45deg, ${colors.grey[900]} 0%, ${colors.grey[800]} 100%)`,
          boxShadow: mode === 'light'
            ? '0px 2px 10px rgba(0, 0, 0, 0.1)'
            : '0px 2px 10px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export const getTheme = (mode) => createTheme(getDesignTokens(mode)); 