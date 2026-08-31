/**
 * Portfolio Home Page.
 * Assembles all sections and handles loading states.
 */

import React, { memo } from 'react';
// Material UI components for global layout and loading state
import { Box, Container, Typography } from '@mui/material';
// SEO component for dynamic meta tags
import SEO from '../components/SEO';
// All page sections (Components)
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import TechnicalInsight from '../components/TechnicalInsight';
import WorkExperience from '../components/WorkExperience';
import Projects from '../components/Projects';
import EducationHistory from '../components/EducationHistory';
import ProfessionalResume from '../components/ProfessionalResume';
import SystemLogStream from '../components/SystemLogStream';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const Portfolio = memo(({ profile, loading }) => {
  // Loading state
  const isCoreLoaded = profile?.name || profile?.menuItems;

  if (loading && !isCoreLoaded)
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          bgcolor: 'background.default',
          color: 'white',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Loading...
        </Typography>
      </Box>
    );

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        minHeight: '100vh',
        scrollBehavior: 'smooth',
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      {/* Update browser tab title and description based on fetched profile data */}
      <SEO title="Portfolio" description={profile?.summary || 'Full Stack Engineer Portfolio'} />

      {/* Content */}

      <Container maxWidth="xl" sx={{ pt: 4, pb: 4 }}>
        {/* Sections are rendered as soon as their specific data arrives */}
        {(profile.name || profile.summary) && <Hero profile={profile} />}
        {profile.summary && <About profile={profile} />}
        {profile.technicalSkills && <Skills profile={profile} skills={profile.technicalSkills} />}
        {profile.performanceData && <TechnicalInsight profile={profile} />}

        {profile.projects && <Projects profile={profile} projects={profile.projects} />}

        <Box id="professional-experience">
          {profile.experience && (
            <WorkExperience profile={profile} experience={profile.experience} />
          )}
          {profile.education && (
            <EducationHistory profile={profile} education={profile.education} />
          )}
        </Box>

        {profile.resumeConfig && <ProfessionalResume profile={profile} />}
        {(profile.documentation?.engineeringObjective ||
          profile.documentation?.systemMetricsConfig) && <SystemLogStream profile={profile} />}

        {profile.email && <Contact profile={profile} />}
      </Container>

      {/* Global Footer */}
      <Footer profile={profile} />
    </Box>
  );
});

export default Portfolio;
