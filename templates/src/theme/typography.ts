import { TypographyOptions } from '@mui/material/styles/createTypography';

export const fontFamily = {
  nunito: ['Nunito', 'sans-serif'].join(','),
  monospace: ['Menlo', 'Consolas', 'Monaco', 'Liberation Mono', 'Lucida Console', 'monospace'].join(','),
};

// Ensure this TypographyOptions interface includes your custom ones if you extend it elsewhere
declare module '@mui/material/styles/createTypography' {
  interface TypographyOptions {
    fontFamilyMono?: string;
  }

  interface Typography {
    fontFamilyMono?: string;
  }
}

const typography: TypographyOptions = {
  fontFamily: fontFamily.nunito,
  fontFamilyMono: fontFamily.monospace, // Correctly placed here
  h1: {
    fontSize: '2.25rem',
    fontWeight: 700,
  },
  h2: {
    fontSize: '1.875rem',
    fontWeight: 700,
  },
  h3: {
    fontSize: '1.75rem',
    fontWeight: 700,
  },
  h4: {
    fontSize: '1.5rem',
    fontWeight: 700,
  },
  h5: {
    fontSize: '1.375rem',
    fontWeight: 700,
  },
  h6: {
    fontSize: '1.125rem',
    fontWeight: 700,
  },
  subtitle1: {
    fontSize: '1rem',
    fontWeight: 400,
  },
  subtitle2: {
    fontSize: '0.875rem',
    fontWeight: 500,
  },
  body1: {
    fontSize: '1rem',
    fontWeight: 400,
  },
  body2: {
    fontSize: '0.875rem',
    fontWeight: 400,
  },
  caption: {
    fontSize: '0.75rem',
    fontWeight: 600,
  },
  button: {
    fontSize: '1rem',
    fontWeight: 500,
  },
};

export default typography;
