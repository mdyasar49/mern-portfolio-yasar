/**
 * Projects showcase section.
 */

import React, { useState, memo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Stack,
  Button,
  CardMedia,
  Dialog,
  IconButton,
  useMediaQuery,
  useTheme,
  Tabs,
  Tab,
  Container,
} from '@mui/material';
import { Github, X, Activity, Cpu, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectCard = memo(({ project, onOpen }) => {
  // Fallback to professional project image if specific keyword is detected
  const displayImage = project.name.toLowerCase().includes('professional')
    ? '/modern-mern.png'
    : project.image;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      style={{ height: '100%' }}
    >
      <Card
        className="glass-card"
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
        }}
        onClick={() => onOpen(project)}
      >
        <Box sx={{ position: 'relative', height: 280, overflow: 'hidden' }}>
          <CardMedia
            component="img"
            image={displayImage}
            alt={project.name}
            sx={{
              height: '100%',
              transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
              filter: 'grayscale(1) brightness(0.7)',
              '.glass-card:hover &': {
                filter: 'grayscale(0) brightness(1)',
                transform: 'scale(1.1)',
              },
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(5,5,7,0.8) 0%, transparent 100%)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 20,
              right: 20,
              p: 1.5,
              borderRadius: '50%',
              bgcolor: 'rgba(5,5,7,0.5)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              opacity: 0,
              transform: 'translateY(10px)',
              transition: '0.4s',
              '.glass-card:hover &': {
                opacity: 1,
                transform: 'translateY(0)',
              },
            }}
          >
            <ArrowUpRight size={20} />
          </Box>
        </Box>

        <CardContent sx={{ p: 4, flexGrow: 1 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 900,
              color: 'white',
              fontSize: '1.5rem',
              mb: 2,
              fontFamily: 'Outfit',
              letterSpacing: -0.5,
            }}
          >
            {project.name}
          </Typography>
          <Typography
            sx={{
              color: '#94a3b8',
              fontSize: '0.95rem',
              lineHeight: 1.6,
              mb: 4,
            }}
          >
            {project.description[0]}
          </Typography>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              flexWrap: 'wrap',
              gap: 1,
              opacity: 0.6,
              transition: '0.4s cubic-bezier(0.23, 1, 0.32, 1)',
              '.glass-card:hover &': {
                opacity: 1,
              },
            }}
          >
            {project.technologies.slice(0, 3).map((tech) => (
              <Box
                key={tech}
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: '4px',
                  bgcolor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  color: '#64748b',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                }}
              >
                {tech}
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
});

