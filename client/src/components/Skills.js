/**
 * Technical skills section.
 */

import React, { memo } from 'react';
import { Box, Typography, Grid, Container } from '@mui/material';
import { motion } from 'framer-motion';
import { Database, Layout, Terminal, Cpu, Activity, Brain } from 'lucide-react';

const SkillCard = memo(({ title, skills, icon: Icon, delay, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    viewport={{ once: true }}
  >
    <Box
      className="glass-card"
      sx={{
        p: 4,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        '&:hover': {
          borderColor: color,
        },
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: '12px',
          bgcolor: `${color}10`,
          color: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size={24} />
      </Box>

      <Typography
        variant="h6"
        sx={{
          color: 'white',
          fontWeight: 800,
          fontFamily: 'Outfit',
          letterSpacing: -0.5,
        }}
      >
        {title}
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {skills.map((skill) => (
          <Box
            key={skill}
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: '6px',
              bgcolor: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              color: '#94a3b8',
              fontSize: '0.75rem',
              fontWeight: 600,
              transition: '0.3s',
              '&:hover': {
                color: 'white',
                borderColor: color,
                bgcolor: `${color}05`,
              },
            }}
          >
            {skill}
          </Box>
        ))}
      </Box>
    </Box>
  </motion.div>
));

const Skills = memo(({ profile, skills }) => {
  if (!skills) return null;

  const categories = [
    { title: 'Frontend', skills: skills.frontend || [], icon: Layout, color: '#f97316' }, // Orange
    { title: 'Backend', skills: skills.backend || [], icon: Database, color: '#e11d48' }, // Rose
    { title: 'Database', skills: skills.database || [], icon: Cpu, color: '#ec4899' }, // Pink
    {
      title: 'DevOps',
      skills: skills.terminal || skills.tools || [],
      icon: Terminal,
      color: '#c026d3',
    }, // Magenta
    { title: 'Ecosystem', skills: skills.productivityTools || [], icon: Brain, color: '#00e5ff' }, // Cyan Accent
    { title: 'Other', skills: skills.other || [], icon: Activity, color: '#94a3b8' },
  ];

  return (
    <Box id="skills" sx={{ py: { xs: 15, md: 25 } }}>
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
            {profile.customData?.skillsOverline || 'TECHNICAL SKILLS'}
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
            {profile.customData?.skillsHeadline || 'Core Technical Stack.'}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {categories.map((cat, i) => (
            <Grid item xs={12} sm={6} md={4} lg={2.4} key={cat.title}>
              <SkillCard {...cat} delay={i * 0.1} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
});

export default Skills;
