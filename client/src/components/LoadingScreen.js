/**
 * Simple loading screen.
 */

import React, { useState, useEffect } from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { motion } from 'framer-motion';

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('INITIALIZING');

  useEffect(() => {
    // Increment progress over time
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 800);
          return 100;
        }
        return prev + 1;
      });
    }, 20);

    // Cycle through professional status messages
    const statusTimer = setInterval(() => {
      const statuses = [
        'GETTING THINGS READY',
        'LOADING CONTENT',
        'PREPARING UI',
        'ALMOST THERE',
        'WELCOME',
      ];
      setStatus(statuses[Math.floor(Math.random() * statuses.length)]);
    }, 500);

    return () => {
      clearInterval(timer);
      clearInterval(statusTimer);
    };
  }, [onComplete]);

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 20000,
        bgcolor: '#050507',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Main Scanner Circle - A focal point for the loading experience */}
      <Box sx={{ position: 'relative', mb: 8 }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          style={{
            width: 180,
            height: 180,
            border: '2px solid rgba(225, 29, 72, 0.05)',
            borderTop: '2px solid #e11d48',
            borderRadius: '50%',
          }}
        />
        {/* Secondary counter-rotating ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            inset: 15,
            border: '1px dashed rgba(225, 29, 72, 0.2)',
            borderRadius: '50%',
          }}
        />
        <Typography
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            fontWeight: 900,
            fontFamily: 'Outfit',
            fontSize: '1.8rem',
            letterSpacing: -1,
            textShadow: '0 0 40px rgba(225, 29, 72, 0.4)',
          }}
        >
          {progress}%
        </Typography>
      </Box>

      {/* Status & Progress Bar Module */}
      <Stack spacing={3} alignItems="center" sx={{ width: 320 }}>
        <Typography
          variant="caption"
          sx={{
            color: '#e11d48',
            fontFamily: 'Outfit',
            letterSpacing: 4,
            fontSize: '0.7rem',
            fontWeight: 900,
            textTransform: 'uppercase',
            transition: '0.3s all',
          }}
        >
          {status}
        </Typography>

        <Box
          sx={{
            width: '100%',
            height: 2,
            bgcolor: 'rgba(255,255,255,0.03)',
            borderRadius: 10,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            style={{
              height: '100%',
              background: '#e11d48',
              boxShadow: '0 0 20px #e11d48',
            }}
          />
        </Box>

        <Typography
          variant="caption"
          sx={{
            color: '#1e293b',
            fontFamily: 'monospace',
            fontSize: '0.65rem',
            fontWeight: 700,
            letterSpacing: 2,
          }}
        >
          LOADING...
        </Typography>
      </Stack>

    </Box>
  );
};

export default LoadingScreen;
