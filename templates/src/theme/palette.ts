import { PaletteColorOptions, PaletteOptions } from '@mui/material/styles';
import {
  white,
  gray,
  darkblue,
  violet,
  blue,
  cyan,
  tomato,
  red,
  green,
  yellow,
  purple,
  transparentRed,
  transparentGreen,
  transparentYellow,
  transparentWhite,
  transparentBlue,
  transparentCyan,
  transparentViolet,
  indigo,
  darkThemeColors, // Import the dark theme colors
} from './colors';

declare module '@mui/material/styles' {
  interface PaletteOptions {
    neutral?: PaletteColorOptions;
    transparent?: {
      primary: PaletteColorOptions;
      secondary: PaletteColorOptions;
      info: PaletteColorOptions;
      success: PaletteColorOptions;
      warning: PaletteColorOptions;
      error: PaletteColorOptions;
    };
    gradients?: {
      primary: PaletteColorOptions;
      secondary?: PaletteColorOptions;
    };
  }
  interface SimplePaletteColorOptions {
    lighter?: string;
    darker?: string;
    state?: string;
  }
  interface Palette {
    neutral: PaletteColor;
    gradients: {
      primary: PaletteColor;
      secondary: PaletteColor;
    };
    transparent: {
      primary: PaletteColor;
      secondary: PaletteColor;
      info: PaletteColor;
      success: PaletteColor;
      warning: PaletteColor;
      error: PaletteColor;
    };
  }
  interface PaletteColor {
    lighter: string;
    darker: string;
    state: string;
  }
}

export const lightPalette: PaletteOptions = {
  neutral: {
    light: gray[100],
    main: gray[500],
    dark: gray[600],
    darker: gray[700],
  },
  primary: {
    lighter: indigo[500],
    light: violet[300],
    main: violet[500],
  },
  secondary: {
    light: cyan[500],
    main: blue[500],
    dark: blue[800],
  },
  info: {
    lighter: white[100],
    main: white[200],
    darker: darkblue[500],
  },
  success: {
    main: green[500],
  },
  warning: {
    main: yellow[500],
  },
  error: {
    light: tomato[500],
    main: red[500],
    dark: red[800],
  },
  text: {
    primary: darkblue[500],
    secondary: gray[800],
    disabled: gray[500],
  },
  gradients: {
    primary: {
      main: cyan[300],
      state: purple[500],
    },
    secondary: {
      main: violet[100],
      state: white[100],
    },
  },
  transparent: {
    primary: {
      main: transparentViolet[500],
      dark: transparentViolet[700],
    },
    secondary: {
      lighter: transparentBlue[300],
      light: transparentCyan[500],
      main: transparentBlue[500],
    },
    info: {
      main: transparentWhite[500],
    },
    success: {
      main: transparentGreen[500],
    },
    warning: {
      main: transparentYellow[500],
      dark: transparentYellow[700],
    },
    error: {
      light: transparentRed[200],
      main: transparentRed[500],
    },
  },
};

export const darkPalette: PaletteOptions = {
  neutral: {
    light: darkThemeColors.textDisabled, // Example: using textDisabled for light neutral in dark mode
    main: darkThemeColors.textSecondary,
    dark: darkThemeColors.textPrimary,
    darker: darkThemeColors.onBackground,
  },
  primary: {
    main: darkThemeColors.primary,
    // You might want to define light/darker shades for primary in dark mode if needed
  },
  secondary: {
    main: darkThemeColors.secondary,
    // You might want to define light/darker shades for secondary in dark mode if needed
  },
  info: {
    // Adjust info colors for dark mode
    lighter: darkThemeColors.surface, // Example
    main: darkThemeColors.onSurface,
    darker: darkThemeColors.background,
  },
  success: {
    main: green[500], // Assuming green works for both, or define a dark mode green
  },
  warning: {
    main: yellow[500], // Assuming yellow works for both, or define a dark mode yellow
  },
  error: {
    main: darkThemeColors.error,
  },
  text: {
    primary: darkThemeColors.textPrimary,
    secondary: darkThemeColors.textSecondary,
    disabled: darkThemeColors.textDisabled,
  },
  background: {
    default: darkThemeColors.background,
    paper: darkThemeColors.surface,
  },
  gradients: { // Define gradients for dark mode if they differ (example, may need adjustment)
    primary: {
      main: cyan[300], // Example, adjust as needed
      state: purple[500],
    },
    secondary: {
      main: violet[100],
      state: white[100], // This might need adjustment for dark backgrounds
    },
  },
  transparent: { // Adjust transparent colors for dark mode
    primary: {
      main: `${darkThemeColors.primary}1a`, // Example: primary with alpha
      dark: `${darkThemeColors.primary}2b`,
    },
    secondary: {
      lighter: `${darkThemeColors.secondary}0d`,
      light: `${darkThemeColors.secondary}1a`,
      main: `${darkThemeColors.secondary}1a`,
    },
    info: {
      main: `${darkThemeColors.onSurface}4d`, // Example: onSurface with alpha
    },
    success: {
      main: `${green[500]}1a`, // Example
    },
    warning: {
      main: `${yellow[500]}1a`, // Example
      dark: `${yellow[500]}66`,
    },
    error: {
      light: `${darkThemeColors.error}1a`,
      main: `${darkThemeColors.error}1a`,
    },
  },
};

// Default export can be lightPalette or you might remove it if selection is handled elsewhere
export default lightPalette;
