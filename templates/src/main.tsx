import React from 'react';
import ReactDOM from 'react-dom/client';
import router from 'routes/router';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { theme } from 'theme/theme.ts';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* ThemeProvider and CssBaseline are now part of DarkModeProvider, which is in App.tsx */}
    <ThemeProvider theme={theme}>
    <CssBaseline />
    <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>,
);

// Note: We need to ensure App is rendered by the router.
// If App is the root component that includes <Outlet />,
// then the structure with DarkModeProvider inside App is correct.
// The RouterProvider should render the routes which in turn render App.
// Let's verify the router setup. If App is not rendered by the router, we might need to adjust this.
// For now, assuming router setup correctly renders App as a layout component.
