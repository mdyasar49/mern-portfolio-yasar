/**
 * Main App component.
 * Handles routing, theme management, and global data fetching.
 */

import React, { useEffect, useState, lazy, Suspense } from 'react';

// Material UI components for styling and layout
import { ThemeProvider, CssBaseline, Box, Typography } from '@mui/material';
// React Router components for multi-page navigation
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
// Framer Motion for smooth page transition animations
import { motion, AnimatePresence } from 'framer-motion';
// Global theme configuration (colors, typography, etc.)
import theme from './theme/index';
// Custom hook to fetch the portfolio profile data from the backend
import useProfile from './hooks/useProfile';
// Navigation bar component
import Header from './components/Header';
// Main landing page component
import Portfolio from './pages/Portfolio';
// Error screen component if the backend is unreachable
import NetworkErrorScreen from './components/NetworkErrorScreen';
// Background with dynamic particles/effects
import DynamicBackground from './components/DynamicBackground';
// Feature components
import CustomCursor from './components/CustomCursor';
import RecruiterHUD from './components/RecruiterHUD';
import LoadingScreen from './components/LoadingScreen';
import DocumentationHUD from './components/DocumentationHUD';
import { Toaster, toast } from 'react-hot-toast';
import { API_BASE_URL, SOCKET_URL } from './config';
import socket from './services/socket';

// ─── Lazy Loaded Modules (Optimization) ──────────────────────────────────
// These pages are only downloaded when the user actually navigates to them,
// which makes the initial website loading much faster.
const Resume = lazy(() => import('./pages/Resume'));
const Documentation = lazy(() => import('./pages/Documentation'));

// ─── Animations (CSS-in-JS) ───────────────────────────────────────────

/**
 * Resets scroll position on route change.
 */
const ScrollToTop = () => {
  // Get the current URL path
  const { pathname } = useLocation();
  // Whenever the path changes, scroll to coordinate 0,0
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  // This component doesn't render anything visible
  return null;
};

/**
 * Handles scrolling to hash links (e.g. #contact).
 */
const ScrollToHash = () => {
  // Extract hash (e.g., #contact) and current path from the URL
  const { hash, pathname } = useLocation();

  useEffect(() => {
    // If no hash is present, do nothing
    if (!hash) return;
    // Remove the '#' symbol to get the plain ID string
    const id = hash.replace('#', '');
    let attempts = 0;
    const maxAttempts = 20;

    // Retry function because elements might not be fully rendered yet
    const tryScroll = () => {
      // Look for the HTML element with the matching ID
      const element = document.getElementById(id);
      if (element) {
        // Scroll smoothly to that element
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      // If element not found, increment attempt counter
      attempts += 1;
      // Retry every 150ms up to 20 times
      if (attempts < maxAttempts) {
        setTimeout(tryScroll, 150);
      }
    };
    // Initial trigger with a small delay
    setTimeout(tryScroll, 100);
  }, [hash, pathname]);
  return null;
};

/**
 * Main container for public-facing pages.
 */
const PublicApp = () => {
  // Get current location for animation tracking
  const location = useLocation();
  // Fetch profile data and status flags from the backend
  const {
    profile,
    loading: profileLoading,
    error,
    errorType,
    retry,
  } = useProfile();

  // Show loading screen initially


  // ── Error Handling Check ──
  // If there was an error fetching data or the profile is missing, show the error screen
  if (error || !profile) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* Pass the error type and a retry function to the error screen */}
        <NetworkErrorScreen errorType={errorType || 'unknown'} onRetry={retry} />
      </ThemeProvider>
    );
  }

  // Main Portfolio Layout
  return (
    <>
      <Header profile={profile} />
      <DynamicBackground />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        {/* Main Content Area */}
        <Box
          id="main-scroll-container"
          sx={{
            flexGrow: 1,
            width: '100%',
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              <Suspense
                fallback={
                  <Box sx={{ py: 20, textAlign: 'center' }}>
                    <Typography>Loading...</Typography>
                  </Box>
                }
              >
                <Routes location={location}>
                  <Route
                    path="/"
                    element={<Portfolio profile={profile} loading={profileLoading} />}
                  />
                  <Route path="/resume" element={<Resume profile={profile} />} />
                  <Route path="/documentation" element={<Documentation profile={profile} />} />
                  <Route
                    path="*"
                    element={<Portfolio profile={profile} loading={profileLoading} />}
                  />
                </Routes>
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </Box>
      </Box>

      {/* Side Navigation Dots */}
      <Box
        sx={{
          position: 'fixed',
          right: 40,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 9999,
          display: { xs: 'none', xl: 'flex' },
          flexDirection: 'column',
          gap: 3,
        }}
      >
        {['hero', 'about', 'skills', 'projects', 'contact'].map((section) => (
          <Box
            key={section}
            component="a"
            href={`#${section}`}
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.1)',
              bgcolor: location.hash === `#${section}` ? '#e11d48' : 'transparent',
              transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
              '&:hover': {
                scale: 1.5,
                borderColor: '#e11d48',
                bgcolor: 'rgba(225, 29, 72, 0.2)',
              },
              cursor: 'pointer',
            }}
          />
        ))}
      </Box>

      {/* Global Components */}
      <CustomCursor />
      <RecruiterHUD profile={profile} />
      <DocumentationHUD profile={profile} />
    </>
  );
};

