import React, { memo, useState, useEffect } from 'react';
import { Box, Typography, Container, Stack, Grid, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import SEO from '../components/SEO';

const Documentation = memo(({ profile }) => {
  const [markdown, setMarkdown] = useState('');
  const [readme, setReadme] = useState('');
  const [activeTab, setActiveTab] = useState('explanation');
  const docs = profile?.documentation || {};

  useEffect(() => {
    fetch('/docs/PROJECT_EXPLANATION.md')
      .then((res) => res.text())
      .then((text) => setMarkdown(text))
      .catch((err) => console.error('Failed to load documentation:', err));

    fetch('/docs/README.md')
      .then((res) => res.text())
      .then((text) => setReadme(text))
      .catch((err) => console.error('Failed to load readme:', err));
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', pt: 20, pb: 15, bgcolor: '#050507' }}>
      <SEO
        title="Documentation | Technical Architecture"
        description="Deep-dive into the architecture and engineering philosophy of this MERN stack application."
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
              DOCUMENTATION
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
              Project{' '}
              <Box component="span" sx={{ color: 'primary.main' }}>
                Architecture.
              </Box>
            </Typography>
            <Typography sx={{ color: '#475569', fontSize: '1.2rem', maxWidth: 700 }}>
              An in-depth technical analysis of the architecture, security, and performance
              protocols governing this MERN stack application.
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
                  Project Explanation
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
                  README.md
                </Button>
              </Stack>

              <Box className="glass-card" sx={{ p: { xs: 4, md: 8 } }}>
                <Box
                  className="markdown-content"
                  sx={{
                    color: '#94a3b8',
                    lineHeight: 1.8,
                    fontSize: '1.1rem',
                    '& h1, & h2, & h3': { color: 'white', fontWeight: 800, mt: 4, mb: 2 },
                    '& h1': { fontSize: '2rem' },
                    '& h2': { fontSize: '1.7rem' },
                    '& h3': { fontSize: '1.4rem' },
                    '& strong': { color: 'white', fontWeight: 700 },
                    '& p': { mb: 3 },
                    '& pre': { background: '#0f172a', padding: 2, borderRadius: 2, overflowX: 'auto', mt: 2, mb: 2 },
                    '& code': { background: '#0f172a', padding: '2px 6px', borderRadius: 1, color: '#38bdf8' },
                    '& a': { color: '#e11d48' },
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
                      color: 'primary.main',
                      fontWeight: 900,
                      fontSize: '0.7rem',
                      letterSpacing: 2,
                      mb: 3,
                    }}
                  >
                    PROJECT DETAILS
                  </Typography>
                  <Stack spacing={2}>
                    {docs.coreArchitecture?.map((dna, i) => (
                      <Box
                        key={i}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          p: 2,
                          bgcolor: 'rgba(255,255,255,0.02)',
                          borderRadius: 2,
                          border: '1px solid rgba(255,255,255,0.05)',
                        }}
                      >
                        <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '0.85rem' }}>
                          {dna.title}
                        </Typography>
                        <Typography
                          sx={{
                            color: dna.color || 'primary.main',
                            fontWeight: 800,
                            fontSize: '0.75rem',
                            fontFamily: 'monospace',
                          }}
                        >
                          {dna.val}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>

                {/* Security Status */}
                <Box className="glass-card" sx={{ p: 4, borderLeft: '4px solid #00ffcc' }}>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Shield size={20} color="#00ffcc" />
                    <Typography sx={{ color: 'white', fontWeight: 800 }}>
                      Security Protocols
                    </Typography>
                  </Stack>
                  <Typography sx={{ color: '#475569', fontSize: '0.85rem', lineHeight: 1.6 }}>
                    Advanced security protocols active. Industry-standard encryption applied to all
                    data streams. Strict CORS and CSP policies enforced to ensure secure global
                    access.
                  </Typography>
                </Box>

                {/* Performance Metrics */}
                <Box className="glass-card" sx={{ p: 4 }}>
                  <Typography
                    sx={{
                      color: 'primary.main',
                      fontWeight: 900,
                      fontSize: '0.7rem',
                      letterSpacing: 2,
                      mb: 3,
                    }}
                  >
                    PERFORMANCE METRICS
                  </Typography>
                  <Grid container spacing={2}>
                    {docs.performanceMetrics?.map((m, i) => (
                      <Grid item xs={4} key={i}>
                        <Typography
                          sx={{ color: m.color || 'white', fontWeight: 900, fontSize: '1.2rem' }}
                        >
                          {m.val}
                        </Typography>
                        <Typography sx={{ color: '#334155', fontSize: '0.55rem', fontWeight: 800 }}>
                          {m.label}
                        </Typography>
                      </Grid>
                    ))}
                  </Grid>
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
