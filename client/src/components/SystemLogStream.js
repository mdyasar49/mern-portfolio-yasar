/**
 * Activity feed section.
 */

import React, { useState, useEffect, memo } from 'react';
import { Box, Typography, Container, Stack, Grid } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Zap, Users, MessageSquare } from 'lucide-react';
import socket from '../services/socket';


const SystemLogStream = memo(({ profile }) => {
  const [logs, setLogs] = useState([]);
  const objective =
    profile?.documentation?.engineeringObjective || 'Optimizing digital ecosystems for scale.';

    const initialLogAdded = React.useRef(false);

    useEffect(() => {
    // We use the shared socket instance

    const addLog = (text, icon = <Zap size={14} />, color = 'primary.main') => {
      const newLog = {
        id: Date.now() + Math.random(),
        text,
        time: new Date().toLocaleTimeString(),
        icon,
        color
      };
      setLogs((prev) => [newLog, ...prev].slice(0, 6));
    };

    // Listen for visitor updates
    socket.on('visitorUpdate', (data) => {
      addLog(`Visitor count updated: ${data.count}`, <Users size={14} />, '#00ffcc');
    });

    // Listen for new inquiries
    socket.on('newInquiry', (data) => {
      addLog(`Message received from: ${data.name}`, <MessageSquare size={14} />, '#33ccff');
    });

    // Initial logs - only add once
    if (!initialLogAdded.current) {
      addLog('System protocols established');
      initialLogAdded.current = true;
    }

    return () => {
      socket.off('visitorUpdate');
      socket.off('newInquiry');
    };
  }, []);

  return (
    <Box id="logs" sx={{ py: { xs: 15, md: 25 } }}>
      <Container maxWidth="xl">
        <Box
          className="glass-card"
          sx={{
            p: { xs: 4, md: 8 },
            bgcolor: 'rgba(255,255,255,0.01)',
          }}
        >
          <Grid container spacing={8}>
            {/* Left: Objective */}
            <Grid item xs={12} lg={6}>
              <Typography
                variant="overline"
                sx={{
                  color: 'primary.main',
                  fontWeight: 800,
                  letterSpacing: 3,
                  mb: 3,
                  display: 'block',
                }}
              >
                MISSION
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  color: 'white',
                  fontWeight: 900,
                  fontSize: { xs: '2rem', md: '3rem' },
                  lineHeight: 1.2,
                  letterSpacing: -1,
                  mb: 4,
                }}
              >
                Building resilient systems with{' '}
                <Box component="span" sx={{ color: 'primary.main' }}>
                  precision
                </Box>{' '}
                and scale.
              </Typography>
              <Typography
                sx={{
                  color: '#94a3b8',
                  fontSize: '1.2rem',
                  lineHeight: 1.8,
                }}
              >
                {typeof objective === 'object'
                  ? objective.description || objective.title
                  : objective}
              </Typography>
            </Grid>

            {/* Right: Live Logs */}
            <Grid item xs={12} lg={6}>
              <Box
                sx={{
                  p: 4,
                  borderRadius: '24px',
                  bgcolor: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  minHeight: 300,
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
                  <Terminal size={20} color="#e11d48" />
                  <Typography
                    sx={{
                      color: 'white',
                      fontWeight: 800,
                      fontFamily: 'monospace',
                      fontSize: '0.8rem',
                      letterSpacing: 2,
                    }}
                  >
                    ACTIVITY
                  </Typography>
                </Stack>

                <Stack spacing={2}>
                  <AnimatePresence mode="popLayout">
                    {logs.map((log) => (
                      <motion.div
                        key={log.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Stack direction="row" spacing={3} alignItems="center">
                          <Typography
                            sx={{
                              color: '#475569',
                              fontFamily: 'monospace',
                              fontSize: '0.75rem',
                              minWidth: 80
                            }}
                          >
                            [{log.time}]
                          </Typography>
                          <Box sx={{ color: log.color, display: 'flex', alignItems: 'center' }}>
                            {log.icon}
                          </Box>
                          <Typography
                            sx={{
                              color: 'white',
                              fontWeight: 600,
                              fontFamily: 'monospace',
                              fontSize: '0.8rem',
                            }}
                          >
                            {log.text}
                          </Typography>
                        </Stack>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
});

export default SystemLogStream;
