/**
 * Quick view dashboard for recruiters.
 */

import React, { useState } from 'react';
import { Box, Typography, Stack, Button, Divider } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, CheckCircle2, Download, Send, X } from 'lucide-react';

const RecruiterHUD = ({ profile }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Dynamic Data Fallbacks
  const pitch = profile?.recruiterPitch || 'Ready to deliver production-grade MERN solutions.';
  const bullets = profile?.recruiterBullets || ['Full Stack Expert', 'Immediate Availability'];

  return (
    <>
      {/* Floating pill trigger — Responsive positioning */}
      <Box
        sx={{
          position: 'fixed',
          bottom: { xs: 20, md: 130 },
          left: { xs: 16, md: 32 },
          zIndex: 1000,
        }}
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Box
            onClick={() => setIsOpen(!isOpen)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: { xs: 2, md: 2.5 },
              py: { xs: 1, md: 1.5 },
              bgcolor: 'rgba(99,102,241,0.15)',
              border: '1px solid rgba(99,102,241,0.35)',
              borderRadius: '100px',
              cursor: 'pointer',
              backdropFilter: 'blur(12px)',
              transition: '0.3s',
              '&:hover': {
                bgcolor: 'rgba(99,102,241,0.25)',
              },
            }}
          >
            {isOpen ? <X size={16} color="#e11d48" /> : <Briefcase size={16} color="#e11d48" />}
            <Typography
              sx={{
                color: '#a5b4fc',
                fontWeight: 800,
                fontSize: { xs: '0.6rem', md: '0.7rem' },
                letterSpacing: 1.5,
                textTransform: 'uppercase',
              }}
            >
              {isOpen ? 'Close' : 'Quick View'}
            </Typography>
          </Box>
        </motion.div>

        {/* The Dashboard Panel — slides up from the trigger */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              style={{
                position: 'absolute',
                bottom: '60px',
                left: 0,
                width: window.innerWidth < 600 ? 'calc(100vw - 32px)' : 320,
                pointerEvents: 'auto',
              }}
            >
              <Box
                sx={{
                  p: { xs: 2.5, md: 3 },
                  borderRadius: '20px',
                  bgcolor: 'rgba(8,8,18,0.98)',
                  backdropFilter: 'blur(30px)',
                  border: '1px solid rgba(99,102,241,0.2)',
                  boxShadow: '0 24px 60px rgba(0,0,0,0.7)',
                }}
              >
                {/* Header */}
                <Typography
                  sx={{
                    color: '#e11d48',
                    fontWeight: 800,
                    fontSize: '0.6rem',
                    letterSpacing: 3,
                    textTransform: 'uppercase',
                    mb: 2,
                  }}
                >
                  Quick Summary
                </Typography>

                <Stack spacing={2.5}>
                  {/* Pitch */}
                  <Typography
                    sx={{
                      color: '#cbd5e1',
                      fontSize: { xs: '0.8rem', md: '0.85rem' },
                      lineHeight: 1.7,
                    }}
                  >
                    {pitch}
                  </Typography>

                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />

                  {/* Bullets */}
                  <Stack spacing={1.5}>
                    {bullets.map((item) => (
                      <Stack key={item} direction="row" spacing={1.5} alignItems="center">
                        <CheckCircle2 size={14} color="#e11d48" />
                        <Typography
                          sx={{
                            color: 'white',
                            fontSize: { xs: '0.75rem', md: '0.8rem' },
                            fontWeight: 600,
                          }}
                        >
                          {item}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>

                  {/* CTA buttons */}
                  <Stack direction="row" spacing={1.5} sx={{ pt: 0.5 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      href="/resume"
                      startIcon={<Download size={14} />}
                      sx={{
                        bgcolor: '#e11d48',
                        borderRadius: '100px',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        textTransform: 'none',
                        py: 1,
                        '&:hover': { bgcolor: '#4f46e5' },
                      }}
                    >
                      Resume
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      href="#contact"
                      onClick={() => setIsOpen(false)}
                      startIcon={<Send size={14} />}
                      sx={{
                        borderColor: 'rgba(255,255,255,0.15)',
                        color: 'white',
                        borderRadius: '100px',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        textTransform: 'none',
                        py: 1,
                        '&:hover': { borderColor: '#e11d48', bgcolor: 'rgba(99,102,241,0.05)' },
                      }}
                    >
                      Hire
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </>
  );
};

export default RecruiterHUD;