/**
 * Main routes for the application.
 */
const AppRoutes = () => {
  return <PublicApp />;
};

/**
 * Global entry point for the App.
 */
const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Step 1: Remove the static loader from the original index.html file
    // This makes the transition from HTML loading to React rendering feel smooth.
    const loader = document.getElementById('initial-loader');
    if (loader) {
      loader.style.opacity = '0'; // Fade out
      // Completely remove it after the fade animation finishes
      setTimeout(() => {
        loader.remove();
        document.body.style.overflow = 'auto';
      }, 800);
    } else {
      document.body.style.overflow = 'auto'; // Ensure scrolling is enabled
    }

    // Step 2: Global Spotlight Cursor Tracking
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty('--x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Global Socket Connection Monitoring
    // We use the shared socket instance
    
    socket.on('connect', () => {
      // Don't show toast on initial connect, only on reconnect
      if (socket.recovered || (window.sc_count > 0)) {
        toast.success('System reconnected', {
          style: { background: '#0f172a', color: '#00ffcc', border: '1px solid #00ffcc33' },
          iconTheme: { primary: '#00ffcc', secondary: '#0f172a' }
        });
      }
      window.sc_count = (window.sc_count || 0) + 1;
    });

    socket.on('disconnect', (reason) => {
      if (reason === 'io server disconnect' || reason === 'transport close') {
        toast.error('Real-time connection lost', {
          style: { background: '#0f172a', color: '#e11d48', border: '1px solid #e11d4833' },
          iconTheme: { primary: '#e11d48', secondary: '#0f172a' },
          duration: 4000
        });
      }
    });

    socket.on('connect_error', () => {
      // Silence persistent error toasts to avoid spam, just log
      console.warn('Socket connection error');
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    // Wrap the entire app in the Material UI theme provider
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster position="bottom-right" reverseOrder={false} />
      <AnimatePresence mode="wait">
        {loading ? (
          <LoadingScreen key="loader" onComplete={() => setLoading(false)} />
        ) : (
          <Box key="content" sx={{ position: 'relative' }}>
            <div id="spotlight" />
            <div id="noise-overlay" />

            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <>
                {/* Reset scroll on page change */}
                <ScrollToTop />
                <ScrollToHash />

                {/* Render the actual page routes */}
                <AppRoutes />
              </>
            </Router>
          </Box>
        )}
      </AnimatePresence>
    </ThemeProvider>
  );
};

export default App;
