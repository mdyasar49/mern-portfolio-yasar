/**
 * Career timeline section.
 */

import React, { memo } from 'react';
import { Box, Typography, Stack, Container, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';

const CareerCard = memo(({ job, index }) => {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      viewport={{ once: true }}
      style={{ width: '100%' }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: { xs: 'flex-start', md: isEven ? 'flex-start' : 'flex-end' },
          position: 'relative',
          mb: 8,
          '&::before': {
            content: '""',
            position: 'absolute',
            left: { xs: 0, md: '50%' },
            top: 40,
            width: 20,
            height: 20,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            transform: { xs: 'translateX(-50%)', md: 'translateX(-50%)' },
            boxShadow: '0 0 20px rgba(225, 29, 72, 0.4)',
            zIndex: 2,
            display: { xs: 'none', md: 'block' },
          },
        }}
      >
        <Box
          className="glass-card"
          sx={{
            width: { xs: '100%', md: '45%' },
            p: { xs: 4, md: 6 },
            transition: '0.4s',
            '&:hover': {
              borderColor: 'primary.main',
              transform: 'scale(1.02)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            },
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack spacing={2}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  flexWrap="wrap"
                  gap={2}
                >
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
                  <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                    sx={{
                      px: 2,
                      py: 0.5,
                      borderRadius: '100px',
                      bgcolor: 'rgba(225, 29, 72, 0.1)',
                      border: '1px solid rgba(225, 29, 72, 0.2)',
                      color: 'primary.main',
                    }}
                  >
                    <Calendar size={14} />
                    <Typography
                      sx={{
                        fontWeight: 800,
                        fontSize: '0.65rem',
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                      }}
                    >
                      {job.period}
                    </Typography>
                  </Stack>
                </Stack>

                <Typography
                  variant="h6"
                  sx={{
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                  }}
                >
                  {job.role}
                </Typography>

                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ color: '#64748b' }}>
                  <MapPin size={14} />
                  <Typography sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                    {job.location || 'Remote'}
                  </Typography>
                </Stack>

                {Array.isArray(job.description) ? (
                  <Stack spacing={1} sx={{ mb: 2 }}>
                    {job.description.map((point, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                        <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: 'primary.main', mt: 1, flexShrink: 0 }} />
                        <Typography sx={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.6 }}>
                          {point}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Typography
                    sx={{
                      color: '#94a3b8',
                      fontSize: '0.9rem',
                      lineHeight: 1.7,
                    }}
                  >
                    {job.description}
                  </Typography>
                )}

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.2 }}>
                  {job.technologies?.map((tech) => (
                    <Box
                      key={tech}
                      sx={{
                        px: 1.2,
                        py: 0.4,
                        borderRadius: '4px',
                        bgcolor: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        color: '#64748b',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        transition: '0.3s',
                        '&:hover': {
                          color: 'white',
                          borderColor: 'primary.main',
                        },
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
      </Box>
    </motion.div>
  );
});

const WorkExperience = memo(({ profile, experience }) => {
  if (!experience) return null;

  return (
    <Box id="experience" sx={{ py: { xs: 6, md: 8 } }}>
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

        <Box sx={{ position: 'relative' }}>
          {/* Vertical Line */}
          <Box
            sx={{
              position: 'absolute',
              left: { xs: 0, md: '50%' },
              top: 0,
              bottom: 0,
              width: 1,
              bgcolor: 'rgba(255,255,255,0.05)',
              display: { xs: 'none', md: 'block' },
            }}
          />
          <Stack spacing={2}>
            {experience.map((job, i) => (
              <CareerCard key={i} job={job} index={i} />
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
});

export default WorkExperience;