const Projects = memo(({ profile, projects }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  if (!projects || !Array.isArray(projects)) return null;

  return (
    <Box id="projects" sx={{ py: { xs: 15, md: 25 } }}>
      <Container maxWidth="xl">
        {/* Header */}
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
            {profile.customData?.projectsOverline || 'FEATURED PROJECTS'}
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
            {profile.customData?.projectsHeadline || 'Bringing ideas to life.'}
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {projects.map((project) => (
            <Grid item xs={12} md={6} lg={4} key={project.name}>
              <ProjectCard
                project={project}
                onOpen={(p) => {
                  setSelectedProject(p);
                  setActiveTab(0);
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Detail Modal - Premium Project Design */}
      <Dialog
        open={Boolean(selectedProject)}
        onClose={() => setSelectedProject(null)}
        maxWidth="lg"
        fullWidth
        fullScreen={fullScreen}
        scroll="body"
        PaperProps={{
          sx: {
            bgcolor: 'rgba(5,5,7,0.99)',
            backgroundImage: 'none',
            borderRadius: fullScreen ? 0 : '32px',
            border: '1px solid rgba(225,29,72,0.2)',
            backdropFilter: 'blur(40px)',
            boxShadow: '0 50px 100px rgba(0,0,0,1), 0 0 40px rgba(225,29,72,0.1)',
            overflow: 'hidden',
          },
        }}
      >
        <AnimatePresence mode="wait">
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            >
              <Box sx={{ position: 'relative' }}>
                {/* Visual Details */}
                {!fullScreen && (
                  <>
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 32,
                        left: 32,
                        width: 20,
                        height: 20,
                        borderTop: '2px solid rgba(225,29,72,0.5)',
                        borderLeft: '2px solid rgba(225,29,72,0.5)',
                        zIndex: 1,
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 32,
                        right: 32,
                        width: 20,
                        height: 20,
                        borderTop: '2px solid rgba(225,29,72,0.5)',
                        borderRight: '2px solid rgba(225,29,72,0.5)',
                        zIndex: 1,
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 32,
                        left: 32,
                        width: 20,
                        height: 20,
                        borderBottom: '2px solid rgba(225,29,72,0.5)',
                        borderLeft: '2px solid rgba(225,29,72,0.5)',
                        zIndex: 1,
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 32,
                        right: 32,
                        width: 20,
                        height: 20,
                        borderBottom: '2px solid rgba(225,29,72,0.5)',
                        borderRight: '2px solid rgba(225,29,72,0.5)',
                        zIndex: 1,
                      }}
                    />
                  </>
                )}

                {/* Close Button */}
                <IconButton
                  onClick={() => setSelectedProject(null)}
                  sx={{
                    position: 'absolute',
                    top: 24,
                    right: 24,
                    zIndex: 10,
                    bgcolor: 'rgba(255,255,255,0.03)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.08)',
                    '&:hover': { bgcolor: '#ef4444', borderColor: '#ef4444' },
                  }}
                >
                  <X size={20} />
                </IconButton>

                <Grid container>
                  {/* Left Column: Visual & Telemetry */}
                  <Grid item xs={12} md={5}>
                    <Box
                      sx={{
                        height: '100%',
                        position: 'relative',
                        minHeight: { xs: 240, sm: 300, md: 700 },
                        bgcolor: 'black',
                      }}
                    >
                      <Box
                        component="img"
                        src={
                          selectedProject.name.toLowerCase().includes('professional')
                            ? '/modern-mern.png'
                            : selectedProject.image
                        }
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          opacity: 0.6,
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          background:
                            'linear-gradient(to right, rgba(5,5,7,0.9) 0%, transparent 100%)',
                        }}
                      />

                      {/* Project Stats */}
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: { xs: 20, md: 40 },
                          left: { xs: 20, md: 40 },
                          right: { xs: 20, md: 40 },
                          zIndex: 2,
                        }}
                      >
                        <Stack spacing={{ xs: 2, md: 4 }}>
                          <Box>
                            <Typography
                              sx={{
                                color: 'primary.main',
                                fontWeight: 900,
                                fontSize: '0.55rem',
                                letterSpacing: 2,
                                mb: 1,
                              }}
                            >
                              PROJECT TYPE
                            </Typography>
                            <Stack direction="row" spacing={1.5}>
                              {['Scalable', 'Modular', 'Encrypted'].map((tag) => (
                                <Typography
                                  key={tag}
                                  sx={{
                                    color: 'white',
                                    fontWeight: 800,
                                    fontSize: { xs: '0.6rem', md: '0.75rem' },
                                    fontFamily: 'monospace',
                                  }}
                                >
                                  {'//'} {tag.toUpperCase()}
                                </Typography>
                              ))}
                            </Stack>
                          </Box>

                          <Grid container spacing={1.5}>
                            {[
                              { label: 'Latency', val: '24ms', icon: <Activity size={12} /> },
                              { label: 'Uptime', val: '99.9%', icon: <Cpu size={12} /> },
                            ].map((stat) => (
                              <Grid item xs={6} key={stat.label}>
                                <Box
                                  sx={{
                                    p: { xs: 1.5, md: 2 },
                                    bgcolor: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    borderRadius: '12px',
                                  }}
                                >
                                  <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                    sx={{ mb: 0.5, color: 'primary.main' }}
                                  >
                                    {stat.icon}
                                    <Typography
                                      sx={{
                                        fontSize: '0.55rem',
                                        fontWeight: 800,
                                        color: '#64748b',
                                      }}
                                    >
                                      {stat.label.toUpperCase()}
                                    </Typography>
                                  </Stack>
                                  <Typography
                                    sx={{
                                      color: 'white',
                                      fontWeight: 900,
                                      fontSize: { xs: '0.85rem', md: '1rem' },
                                      fontFamily: 'monospace',
                                    }}
                                  >
                                    {stat.val}
                                  </Typography>
                                </Box>
                              </Grid>
                            ))}
                          </Grid>
                        </Stack>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Right Column: Narrative & Stack */}
                  <Grid item xs={12} md={7}>
                    <Box sx={{ p: { xs: 3, sm: 5, md: 8, lg: 10 } }}>
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Stack spacing={{ xs: 4, md: 6 }}>
                          <Box>
                            <Typography
                              sx={{
                                color: 'primary.main',
                                fontWeight: 900,
                                fontSize: '0.65rem',
                                letterSpacing: 4,
                                mb: 1.5,
                                textTransform: 'uppercase',
                              }}
                            >
                              {profile.customData?.projectsOverviewLabel || 'PROJECT OVERVIEW'}
                            </Typography>
                            <Typography
                              variant="h2"
                              sx={{
                                color: 'white',
                                fontWeight: 900,
                                fontSize: { xs: '2.2rem', sm: '3.2rem', md: '5rem' },
                                fontFamily: 'Outfit',
                                letterSpacing: -1.5,
                                lineHeight: 1.1,
                              }}
                            >
                              {selectedProject.name}
                            </Typography>
                          </Box>

                          <Box sx={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                            <Tabs
                              value={activeTab}
                              onChange={(e, v) => setActiveTab(v)}
                              variant="scrollable"
                              scrollButtons="auto"
                              sx={{
                                '& .MuiTabs-indicator': {
                                  bgcolor: 'primary.main',
                                  height: 4,
                                  borderRadius: '4px',
                                },
                                '& .MuiTab-root': {
                                  color: '#334155',
                                  fontWeight: 900,
                                  fontSize: { xs: '0.7rem', md: '0.85rem' },
                                  letterSpacing: 2,
                                  px: 0,
                                  mr: { xs: 3, md: 6 },
                                  minWidth: 'auto',
                                  transition: '0.3s',
                                  '&.Mui-selected': { color: 'white' },
                                  '&:hover': { color: 'primary.main' },
                                },
                              }}
                            >
                              <Tab label="OVERVIEW" />
                              <Tab label="TECH STACK" />
                            </Tabs>
                          </Box>

                          <Box sx={{ minHeight: { xs: 200, md: 300 } }}>
                            {activeTab === 0 ? (
                              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <Typography
                                  sx={{
                                    color: '#94a3b8',
                                    fontSize: { xs: '1rem', md: '1.25rem' },
                                    lineHeight: 1.8,
                                    fontWeight: 400,
                                  }}
                                >
                                  {selectedProject.description.join(' ')}
                                </Typography>
                              </motion.div>
                            ) : (
                              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <Grid container spacing={2}>
                                  {selectedProject.technologies.map((t, i) => (
                                    <Grid item xs={6} sm={4} key={t}>
                                      <Box
                                        sx={{
                                          p: { xs: 1.5, md: 2.5 },
                                          borderRadius: '16px',
                                          bgcolor: 'rgba(225,29,72,0.03)',
                                          border: '1px solid rgba(255,255,255,0.05)',
                                          textAlign: 'center',
                                          transition: '0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                                          '&:hover': {
                                            bgcolor: 'rgba(225,29,72,0.08)',
                                            transform: 'translateY(-5px)',
                                            borderColor: 'primary.main',
                                            boxShadow: '0 10px 20px rgba(225,29,72,0.1)',
                                          },
                                        }}
                                      >
                                        <Typography
                                          sx={{
                                            color: 'white',
                                            fontWeight: 800,
                                            fontSize: { xs: '0.75rem', md: '0.9rem' },
                                            fontFamily: 'Outfit',
                                          }}
                                        >
                                          {t}
                                        </Typography>
                                      </Box>
                                    </Grid>
                                  ))}
                                </Grid>
                              </motion.div>
                            )}
                          </Box>

                          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <Button
                              variant="contained"
                              fullWidth={fullScreen}
                              href={selectedProject.link !== '#' ? selectedProject.link : undefined}
                              target="_blank"
                              sx={{
                                bgcolor: 'primary.main',
                                color: 'white',
                                borderRadius: '14px',
                                px: { xs: 3, md: 6 },
                                py: { xs: 1.5, md: 2 },
                                textTransform: 'none',
                                fontWeight: 900,
                                fontSize: '0.9rem',
                                boxShadow: '0 10px 30px rgba(225,29,72,0.3)',
                                '&:hover': { bgcolor: '#c41940', transform: 'translateY(-2px)' },
                              }}
                            >
                              {profile.customData?.projectsLiveLabel || 'Live Interface'}
                            </Button>
                            {selectedProject.github && selectedProject.github !== '#' && (
                              <Button
                                component="a"
                                fullWidth={fullScreen}
                                href={selectedProject.github}
                                target="_blank"
                                startIcon={<Github size={20} />}
                                sx={{
                                  border: '1px solid rgba(255,255,255,0.1)',
                                  color: 'white',
                                  borderRadius: '14px',
                                  px: 4,
                                  py: { xs: 1.5, md: 2 },
                                  textTransform: 'none',
                                  fontWeight: 800,
                                  '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.05)',
                                    borderColor: 'primary.main',
                                  },
                                }}
                              >
                                {profile.customData?.projectsSourceLabel || 'Source'}
                              </Button>
                            )}
                          </Stack>
                        </Stack>
                      </motion.div>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Dialog>
    </Box>
  );
});

export default Projects;
