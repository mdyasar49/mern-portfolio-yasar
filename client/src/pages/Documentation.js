import React, { memo, useState, useEffect } from 'react';
import { Box, Typography, Container, Stack, Grid, Button } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Users, MessageSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import SEO from '../components/SEO';
import { io } from 'socket.io-client';
import { API_BASE_URL } from '../config';

const Documentation = memo(({ profile }) => {
  const [markdown, setMarkdown] = useState('');
  const [readme, setReadme] = useState('');
  const [activeTab, setActiveTab] = useState('explanation');
  const docs = profile?.documentation || {};
  const [statusLogs, setStatusLogs] = useState(docs.engineeringObjective?.systemMetricsConfig?.logTemplates || []);

  useEffect(() => {
    fetch('/docs/PROJECT_EXPLANATION.md')
      .then((res) => res.text())
      .then((text) => setMarkdown(text))
      .catch((err) => console.error('Failed to load documentation:', err));

    fetch('/docs/README.md')
      .then((res) => res.text())
      .then((text) => setReadme(text))
      .catch((err) => console.error('Failed to load readme:', err));

    // Socket.io for real-time status updates
    const socket = io(API_BASE_URL);

    socket.on('visitorUpdate', (data) => {
      setStatusLogs((prev) => [
        { type: 'TRAFFIC', message: `Visitor count sync: ${data.count}`, color: '#00ffcc', icon: <Users size={12} /> },
        ...prev.slice(0, 4)
      ]);
    });

    socket.on('newInquiry', (data) => {
      setStatusLogs((prev) => [
        { type: 'INQUIRY', message: `Incoming message: ${data.name}`, color: '#33ccff', icon: <MessageSquare size={12} /> },
        ...prev.slice(0, 4)
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', pt: 20, pb: 15, bgcolor: '#050507' }}>
      <SEO
        title="Documentation | Project Details"
        description="Deep-dive into the architecture and engineering of this MERN stack application."
      />

      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Header */}
          <Stack spacing={2} sx={{ mb: 10 }}>
            <Typography
              variant="overline"
              sx={{ color: 'primary.main', fontWeight: 900, letterSpacing: 4 }}
            >
              PROJECT DETAILS
            </Typography>
            <Typography
              variant="h1"
              sx={{
                color: 'white',
                fontWeight: 900,
                fontSize: { xs: '3rem', md: '5rem' },
                letterSpacing: -2,
              }}
            >
              Technical{' '}
              <Box component="span" sx={{ color: 'primary.main' }}>
                Analysis.
              </Box>
            </Typography>
            <Typography sx={{ color: '#64748b', fontSize: '1.2rem', maxWidth: 700, lineHeight: 1.6 }}>
              {docs.engineeringObjective?.description || 
              "An in-depth analysis of the project's architecture, security, and performance."}
            </Typography>
          </Stack>

          <Grid container spacing={8}>
            {/* Left Column: The Narrative */}
            <Grid item xs={12} lg={7}>
              <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
                <Button
                  onClick={() => setActiveTab('explanation')}
                  sx={{
                    flex: 1,
                    py: 1.5,
                    bgcolor: activeTab === 'explanation' ? 'rgba(225, 29, 72, 0.1)' : 'rgba(255,255,255,0.02)',
                    border: '1px solid',
                    borderColor: activeTab === 'explanation' ? 'primary.main' : 'rgba(255,255,255,0.05)',
                    color: activeTab === 'explanation' ? 'white' : '#64748b',
                    borderRadius: '12px',
                    fontWeight: 800,
                    '&:hover': { bgcolor: 'rgba(225, 29, 72, 0.15)', borderColor: 'primary.main' },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Architecture
                </Button>
                <Button
                  onClick={() => setActiveTab('readme')}
                  sx={{
                    flex: 1,
                    py: 1.5,
                    bgcolor: activeTab === 'readme' ? 'rgba(225, 29, 72, 0.1)' : 'rgba(255,255,255,0.02)',
                    border: '1px solid',
                    borderColor: activeTab === 'readme' ? 'primary.main' : 'rgba(255,255,255,0.05)',
                    color: activeTab === 'readme' ? 'white' : '#64748b',
                    borderRadius: '12px',
                    fontWeight: 800,
                    '&:hover': { bgcolor: 'rgba(225, 29, 72, 0.15)', borderColor: 'primary.main' },
                    transition: 'all 0.3s ease'
                  }}
                >
                  README
                </Button>
              </Stack>

              <Box 
                className="glass-card" 
                sx={{ 
                  p: { xs: 4, md: 8 },
                  border: '1px solid rgba(255,255,255,0.03)',
                  background: 'rgba(10,10,15,0.4)',
                  backdropFilter: 'blur(40px)',
                  borderRadius: '30px'
                }}
              >
                <Box
                  className="markdown-content"
                  sx={{
                    color: '#94a3b8',
                    lineHeight: 1.8,
                    fontSize: '1.1rem',
                    '& h1, & h2, & h3': { color: 'white', fontWeight: 800, mt: 4, mb: 2 },
                    '& h1': { fontSize: '2.2rem', letterSpacing: -1 },
                    '& h2': { fontSize: '1.8rem', borderBottom: '1px solid rgba(255,255,255,0.05)', pb: 1 },
                    '& h3': { fontSize: '1.4rem' },
                    '& strong': { color: 'white', fontWeight: 700 },
                    '& p': { mb: 3 },
                    '& ul': { mb: 3, pl: 3 },
                    '& li': { mb: 1 },
                    '& blockquote': { 
                      borderLeft: '4px solid #e11d48', 
                      bgcolor: 'rgba(225, 29, 72, 0.05)', 
                      p: 3, 
                      borderRadius: 2, 
                      my: 4,
                      '& p': { mb: 0, color: 'white', fontWeight: 600 }
                    },
                    '& pre': { background: '#0f172a', padding: 3, borderRadius: 3, overflowX: 'auto', mt: 3, mb: 3, border: '1px solid rgba(255,255,255,0.05)' },
                    '& code': { background: '#1e293b', padding: '3px 8px', borderRadius: 1.5, color: '#e11d48', fontSize: '0.9em' },
                    '& a': { color: '#e11d48', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } },
                  }}
                >
                  {activeTab === 'explanation' ? (
                    <ReactMarkdown>{markdown}</ReactMarkdown>
                  ) : (
                    <ReactMarkdown>{readme}</ReactMarkdown>
                  )}
                </Box>
              </Box>
            </Grid>

            {/* Right Column: Technical Stats */}
            <Grid item xs={12} lg={5}>
              <Stack spacing={4}>
                {/* Tech Stack Grid */}
                <Box className="glass-card" sx={{ p: 4 }}>
                  <Typography
                    sx={{
                      color: '#64748b',
                      fontWeight: 900,
                      fontSize: '0.7rem',
                      letterSpacing: 3,
                      mb: 3,
                      textTransform: 'uppercase'
                    }}
                  >
                    System Components
                  </Typography>
                  <Stack spacing={2.5}>
                    {docs.coreArchitecture?.map((dna, i) => (
                      <Box
                        key={i}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          p: 2.5,
                          bgcolor: 'rgba(255,255,255,0.01)',
                          borderRadius: '16px',
                          border: '1px solid rgba(255,255,255,0.04)',
                        }}
                      >
                        <Typography sx={{ color: '#94a3b8', fontWeight: 700, fontSize: '0.8rem' }}>
                          {dna.title}
                        </Typography>
                        <Typography
                          sx={{
                            color: dna.color || 'primary.main',
                            fontWeight: 900,
                            fontSize: '0.75rem',
                            fontFamily: 'monospace',
                            bgcolor: `${dna.color || '#e11d48'}11`,
                            px: 1.5,
                            py: 0.5,
                            borderRadius: '6px'
                          }}
                        >
                          {dna.val}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>

                {/* Status Logs (Interactive feel) */}
                <Box className="glass-card" sx={{ p: 4, background: '#08080a' }}>
                  <Typography
                    sx={{
                      color: '#64748b',
                      fontWeight: 900,
                      fontSize: '0.7rem',
                      letterSpacing: 3,
                      mb: 3,
                      textTransform: 'uppercase'
                    }}
                  >
                    Environment Status
                  </Typography>
                  <Stack spacing={2}>
                    <AnimatePresence mode="popLayout">
                      {statusLogs.map((log, i) => (
                        <motion.div
                          key={log.id || i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                        >
                          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', color: log.color }}>
                              {log.icon || <Zap size={12} />}
                            </Box>
                            <Typography sx={{ color: '#475569', fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 600 }}>
                              [{log.type}] <span style={{ color: '#94a3b8' }}>{log.message}</span>
                            </Typography>
                          </Box>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </Stack>
                </Box>

                {/* Security Status */}
                <Box 
                  className="glass-card" 
                  sx={{ 
                    p: 4, 
                    borderLeft: '4px solid #00ffcc',
                    background: 'linear-gradient(90deg, rgba(0, 255, 204, 0.05) 0%, transparent 100%)'
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Shield size={20} color="#00ffcc" />
                    <Typography sx={{ color: 'white', fontWeight: 800 }}>
                      Security Status
                    </Typography>
                  </Stack>
                  <Typography sx={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.7 }}>
                    All security protocols are active. The system uses strict CORS policies, 
                    environment variable sanitization, and REST API best practices to ensure 
                    data integrity and secure access.
                  </Typography>
                </Box>

                {/* Performance Metrics */}
                <Box className="glass-card" sx={{ p: 4 }}>
                  <Typography
                    sx={{
                      color: '#64748b',
                      fontWeight: 900,
                      fontSize: '0.7rem',
                      letterSpacing: 3,
                      mb: 4,
                      textTransform: 'uppercase'
                    }}
                  >
                    Optimization Results
                  </Typography>
                  <Grid container spacing={4}>
                    {docs.performanceMetrics?.map((m, i) => (
                      <Grid item xs={4} key={i}>
                        <Typography
                          sx={{ 
                            color: m.color || 'white', 
                            fontWeight: 900, 
                            fontSize: '1.4rem',
                            letterSpacing: -1
                          }}
                        >
                          {m.val}
                        </Typography>
                        <Typography sx={{ color: '#475569', fontSize: '0.6rem', fontWeight: 900, letterSpacing: 1 }}>
                          {m.label}
                        </Typography>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                {/* New Handover Status Section */}
                <Box 
                  className="glass-card" 
                  sx={{ 
                    p: 4, 
                    background: 'linear-gradient(135deg, rgba(225, 29, 72, 0.05) 0%, rgba(5, 5, 7, 0.5) 100%)',
                    border: '1px solid rgba(225, 29, 72, 0.1)'
                  }}
                >
                  <Typography
                    sx={{
                      color: 'primary.main',
                      fontWeight: 900,
                      fontSize: '0.7rem',
                      letterSpacing: 3,
                      mb: 3,
                      textTransform: 'uppercase'
                    }}
                  >
                    Project Handover Status
                  </Typography>
                  <Stack spacing={2}>
                    {[
                      { label: 'Real-time Engine', status: 'ACTIVE', color: '#00ffcc' },
                      { label: 'Humanization Sweep', status: 'COMPLETE', color: '#33ccff' },
                      { label: 'Production Build', status: 'READY', color: '#ff3366' },
                      { label: 'System Documentation', status: 'UPDATED', color: '#a855f7' }
                    ].map((item, i) => (
                      <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography sx={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700 }}>
                          {item.label}
                        </Typography>
                        <Typography
                          sx={{
                            color: item.color,
                            fontSize: '0.65rem',
                            fontWeight: 900,
                            letterSpacing: 1,
                            bgcolor: `${item.color}11`,
                            px: 1.5,
                            py: 0.5,
                            borderRadius: '4px',
                            border: `1px solid ${item.color}33`
                          }}
                        >
                          {item.status}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
});

export default Documentation;
