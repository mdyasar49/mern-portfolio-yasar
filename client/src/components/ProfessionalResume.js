/**
 * Resume section.
 */

import React, { memo } from 'react';
import { Box, Typography, Button, Stack, Container, Grid } from '@mui/material';
import { Download, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import API_BASE_URL from '../config';

const ProfessionalResume = memo(({ profile }) => {
  const config = profile?.resumeConfig || {};

  const resumeApi = API_BASE_URL ? `${API_BASE_URL}/profile` : '';
  const iframeSrc = resumeApi
    ? `/resume-pro/index.html?api=${encodeURIComponent(resumeApi)}`
    : '/resume-pro/index.html';

  const handleDownload = () => {
    window.open(`/resume-pro/${config.filename || 'resume.pdf'}`, '_blank');
  };

  return (
    <Box id="resume" sx={{ py: { xs: 6, md: 8 }, position: 'relative' }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: { xs: 4, md: 6 }, textAlign: 'center' }}>
          <Typography
            variant="overline"
            sx={{
              color: 'primary.main',
              fontWeight: 800,
              letterSpacing: 4,
              mb: 3,
              display: 'block',
            }}
          >
            {profile.customData?.resumeOverline || 'RESUME & DOCUMENTS'}
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              fontSize: { xs: '2.5rem', md: '5rem' },
              color: 'white',
              letterSpacing: -2,
              fontFamily: 'Outfit',
            }}
          >
            {profile.customData?.resumeHeadline || 'Professional Resume.'}
          </Typography>
        </Box>

        <Grid container spacing={8} alignItems="center">
          {/* Left: Resume Preview with HUD Framing */}
          <Grid item xs={12} lg={7}>
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <Box sx={{ position: 'relative', p: { xs: 0, md: 4 } }}>
                {/* Decorative Brackets */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: 40,
                    height: 40,
                    borderTop: '2px solid #e11d48',
                    borderLeft: '2px solid #e11d48',
                    opacity: 0.3,
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: 40,
                    height: 40,
                    borderBottom: '2px solid #e11d48',
                    borderRight: '2px solid #e11d48',
                    opacity: 0.3,
                  }}
                />

                <Box
                  className="glass-card"
                  sx={{
                    p: 1,
                    height: { xs: '500px', md: '750px' },
                    overflow: 'hidden',
                    position: 'relative',
                    bgcolor: 'rgba(255,255,255,0.01)',
                    boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
                    borderRadius: '4px',
                  }}
                >
                  <iframe
                    src={iframeSrc}
                    title="Direct Resume View"
                    width="100%"
                    height="100%"
                    style={{ border: 'none', background: 'white', borderRadius: '4px' }}
                  />

                </Box>
              </Box>
            </motion.div>
          </Grid>

          {/* Right: Actions & Metadata */}
          <Grid item xs={12} lg={5}>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <Stack spacing={6}>
                <Box>
                  <Typography
                    variant="h4"
                    sx={{
                      color: 'white',
                      fontWeight: 900,
                      mb: 2.5,
                      fontSize: { xs: '2rem', md: '2.5rem' },
                      fontFamily: 'Outfit',
                      letterSpacing: -1,
                    }}
                  >
                    {profile.customData?.resumePersonaTitle || 'Professional Profile.'}
                  </Typography>
                  <Typography
                    sx={{
                      color: '#94a3b8',
                      fontSize: '1.1rem',
                      lineHeight: 1.8,
                      fontWeight: 400,
                    }}
                  >
                    {profile.customData?.resumePersonaDesc ||
                      'A comprehensive overview of my technical expertise, professional journey, and engineering methodologies.'}
                  </Typography>
                </Box>

                <Grid container spacing={3}>
                   {[
                    { label: 'DOCUMENT', value: 'Technical Resume' },
                    { label: 'VERSION', value: config.version || '1.0' },
                    { label: 'FORMAT', value: 'PDF' },
                    { label: 'AVAILABILITY', value: 'Ready' },
                  ].map((s, i) => (
                    <Grid item xs={6} key={i}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'primary.main',
                          fontWeight: 900,
                          display: 'block',
                          textTransform: 'uppercase',
                          letterSpacing: 2,
                          mb: 1,
                          fontSize: '0.6rem',
                        }}
                      >
                        {s.label}
                      </Typography>
                      <Typography
                        sx={{
                          color: 'white',
                          fontWeight: 700,
                          fontSize: '1rem',
                          fontFamily: 'Outfit',
                        }}
                      >
                        {s.value}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>

                <Stack spacing={2.5}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleDownload}
                    startIcon={<Download size={18} />}
                    sx={{
                      bgcolor: 'white',
                      color: 'black',
                      py: 2.5,
                      borderRadius: '14px',
                      fontWeight: 900,
                      fontSize: '0.95rem',
                      textTransform: 'none',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                      '&:hover': {
                        bgcolor: 'primary.main',
                        color: 'white',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    DOWNLOAD PDF
                  </Button>
                  <Button
                    fullWidth
                    component={RouterLink}
                    to="/resume"
                    startIcon={<ExternalLink size={18} />}
                    sx={{
                      color: 'white',
                      py: 2.5,
                      borderRadius: '14px',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      textTransform: 'none',
                      border: '1px solid rgba(255,255,255,0.1)',
                      bgcolor: 'rgba(255,255,255,0.02)',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.05)',
                        borderColor: 'primary.main',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    INTERACTIVE VIEW
                  </Button>
                </Stack>
              </Stack>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
});

export default ProfessionalResume;
