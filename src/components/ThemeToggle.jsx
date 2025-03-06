import { IconButton, Tooltip, useTheme } from '@mui/material';
import { LightMode as LightModeIcon, DarkMode as DarkModeIcon } from '@mui/icons-material';
import { useTheme as useAppTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { mode, toggleTheme } = useAppTheme();
  const theme = useTheme();

  return (
    <Tooltip title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}>
      <IconButton 
        onClick={toggleTheme} 
        size="small"
        sx={{
          borderRadius: '12px',
          backgroundColor: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(0, 0, 0, 0.05)',
          color: theme.palette.mode === 'dark'
            ? theme.palette.common.white
            : theme.palette.grey[800],
          '&:hover': {
            backgroundColor: theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.2)'
              : 'rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle; 