/**
 * [Material UI Design System - MY. Brand Identity]
 * Color palette sourced from og-image.png:
 *   Orange #f97316 → Red #e11d48 → Pink #ec4899 → Magenta #c026d3
 *   Accent Glow: Cyan #00e5ff
 *   Background: Pure dark #050507
 */
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  breakpoints: {
    values: { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 },
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#e11d48', // Rose — the gradient midpoint
      light: '#ec4899', // Pink
      dark: '#f97316', // Orange
    },
    secondary: {
      main: '#00e5ff', // Cyan glow accent
    },
    background: {
      default: '#050507',
      paper: '#0d0d10',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#94a3b8',
    },
  },
  typography: {
    fontFamily: '"Outfit", "Inter", sans-serif',
    h1: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 800,
      letterSpacing: '-0.02em',
      fontSize: 'clamp(2.5rem, 5vw, 5rem)',
    },
    h2: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.01em',
      fontSize: 'clamp(2rem, 4vw, 3.5rem)',
    },
    h3: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 700,
      fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
    },
    body1: { fontSize: '1rem', lineHeight: 1.6 },
    button: { fontFamily: '"Outfit", sans-serif', fontWeight: 600, textTransform: 'none' },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '10px 24px',
          borderRadius: 8,
          transition: 'all 0.2s ease',
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none', transform: 'translateY(-1px)' },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #f97316, #e11d48)',
          '&:hover': {
            background: 'linear-gradient(135deg, #ea6a0e, #c41940)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        },
      },
    },
  },
});

export default theme;
