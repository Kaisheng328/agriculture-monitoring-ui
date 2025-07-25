import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';

const AppBar: Components<Omit<Theme, 'components'>>['MuiAppBar'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      padding: 0,
      borderRadius: 0,
      // backgroundColor: theme.palette.transparent.info.main, // Old background
      backgroundColor: theme.palette.mode === 'dark' 
        ? theme.palette.background.paper // Use surface color from darkPalette
        : theme.palette.transparent.info.main, // Keep original for light mode
      color: theme.palette.text.primary, // Ensure text color contrasts with new AppBar bg
      backdropFilter: 'blur(10px)',
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      zIndex: 1200,
    }),
  },
};

export default AppBar;
