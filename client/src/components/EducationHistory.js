/**
 * Education history section.
 */

import React, { memo } from 'react';
import { Box, Typography, Stack, Container, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { GraduationCap, Award } from 'lucide-react';

const EducationCard = memo(({ edu, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: index * 0.1 }}
    viewport={{ once: true }}
  >
    <Box
      className="glass-card"
      sx={{
        p: { xs: 4, md: 5 },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        transition: '0.4s',
        '&:hover': {
          borderColor: 'primary.main',
          transform: 'translateY(-10px)',
        },
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Box
          sx={{
            width: 50,
            height: 50,
            borderRadius: '12px',
            bgcolor: 'rgba(225, 29, 72, 0.1)',
            color: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <GraduationCap size={24} />
        </Box>
        <Typography
          sx={{
            color: '#475569',
            fontWeight: 800,
            fontSize: '0.75rem',
            fontFamily: 'monospace',
            letterSpacing: 1,
          }}
        >
          {edu.period}
        </Typography>
      </Stack>

      <Box>
        <Typography
          variant="h5"
          sx={{
            color: 'white',
            fontWeight: 900,
            fontFamily: 'Outfit',
            mb: 1,
          }}
        >
          {edu.degree}
        </Typography>
        <Typography
          sx={{
            color: 'primary.main',
            fontWeight: 700,
            fontSize: '1rem',
          }}
        >
          {edu.institution}
        </Typography>
      </Box>

      <Typography
        sx={{
          color: '#94a3b8',
          fontSize: '0.9rem',
          lineHeight: 1.8,
        }}
      >
        {edu.description}
      </Typography>

      {edu.achievements && (
        <Stack
          spacing={1.5}
          sx={{ mt: 'auto', pt: 3, borderTop: '1px solid rgba(255,255,255,0.03)' }}
        >
          {edu.achievements.map((ach, i) => (
            <Stack key={i} direction="row" spacing={1.5} alignItems="center">
              <Award size={14} color="#e11d48" />
              <Typography sx={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>
                {ach}
              </Typography>
            </Stack>
          ))}
        </Stack>
      )}
    </Box>
  </motion.div>
));

const EducationHistory = memo(({ profile, education }) => {
  if (!education) return null;

  return (
    <Box id="education" sx={{ py: { xs: 6, md: 8 } }}>
      <Container maxWidth="xl">
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
            {profile.customData?.educationOverline || 'EDUCATION'}
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              fontSize: { xs: '2.5rem', md: '5rem' },
              color: 'white',
              letterSpacing: -2,
            }}
          >
            {profile.customData?.educationHeadline || 'Academic Background.'}
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {education.map((edu, i) => (
            <Grid item xs={12} md={6} lg={4} key={i}>
              <EducationCard edu={edu} index={i} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
});

export default EducationHistory;
