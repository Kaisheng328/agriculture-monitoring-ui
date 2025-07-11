import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';

const Card: Components<Omit<Theme, 'components'>>['MuiCard'] = {
  styleOverrides: {
    root: ({ theme }) => {
      const isDarkMode = theme.palette.mode === 'dark';
      return {
        padding: 0, // Original padding
        backgroundColor: isDarkMode ? theme.palette.background.paper : undefined, // Use paper color in dark mode
        // If cards in light mode had a specific background (e.g. white), set it for light mode.
        // Otherwise, 'undefined' will let it default, which is usually fine.
      };
    },
  },
};

export default Card;
