/**
 * About section.
 */

import React, { memo } from 'react';
import { Box, Typography, Grid, Stack, Container } from '@mui/material';
import { motion } from 'framer-motion';
import { Target, Zap, Award } from 'lucide-react';

const About = memo(({ profile }) => {
  if (!profile) return null;

  const stats = [
    {
      label: profile.customData?.expertiseLabel || 'Expertise',
      value: profile.expertiseLevel || 'Full Stack Developer',
      icon: <Target size={20} />,
    },
    {
      label: profile.customData?.experienceLabel || 'Experience',
      value: profile.customData?.experienceValue || '3 Yrs 1 Mo',
      icon: <Zap size={20} />,
    },
    {
      label: profile.customData?.portfolioLabel || 'Portfolio',
      value: `${profile.projects?.length || 0}+ Projects`,
      icon: <Award size={20} />,
    },
  ];

  return (
    <Box id="about" sx={{ py: { xs: 6, md: 8 }, position: 'relative' }}>
      <Container maxWidth="xl">
        <Grid container spacing={10} alignItems="flex-start">
          {/* Left: Section Header & Narrative */}
          <Grid item xs={12} lg={7}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <Typography
                variant="overline"
                sx={{
                  color: 'primary.main',
                  fontWeight: 800,
                  letterSpacing: 3,
                  mb: 3,
                  display: 'block',
                  fontFamily: 'Outfit',
                }}
              >
                {profile.customData?.aboutOverline || 'ABOUT ME'}
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '2.5rem', md: '4.5rem' },
                  fontWeight: 900,
                  lineHeight: 1,
                  mb: 6,
                  letterSpacing: -2,
                  color: 'white',
                }}
              >
                {profile.customData?.aboutHeadline || 'Crafting modern digital experiences.'}
              </Typography>

              <Typography
                sx={{
                  color: '#94a3b8',
                  fontSize: { xs: '1.1rem', md: '1.4rem' },
                  lineHeight: 1.8,
                  fontWeight: 400,
                  mb: 8,
                  borderLeft: '4px solid #e11d48',
                  pl: 4,
                }}
              >
                {profile.summary}
              </Typography>

              {/* Stats */}
              <Grid container spacing={3}>
                {stats.map((stat, i) => (
                  <Grid item xs={12} sm={4} key={i}>
                    <Box
                      className="glass-card"
                      sx={{
                        p: 4,
                        height: '100%',
                      }}
                    >
                      <Box sx={{ color: 'primary.main', mb: 2 }}>{stat.icon}</Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#64748b',
                          fontWeight: 700,
                          letterSpacing: 1,
                          display: 'block',
                          mb: 1,
                          textTransform: 'uppercase',
                        }}
                      >
                        {stat.label}
                      </Typography>
                      <Typography
                        sx={{
                          color: 'white',
                          fontWeight: 800,
                          fontSize: '1.25rem',
                        }}
                      >
                        {stat.value}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          </Grid>

          {/* Right: Competencies & Skills */}
          <Grid item xs={12} lg={5}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <Box
                className="glass-card"
                sx={{
                  p: { xs: 4, md: 8 },
                  background:
                    'linear-gradient(145deg, rgba(255,255,255,0.01) 0%, rgba(255,255,255,0.03) 100%)',
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    color: 'white',
                    fontWeight: 800,
                    mb: 4,
                    letterSpacing: -0.5,
                  }}
                >
                  {profile.customData?.competenciesTitle || 'Technical Expertise'}
                </Typography>

                <Stack spacing={2}>
                  {profile.softSkills?.map((skill, index) => (
                    <Box
                      key={skill}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 2,
                        borderRadius: '16px',
                        border: '1px solid rgba(255,255,255,0.03)',
                        transition: '0.3s',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.05)',
                          transform: 'translateX(10px)',
                          borderColor: 'primary.main',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          bgcolor: 'primary.main',
                        }}
                      />
                      <Typography sx={{ color: '#94a3b8', fontWeight: 600 }}>{skill}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
});

export default About;
