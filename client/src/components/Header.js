/**
 * Navigation Header component.
 * Floating bar with glassmorphic style.
 */

import React, { useState } from 'react';
// Material UI components for the layout, buttons, and mobile drawer
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useScrollTrigger,
  Container,
  Typography,
  Stack,
} from '@mui/material';
// Icons for mobile menu toggle and close
import { Menu as MenuIcon, X } from 'lucide-react';
// React Router hooks for navigation and location tracking
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';

const Header = ({ profile }) => {
  // State to manage the visibility of the mobile side drawer
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Extraction Logic: Fallback to an empty list if backend data is not yet loaded
  const menuItems = profile?.menuItems || [];

  // Hook to detect scroll position - used to transform the header into a floating island
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 50,
  });

  // Toggles the mobile drawer menu
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  /**
   * Scrolls smoothly to a section on the home page.
   */
  const scrollToSection = (sectionId) => {
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Cross-page navigation to a specific section
      navigate(`/#${sectionId}`);
    }
    setMobileOpen(false); // Close drawer after clicking (for mobile)
  };

  /**
   * Scrolls to top on logo click.
   */
  const handleLogoClick = (e) => {
    // Navigate to root to clear hashes and ensure we are on the home page
    navigate('/');

    // Target the specific scroll container used in App.js
    const container = document.getElementById('main-scroll-container');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Fallback for global window scroll
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  /**
   * Helper to render individual nav buttons.
   */
  const renderNavButton = (item) => {
    const isAnchor = item.type === 'anchor';
    // Check if the current button matches the active section/page
    const isActive = item.path
      ? location.hash === item.path.replace('/', '') ||
        (location.pathname === item.path && !isAnchor)
      : false;

    // Render logic for Homepage Anchors
    if (isAnchor && location.pathname === '/') {
      return (
        <Button
          key={item.name}
          onClick={() => scrollToSection(item.name.toLowerCase())}
          sx={{
            color: isActive ? '#e11d48' : 'white',
            px: 2,
            mx: 0.5,
            fontSize: '0.75rem',
            fontFamily: 'Outfit',
            fontWeight: 600,
            transition: '0.2s ease',
            '&:hover': {
              color: '#e11d48',
              bgcolor: 'transparent',
            },
          }}
        >
          {item.name}
        </Button>
      );
    }

    // Render logic for standard Router Links (Cross-page)
    return (
      <Button
        key={item.name}
        component={RouterLink}
        to={item.path}
        onClick={() => setMobileOpen(false)}
        sx={{
          color: location.pathname === item.path ? '#e11d48' : 'white',
          px: 2,
          mx: 0.5,
          fontSize: '0.75rem',
          fontFamily: 'Outfit',
          fontWeight: 600,
          transition: '0.2s ease',
          '&:hover': {
            color: '#e11d48',
            bgcolor: 'transparent',
          },
        }}
      >
        {item.name}
      </Button>
    );
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      {/* ── THE MAIN APPBAR ── */}
      <AppBar
        position="fixed"
        sx={{
          // Transformations applied based on 'trigger' (scroll position)
          top: trigger ? 15 : 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: trigger ? 'max-content' : '100%',
          maxWidth: trigger ? '95%' : '100%',
          minWidth: trigger ? { sm: '700px', md: '900px', lg: '1000px' } : '100%',
          bgcolor: trigger ? 'rgba(10, 10, 12, 0.8)' : 'transparent',
          backdropFilter: trigger ? 'blur(12px)' : 'none',
          borderRadius: trigger ? 4 : 0,
          border: trigger ? '1px solid rgba(255,255,255,0.06)' : 'none',
          transition: 'all 0.3s ease',
          boxShadow: trigger ? '0 10px 30px rgba(0,0,0,0.3)' : 'none',
          zIndex: 11000,
        }}
        elevation={0}
      >
        <Container maxWidth={trigger ? false : 'lg'} sx={{ width: '100%', px: trigger ? 4 : 2 }}>
          <Toolbar
            sx={{
              justifyContent: 'space-between',
              height: trigger ? 60 : 80,
              width: '100%',
              gap: 2,
            }}
          >
            {/* Logo */}
            <Stack direction="row" spacing={3} alignItems="center">
              <Box
                component={RouterLink}
                to="/"
                onClick={handleLogoClick}
                sx={{
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  transition: '0.2s ease',
                  '&:hover': { opacity: 0.8 },
                }}
              >
                <Box
                  component="img"
                  src="/logo.png"
                  alt="Mohamed Yasar"
                  sx={{
                    height: { xs: 20, sm: 25, md: 30 },
                    width: 'auto',
                  }}
                />
              </Box>
            </Stack>

            {/* [DESKTOP NAVIGATION] Hidden on small screens */}
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                whiteSpace: 'nowrap',
                gap: 2,
              }}
            >
              {menuItems.map((item) => renderNavButton(item))}
            </Box>

            {/* [MOBILE MENU TOGGLE] Visible only on mobile */}
            <IconButton
              color="inherit"
              onClick={handleDrawerToggle}
              sx={{ display: { xs: 'flex', md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* ── MOBILE SIDE DRAWER ── */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: {
            bgcolor: 'rgba(3, 7, 18, 0.95)',
            width: 280,
            backdropFilter: 'blur(20px) saturate(180%)',
            borderLeft: '1px solid rgba(255,255,255,0.08)',
          },
        }}
      >
        <Box sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Close & Meta */}
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}
          >
            <Box>
              <Typography
                sx={{
                  color: 'primary.main',
                  fontSize: '0.6rem',
                  fontWeight: 900,
                  letterSpacing: 2,
                }}
              >
                {profile.customData?.navLabel || 'NAVIGATION'}
              </Typography>
              <Typography
                sx={{
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  fontFamily: 'monospace',
                }}
              >
                {profile.customData?.versionValue || 'v4.2.0'}
              </Typography>
            </Box>
            <IconButton
              onClick={handleDrawerToggle}
              sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.05)' }}
            >
              <X size={20} />
            </IconButton>
          </Box>

          {/* Menu List */}
          <List sx={{ flexGrow: 1 }}>
            {menuItems.map((item) => (
              <ListItem key={item.name} disablePadding sx={{ mb: 2 }}>
                <ListItemButton
                  onClick={() =>
                    item.type === 'anchor'
                      ? scrollToSection(item.name.toLowerCase())
                      : setMobileOpen(false)
                  }
                  component={
                    item.type === 'anchor' && location.pathname === '/' ? 'div' : RouterLink
                  }
                  {...(item.type === 'anchor' && location.pathname === '/'
                    ? {}
                    : { to: item.path })}
                  sx={{
                    borderRadius: '12px',
                    py: 2,
                    border: '1px solid rgba(255,255,255,0.03)',
                    '&:hover': { bgcolor: 'rgba(225, 29, 72, 0.1)', borderColor: 'primary.main' },
                  }}
                >
                  <ListItemText
                    primary={item.name.toUpperCase()}
                    sx={{
                      '& .MuiTypography-root': {
                        fontWeight: 900,
                        color: 'white',
                        fontFamily: 'Outfit',
                        letterSpacing: 2,
                        fontSize: '0.9rem',
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          {/* Footer Meta */}
          <Typography
            sx={{
              color: '#475569',
              fontSize: '0.6rem',
              fontWeight: 800,
              textAlign: 'center',
              letterSpacing: 1,
            }}
          >
            {profile.customData?.copyrightText || '© 2026 MOHAMED YASAR'}
          </Typography>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Header;
