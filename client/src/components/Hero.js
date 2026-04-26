/**
 * Hero section.
 */

import React, { memo } from 'react';
import { Box, Typography, Container, Stack } from '@mui/material';
import { motion } from 'framer-motion';

const Hero = memo(({ profile }) => {
  if (!profile) return null;

  return (
    <Box
      id="hero"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        pt: { xs: 8, md: 12 },
      }}
    >
      {/* Background Watermark - Minimalist Style */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          textAlign: 'center',
          userSelect: 'none',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: '18vw', md: '25vw' },
            fontWeight: 900,
            color: 'rgba(255, 255, 255, 0.015)',
            lineHeight: 0.8,
            letterSpacing: -10,
            fontFamily: 'Outfit',
          }}
        >
          {profile.name?.split(' ')[0].toUpperCase()}
        </Typography>
      </Box>

      {/* Availability Status */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 40,
          right: 40,
          display: { xs: 'none', lg: 'block' },
          zIndex: 2,
        }}
      >
        <Stack direction="row" spacing={3} alignItems="center">
          <Box>
            <Typography
              sx={{ color: 'primary.main', fontSize: '0.6rem', fontWeight: 900, letterSpacing: 2 }}
            >
              {profile.customData?.availabilityLabel || 'AVAILABILITY'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: '#22c55e',
                  boxShadow: '0 0 10px #22c55e',
                  animation: 'pulse 2s infinite',
                }}
              />
              <Typography
                sx={{
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  fontFamily: 'monospace',
                }}
              >
                {profile.customData?.availabilityStatus || 'OPEN TO WORK'}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ width: 1, height: 30, bgcolor: 'rgba(255,255,255,0.1)' }} />
          <Box>
            <Typography
              sx={{ color: 'primary.main', fontSize: '0.6rem', fontWeight: 900, letterSpacing: 2 }}
            >
              {profile.customData?.versionLabel || 'VERSION'}
            </Typography>
            <Typography
              sx={{ color: 'white', fontSize: '0.75rem', fontWeight: 800, fontFamily: 'monospace' }}
            >
              {profile.customData?.versionValue || 'v1.0'}
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Stack spacing={{ xs: 3, md: 5 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <Typography
              variant="overline"
              sx={{
                color: 'primary.main',
                fontWeight: 900,
                letterSpacing: { xs: 4, md: 8 },
                textTransform: 'uppercase',
                display: 'block',
                mb: { xs: 1, md: 2 },
                fontSize: { xs: '0.65rem', md: '0.75rem' },
              }}
            >
              {profile.customData?.heroOverline || 'PROFESSIONAL PORTFOLIO'}
            </Typography>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '3.5rem', sm: '5rem', md: '8rem', lg: '10rem' },
                fontWeight: 900,
                background: 'linear-gradient(135deg, #f97316, #e11d48)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: 0.9,
                letterSpacing: -4,
                fontFamily: 'Outfit',
              }}
            >
              {profile.name}
            </Typography>
            <Typography
              sx={{
                background: 'linear-gradient(135deg, #f97316, #e11d48)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontSize: { xs: '1rem', md: '2.2rem' },
                fontWeight: 900,
                fontFamily: 'Outfit',
                letterSpacing: { xs: 2, md: 4 },
                mt: 1,
                textTransform: 'uppercase',
              }}
            >
              {profile.title || 'MERN STACK DEVELOPER'}
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <Typography
              sx={{
                color: '#94a3b8',
                fontSize: { xs: '0.95rem', md: '1.4rem' },
                fontWeight: 500,
                maxWidth: 700,
                lineHeight: 1.6,
                fontFamily: 'Outfit',
              }}
            >
              {profile.summary ||
                'Building high-performance, secure, and scalable web applications with modern technologies.'}
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <Stack direction="row" spacing={3} alignItems="center">
              <Box
                component="a"
                href="#projects"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 900,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  gap: 2,
                  '&::after': {
                    content: '""',
                    width: 40,
                    height: 1,
                    bgcolor: 'primary.main',
                    transition: '0.3s',
                  },
                  '&:hover::after': {
                    width: 80,
                  },
                }}
              >
                {profile.customData?.heroActionLabel || 'VIEW PROJECTS'}
              </Box>
            </Stack>
          </motion.div>
        </Stack>
      </Container>
    </Box>
  );
});

export default Hero;
