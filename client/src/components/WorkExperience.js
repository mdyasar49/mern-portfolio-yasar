/**
 * Career timeline section.
 */

import React, { memo } from 'react';
import { Box, Typography, Stack, Container, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';

const CareerCard = memo(({ job, index }) => (
  <motion.div
    initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
  >
    <Box
      className="glass-card"
      sx={{
        p: { xs: 4, md: 6 },
        mb: 4,
        position: 'relative',
        transition: '0.4s',
        '&:hover': {
          borderColor: 'primary.main',
          transform: 'scale(1.02)',
        },
      }}
    >
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Stack spacing={2}>
            <Typography
              variant="h5"
              sx={{
                color: 'white',
                fontWeight: 900,
                fontFamily: 'Outfit',
                letterSpacing: -0.5,
              }}
            >
              {job.company}
            </Typography>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ color: 'primary.main' }}>
              <Calendar size={16} />
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                }}
              >
                {job.period}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ color: '#64748b' }}>
              <MapPin size={16} />
              <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                {job.location || 'Remote'}
              </Typography>
            </Stack>
          </Stack>
        </Grid>

        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            <Typography
              variant="h6"
              sx={{
                color: 'white',
                fontWeight: 700,
                fontSize: '1.25rem',
              }}
            >
              {job.role}
            </Typography>
            <Typography
              sx={{
                color: '#94a3b8',
                fontSize: '1rem',
                lineHeight: 1.8,
              }}
            >
              {job.description}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
              {job.technologies?.map((tech) => (
                <Box
                  key={tech}
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: '4px',
                    bgcolor: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    color: '#64748b',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                  }}
                >
                  {tech}
                </Box>
              ))}
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  </motion.div>
));

const WorkExperience = memo(({ profile, experience }) => {
  if (!experience) return null;

  return (
    <Box id="experience" sx={{ py: { xs: 15, md: 25 } }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: { xs: 10, md: 15 }, textAlign: 'center' }}>
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
            {profile.customData?.experienceOverline || 'WORK EXPERIENCE'}
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
            {profile.customData?.experienceHeadline || 'Professional Journey.'}
          </Typography>
        </Box>

        <Stack spacing={2}>
          {experience.map((job, i) => (
            <CareerCard key={i} job={job} index={i} />
          ))}
        </Stack>
      </Container>
    </Box>
  );
});

export default WorkExperience;
