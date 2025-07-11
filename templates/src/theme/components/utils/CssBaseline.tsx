import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';
import simplebar from 'theme/styles/simplebar';
import scrollbar from 'theme/styles/scrollbar';
import echart from 'theme/styles/echart';

const CssBaseline: Components<Omit<Theme, 'components'>>['MuiCssBaseline'] = {
  defaultProps: {},
  styleOverrides: (theme) => ({
    '*, *::before, *::after': {
      margin: 0,
      padding: 0,
    },
    html: {
      scrollBehavior: 'smooth',
    },
    body: {
      fontVariantLigatures: 'none',
      // backgroundColor: theme.palette.info.main, // Old body background
      backgroundColor: theme.palette.background.default, // Use theme default background
      color: theme.palette.text.primary, // Set default text color for the body
      ...scrollbar(theme),
    },
    // Ensure preformatted text and code blocks use themed text color
    'pre, code': {
      color: theme.palette.text.primary,
      fontFamily: theme.typography.fontFamilyMono, // Assuming you have a monospace font in typography
      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)', // Subtle background for code
      padding: theme.spacing(0.25, 0.5),
      borderRadius: theme.shape.borderRadius * 0.5,
    },
    // General pre style - might be overridden by the more specific one below if applicable
    pre: {
      padding: theme.spacing(1),
      overflow: 'auto',
      backgroundColor: theme.palette.mode === 'dark' 
        ? theme.palette.background.paper // Default pre background to paper
        : theme.palette.grey[100],       // Light grey for light mode pre
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      color: theme.palette.text.primary, // Ensure text color is themed
      fontFamily: theme.typography.fontFamilyMono, // Ensure monospace font
    },
    // Specific override for MuiTypography rendered as a <pre> element
    'pre.MuiTypography-root': {
      fontFamily: theme.typography.fontFamilyMono,
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.background.paper, // Use paper for a distinct block
      padding: theme.spacing(2), // More padding for these specific blocks
      borderRadius: theme.shape.borderRadius,
      border: `1px solid ${theme.palette.divider}`,
      overflowX: 'auto', // Ensure horizontal scrolling if content is too wide
    },
    ...simplebar(theme),
    ...echart(),
  }),
};

export default CssBaseline;
