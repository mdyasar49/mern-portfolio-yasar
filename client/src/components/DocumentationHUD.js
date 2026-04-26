/**
 * Project details and tech stack info.
 */

import React, { useState } from 'react';
import { Box, Typography, Stack, Divider, Grid } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, X, Server, Database, Globe, ShieldCheck } from 'lucide-react';

const DocumentationHUD = ({ profile }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Extraction Logic: Fallback to empty defaults if backend data is missing
  const docs = profile?.documentation || {};
  const objective = docs.engineeringObjective || {};
  const coreArchitecture = docs.coreArchitecture || [];
  const security = docs.securityProtocols || [];
  const performance = docs.performanceMetrics || [];

  return (
    <>
      {/* Floating trigger — bottom-right, clean icon button */}
      <Box
        sx={{
          position: 'fixed',
          right: { xs: 16, md: 32 },
          bottom: { xs: 20, md: 32 },
          zIndex: 10001,
        }}
      >
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Box
            onClick={() => setIsOpen(!isOpen)}
            sx={{
              width: { xs: 46, md: 52 },
              height: { xs: 46, md: 52 },
              borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backdropFilter: 'blur(12px)',
              color: 'white',
              transition: '0.3s',
              '&:hover': {
                bgcolor: 'rgba(99,102,241,0.15)',
                borderColor: 'rgba(99,102,241,0.4)',
                color: '#e11d48',
              },
            }}
          >
            {isOpen ? <X size={20} /> : <BookOpen size={20} />}
          </Box>
        </motion.div>

        {/* Tooltip label when closed - Hidden on mobile */}
        {!isOpen && (
          <Box
            sx={{
              position: 'absolute',
              right: '110%',
              top: '50%',
              transform: 'translateY(-50%)',
              px: 1.5,
              py: 0.5,
              bgcolor: 'rgba(0,0,0,0.8)',
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.06)',
              whiteSpace: 'nowrap',
              display: { xs: 'none', md: 'block' },
            }}
          >
            <Typography
              sx={{ color: '#94a3b8', fontSize: '0.65rem', fontWeight: 700, letterSpacing: 1.5 }}
            >
              INFO
            </Typography>
          </Box>
        )}

        {/* The Documentation Panel — slides up from bottom-right */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
              style={{
                position: 'absolute',
                bottom: '64px',
                right: 0,
                width: window.innerWidth < 600 ? 'calc(100vw - 32px)' : 360,
                pointerEvents: 'auto',
              }}
            >
              <Box
                sx={{
                  p: { xs: 2.5, md: 3 },
                  borderRadius: '20px',
                  bgcolor: 'rgba(8,8,18,0.98)',
                  backdropFilter: 'blur(30px)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  boxShadow: '0 30px 80px rgba(0,0,0,0.8)',
                  maxHeight: '70vh',
                  overflowY: 'auto',
                  '&::-webkit-scrollbar': { width: '3px' },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'rgba(99,102,241,0.3)',
                    borderRadius: '10px',
                  },
                }}
              >
                {/* Header */}
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 3 }}
                >
                  <Box>
                    <Typography
                      sx={{
                        color: '#e11d48',
                        fontWeight: 800,
                        fontSize: '0.6rem',
                        letterSpacing: 3,
                        mb: 0.5,
                      }}
                    >
                      PROJECT DETAILS
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        color: 'white',
                        fontWeight: 900,
                        fontFamily: 'Outfit',
                        letterSpacing: -0.5,
                      }}
                    >
                      Full-Stack{' '}
                      <Box component="span" sx={{ color: '#e11d48' }}>
                        Architecture
                      </Box>
                    </Typography>
                  </Box>
                </Stack>

                <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', mb: 3 }} />

                {/* Architecture Flow */}
                <Box
                  sx={{
                    p: 2,
                    bgcolor: 'rgba(255,255,255,0.02)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.04)',
                    mb: 3,
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                    {[
                      { label: 'FRONTEND', icon: <Globe size={14} />, color: '#e11d48' },
                      { label: 'BACKEND', icon: <Server size={14} />, color: '#818cf8' },
                      { label: 'DATABASE', icon: <Database size={14} />, color: '#94a3b8' },
                    ].map((node, i) => (
                      <React.Fragment key={node.label}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Box
                            sx={{
                              p: 1,
                              border: `1px solid ${node.color}44`,
                              borderRadius: '8px',
                              color: node.color,
                              mb: 0.5,
                            }}
                          >
                            {node.icon}
                          </Box>
                          <Typography
                            sx={{
                              fontSize: '0.5rem',
                              color: node.color,
                              fontWeight: 800,
                              letterSpacing: 1,
                            }}
                          >
                            {node.label}
                          </Typography>
                        </Box>
                        {i < 2 && (
                          <Box
                            sx={{ height: '1px', width: 30, bgcolor: 'rgba(255,255,255,0.1)' }}
                          />
                        )}
                      </React.Fragment>
                    ))}
                  </Stack>
                </Box>

                {/* Project Objective */}
                <Stack spacing={2.5}>
                  <Box>
                    <Typography
                      sx={{
                        color: '#475569',
                        fontSize: '0.6rem',
                        fontWeight: 800,
                        letterSpacing: 2,
                        mb: 1.5,
                      }}
                    >
                      OVERVIEW
                    </Typography>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: 'rgba(99,102,241,0.04)',
                        border: '1px solid rgba(99,102,241,0.1)',
                        borderRadius: '12px',
                      }}
                    >
                      <Typography
                        sx={{ color: 'white', fontSize: '0.8rem', fontWeight: 700, mb: 0.5 }}
                      >
                        {typeof objective === 'object'
                          ? objective.title || 'System Core'
                          : 'System Core'}
                      </Typography>
                      <Typography sx={{ color: '#94a3b8', fontSize: '0.75rem', lineHeight: 1.6 }}>
                        {typeof objective === 'object'
                          ? objective.description || 'System data not available.'
                          : objective || 'System data not available.'}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Core System DNA */}
                  {coreArchitecture.length > 0 && (
                    <Box>
                      <Typography
                        sx={{
                          color: '#475569',
                          fontSize: '0.6rem',
                          fontWeight: 800,
                          letterSpacing: 2,
                          mb: 1.5,
                        }}
                      >
                        TECH STACK
                      </Typography>
                      <Stack spacing={1}>
                        {coreArchitecture.map((item, idx) => (
                          <Box
                            key={idx}
                            sx={{
                              px: 2,
                              py: 1.5,
                              borderRadius: '10px',
                              bgcolor: 'rgba(255,255,255,0.01)',
                              border: '1px solid rgba(255,255,255,0.04)',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <Typography
                              sx={{ color: '#cbd5e1', fontSize: '0.75rem', fontWeight: 600 }}
                            >
                              {item.title}
                            </Typography>
                            <Typography
                              sx={{
                                color: item.color || '#e11d48',
                                fontSize: '0.65rem',
                                fontWeight: 800,
                                fontFamily: 'monospace',
                              }}
                            >
                              {item.val}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  )}

                  {/* Security Protocols */}
                  {security.length > 0 && (
                    <Box>
                      <Typography
                        sx={{
                          color: '#475569',
                          fontSize: '0.6rem',
                          fontWeight: 800,
                          letterSpacing: 2,
                          mb: 1.5,
                        }}
                      >
                        SECURITY
                      </Typography>
                      <Stack spacing={1}>
                        {security.map((s, i) => (
                          <Box
                            key={i}
                            sx={{
                              p: 1.5,
                              borderRadius: '10px',
                              border: `1px solid ${s.color}22`,
                              bgcolor: `${s.color}05`,
                            }}
                          >
                            <Stack direction="row" spacing={1.5} alignItems="center">
                              <ShieldCheck size={16} color={s.color || '#e11d48'} />
                              <Box>
                                <Typography
                                  sx={{ color: 'white', fontSize: '0.75rem', fontWeight: 700 }}
                                >
                                  {s.title}
                                </Typography>
                                <Typography
                                  sx={{
                                    color: s.color || '#e11d48',
                                    fontSize: '0.6rem',
                                    fontWeight: 800,
                                  }}
                                >
                                  {s.status}
                                </Typography>
                              </Box>
                            </Stack>
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  )}

                  {/* Performance Metrics */}
                  {performance.length > 0 && (
                    <Box
                      sx={{
                        p: 2.5,
                        borderRadius: '12px',
                        bgcolor: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.04)',
                      }}
                    >
                      <Grid container spacing={2}>
                        {performance.map((m, i) => (
                          <Grid item xs={4} key={i} sx={{ textAlign: 'center' }}>
                            <Typography
                              sx={{
                                color: m.color || '#e11d48',
                                fontWeight: 900,
                                fontSize: '1.1rem',
                                fontFamily: 'Outfit',
                              }}
                            >
                              {m.val}
                            </Typography>
                            <Typography
                              sx={{
                                color: '#475569',
                                fontSize: '0.55rem',
                                fontWeight: 700,
                                letterSpacing: 1,
                              }}
                            >
                              {m.label}
                            </Typography>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}
                </Stack>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </>
  );
};

export default DocumentationHUD;
