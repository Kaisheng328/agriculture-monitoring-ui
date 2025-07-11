import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';
import { darkThemeColors } from '../../colors'; // Import darkThemeColors directly

const Paper: Components<Omit<Theme, 'components'>>['MuiPaper'] = {
  styleOverrides: {
    root: ({ theme }) => {
      let MuiPaperBackgroundColor;

      if (theme.palette.mode === 'dark') {
        MuiPaperBackgroundColor = darkThemeColors.surface; // Use the direct dark surface color
      } else {
        // In light mode, use a pure white or slightly off-white to create contrast
        // against the info.lighter background
        MuiPaperBackgroundColor = '#ffffff'; // Pure white
        // Alternative options:
        // MuiPaperBackgroundColor = '#fafafa'; // Very light gray
        // MuiPaperBackgroundColor = theme.palette.background.paper; // MUI default paper color
      }

      return {
        padding: theme.spacing(3.5),
        backgroundColor: MuiPaperBackgroundColor,
        borderRadius: theme.shape.borderRadius * 2.5,
        boxShadow: 'none',

        // Add a subtle shadow in light mode to enhance the separation
        ...(theme.palette.mode === 'light' && {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.12)',
        }),

        // Apply to all Paper variants including small components
        '&.MuiPaper-root': {
          backgroundColor: MuiPaperBackgroundColor,
        },

        // Target specific classes that might be used for small components
        '&.metric-card, &.data-card, &.sensor-card, &.stats-card': {
          backgroundColor: MuiPaperBackgroundColor,
          padding: theme.spacing(2), // Smaller padding for small components
          borderRadius: theme.shape.borderRadius * 1.5,
        },

        '&.MuiMenu-paper': {
          padding: theme.spacing(1),
          boxShadow: theme.customShadows[0],
          backgroundColor: theme.palette.mode === 'dark' ? darkThemeColors.surface : '#ffffff',
        },

        // Force background color with higher specificity
        '&[class*="MuiPaper"]': {
          backgroundColor: `${MuiPaperBackgroundColor} !important`,
        },
      };
    },
  },
};

export default Paper;