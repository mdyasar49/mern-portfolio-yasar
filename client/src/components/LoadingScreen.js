/**
 * Simple loading screen.
 */

import React, { useState, useEffect } from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);

  const statuses = [
    'INITIALIZING SYSTEM',
    'FETCHING PROFILE DATA',
    'LOADING PROJECT FRAGMENTS',
    'PREPARING UI COMPONENTS',
    'STARTING UP',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 1;
      });
    }, 25);

    return () => clearInterval(timer);
  }, [onComplete]);

  useEffect(() => {
    const statusTimer = setInterval(() => {
      setStatusIndex((prev) => (prev < statuses.length - 1 ? prev + 1 : prev));
    }, 800);
    return () => clearInterval(statusTimer);
  }, [statuses.length]);

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
      <Box sx={{ position: 'relative', mb: 8 }}>
        {/* Ambient Glow */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            inset: -50,
            background: 'radial-gradient(circle, #e11d48 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
            zIndex: -1,
          }}
        />

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          style={{
            width: 160,
            height: 160,
            border: '2px solid rgba(255,255,255,0.03)',
            borderTop: '2px solid #e11d48',
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
            textShadow: '0 0 30px rgba(225, 29, 72, 0.3)',
          }}
        >
          {progress}%
        </Typography>
      </Box>

      <Stack spacing={3} alignItems="center" sx={{ width: 300 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={statusIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Typography
              sx={{
                color: '#e11d48',
                fontFamily: 'Outfit',
                letterSpacing: 4,
                fontSize: '0.65rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                textAlign: 'center'
              }}
            >
              {statuses[statusIndex]}
            </Typography>
          </motion.div>
        </AnimatePresence>

        <Box
          sx={{
            width: '100%',
            height: 1,
            bgcolor: 'rgba(255,255,255,0.03)',
            borderRadius: 10,
            overflow: 'hidden',
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            style={{
              height: '100%',
              background: '#e11d48',
            }}
          />
        </Box>

        <Typography
          variant="caption"
          sx={{
            color: '#334155',
            fontFamily: 'monospace',
            fontSize: '0.6rem',
            fontWeight: 700,
            letterSpacing: 2,
          }}
        >
          PREPARING ASSETS...
        </Typography>
      </Stack>
    </Box>
  );
};

export default LoadingScreen;
