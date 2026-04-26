/**
 * Footer component.
 */

import React, { useState, useEffect, memo } from 'react';
import { Box, Typography, Container, IconButton, Stack, Grid, Divider } from '@mui/material';
import {
  Linkedin,
  Github,
  Twitter,
  Mail,
  Instagram,
  Facebook,
  ArrowUp,
  Users,
  MapPin,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchSystemAnalytics } from '../services/api';

const Footer = memo(({ profile }) => {
  const socials = profile?.socials;
  const name = profile?.name;
  const config = profile?.footerConfig || {};
  const [visitorCount, setVisitorCount] = useState(0);
  const [systemLoad, setSystemLoad] = useState(12);
  const [latency, setLatency] = useState(24);
  const [sessionTime, setSessionTime] = useState('00:00:00');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const sessionStart = React.useRef(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemLoad((prev) => {
        const change = (Math.random() - 0.5) * 2;
        return Math.max(5, Math.min(45, prev + change));
      });
      setLatency(Math.floor(Math.random() * (45 - 15) + 15));
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    const sessionInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - sessionStart.current) / 1000);
      const h = String(Math.floor(elapsed / 3600)).padStart(2, '0');
      const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
      const s = String(elapsed % 60).padStart(2, '0');
      setSessionTime(`${h}:${m}:${s}`);
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(sessionInterval);
    };
  }, []);

  useEffect(() => {
    const fetchVisitorsData = async () => {
      const hasIncremented = sessionStorage.getItem('v_inc');
      const data = await fetchSystemAnalytics(!hasIncremented);
      if (data?.success) {
        setVisitorCount(data.count);
        if (!hasIncremented) sessionStorage.setItem('v_inc', 'true');
      }
    };
    fetchVisitorsData();
  }, []);

  if (!socials || !name) return null;

  const socialLinks = [
    { icon: <Linkedin size={20} />, link: socials.linkedin, label: 'LinkedIn' },
    { icon: <Github size={20} />, link: socials.github, label: 'GitHub' },
    { icon: <Twitter size={20} />, link: socials.twitter, label: 'Twitter' },
    { icon: <Mail size={20} />, link: `mailto:${profile.email}`, label: 'Email' },
    { icon: <Instagram size={20} />, link: socials.instagram, label: 'Instagram' },
    { icon: <Facebook size={20} />, link: socials.facebook, label: 'Facebook' },
  ];

  const navLinks = ['About', 'Skills', 'Projects', 'Resume', 'Contact'];

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#050507',
        pt: { xs: 15, md: 20 },
        pb: 8,
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      {/* Large watermark name */}
      <Box
        sx={{
          position: 'absolute',
          bottom: -60,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          textAlign: 'center',
          userSelect: 'none',
          pointerEvents: 'none',
          opacity: 0.025,
          whiteSpace: 'nowrap',
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: '20vw', md: '18vw' },
            fontWeight: 900,
            fontFamily: 'Outfit',
            letterSpacing: -16,
            color: 'white',
          }}
        >
          {name.toUpperCase()}
        </Typography>
      </Box>

      <Container maxWidth="xl">
        {/* ── Top Row: Brand + Nav ── */}
        <Grid container spacing={6} sx={{ mb: 10 }}>
          {/* Brand column */}
          <Grid item xs={12} md={5}>
            <Stack spacing={4}>
              <Box>
                <Box
                  component="img"
                  src="/logo.png"
                  alt="Logo"
                  sx={{ height: 100, width: '120px', filter: 'brightness(2)', display: 'block' }}
                />
                <Typography
                  sx={{ color: 'white', fontWeight: 900, fontSize: '1.2rem', fontFamily: 'Outfit' }}
                >
                  {name}
                </Typography>
                <Typography
                  sx={{
                    color: 'primary.main',
                    fontWeight: 800,
                    fontSize: '0.7rem',
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                  }}
                >
                  {profile.title}
                </Typography>
              </Box>
              <Typography
                sx={{
                  color: '#475569',
                  fontSize: '1rem',
                  lineHeight: 1.9,
                  maxWidth: 380,
                }}
              >
                "
                {config.tagline ||
                  'Crafting next-generation digital experiences with precision and purpose.'}
                "
              </Typography>

              {/* Social icons */}
              <Stack direction="row" spacing={1.5} flexWrap="wrap">
                {socialLinks.map((item, i) => (
                  <IconButton
                    key={i}
                    href={item.link || '#'}
                    target="_blank"
                    title={item.label}
                    sx={{
                      width: 40,
                      height: 40,
                      color: '#334155',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: '10px',
                      transition: '0.35s cubic-bezier(0.23, 1, 0.32, 1)',
                      '&:hover': {
                        color: 'white',
                        borderColor: 'rgba(225,29,72,0.5)',
                        bgcolor: 'rgba(225,29,72,0.08)',
                        transform: 'translateY(-4px)',
                      },
                    }}
                  >
                    {item.icon}
                  </IconButton>
                ))}
              </Stack>
            </Stack>
          </Grid>

          {/* Spacer */}
          <Grid item xs={12} md={1} />

          {/* Navigation */}
          <Grid item xs={6} md={3}>
            <Typography
              sx={{
                color: '#1e293b',
                fontWeight: 800,
                fontSize: '0.65rem',
                letterSpacing: 3,
                mb: 3,
                textTransform: 'uppercase',
              }}
            >
              {profile.customData?.navLabel || 'Navigation'}
            </Typography>
            <Stack spacing={2}>
              {navLinks.map((link) => (
                <Box
                  key={link}
                  component="a"
                  href={`#${link.toLowerCase()}`}
                  sx={{
                    color: '#475569',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    transition: '0.25s',
                    width: 'fit-content',
                    '&:hover': { color: 'white', pl: 0.5 },
                  }}
                >
                  {link}
                </Box>
              ))}
            </Stack>
          </Grid>

          {/* Stats */}
          <Grid item xs={6} md={3}>
            <Typography
              sx={{
                color: '#1e293b',
                fontWeight: 800,
                fontSize: '0.65rem',
                letterSpacing: 3,
                mb: 3,
                textTransform: 'uppercase',
              }}
            >
              {profile.customData?.statsLabel || 'System Stats'}
            </Typography>
            <Stack spacing={3}>
              <Stack spacing={0.5}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Users size={14} color="#e11d48" />
                  <Typography
                    sx={{
                      color: '#e11d48',
                      fontWeight: 900,
                      fontSize: '1.3rem',
                      fontFamily: 'Outfit',
                    }}
                  >
                    {visitorCount.toLocaleString()}
                  </Typography>
                </Stack>
                <Typography
                  sx={{ color: '#334155', fontSize: '0.65rem', fontWeight: 700, letterSpacing: 1 }}
                >
                  {profile.customData?.visitorsLabel || 'TOTAL VISITORS'}
                </Typography>
              </Stack>
              <Stack spacing={0.5}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <MapPin size={14} color="#94a3b8" />
                  <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '0.95rem' }}>
                    {profile.location || config.origin || 'Remote / Chennai, India'}
                  </Typography>
                </Stack>
                <Typography
                  sx={{ color: '#334155', fontSize: '0.65rem', fontWeight: 700, letterSpacing: 1 }}
                >
                  LOCATION
                </Typography>
              </Stack>

              <Stack spacing={0.5}>
                <Typography
                  sx={{
                    color: 'white',
                    fontWeight: 800,
                    fontSize: '1rem',
                    fontFamily: 'monospace',
                  }}
                >
                  {currentTime}
                </Typography>
                <Typography
                  sx={{ color: '#334155', fontSize: '0.65rem', fontWeight: 700, letterSpacing: 1 }}
                >
                  LOCAL TIME
                </Typography>
              </Stack>

              <Stack spacing={1}>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography
                    sx={{
                      color: '#475569',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      letterSpacing: 1,
                    }}
                  >
                    PERFORMANCE
                  </Typography>
                  <Typography
                    sx={{
                      color: '#e11d48',
                      fontSize: '0.7rem',
                      fontWeight: 900,
                      fontFamily: 'monospace',
                    }}
                  >
                    {systemLoad.toFixed(1)}%
                  </Typography>
                </Stack>
                <Box
                  sx={{
                    width: '100%',
                    height: 2,
                    bgcolor: 'rgba(255,255,255,0.03)',
                    borderRadius: 1,
                  }}
                >
                  <motion.div
                    animate={{ width: `${systemLoad}%` }}
                    transition={{ duration: 1 }}
                    style={{ height: '100%', background: '#e11d48', borderRadius: 4 }}
                  />
                </Box>
              </Stack>

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ pt: 1 }}
              >
                <Box>
                  <Typography
                    sx={{ color: '#334155', fontSize: '0.6rem', fontWeight: 800, letterSpacing: 1 }}
                  >
                    LATENCY
                  </Typography>
                  <Typography
                    sx={{
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      fontFamily: 'monospace',
                    }}
                  >
                    {latency}MS
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography
                    sx={{ color: '#334155', fontSize: '0.6rem', fontWeight: 800, letterSpacing: 1 }}
                  >
                    SESSION
                  </Typography>
                  <Typography
                    sx={{
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      fontFamily: 'monospace',
                    }}
                  >
                    {sessionTime}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Grid>
        </Grid>

        {/* ── Bottom Bar ── */}
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.04)', mb: 4 }} />
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          spacing={3}
        >
          <Typography sx={{ color: '#1e293b', fontSize: '0.75rem', fontWeight: 600 }}>
            {profile.customData?.copyrightText ||
              `© ${new Date().getFullYear()} ${name}. All rights reserved.`}
          </Typography>

          <Typography
            sx={{
              color: '#1e293b',
              fontSize: '0.65rem',
              fontWeight: 700,
              fontFamily: 'monospace',
              letterSpacing: 1,
            }}
          >
            PORTFOLIO &nbsp;·&nbsp; MERN STACK
          </Typography>

          {/* Scroll to top */}
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <IconButton
              onClick={scrollToTop}
              sx={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                bgcolor: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                color: '#475569',
                transition: '0.3s',
                '&:hover': {
                  bgcolor: 'rgba(225,29,72,0.15)',
                  borderColor: 'rgba(225,29,72,0.4)',
                  color: '#e11d48',
                },
              }}
            >
              <ArrowUp size={20} />
            </IconButton>
          </motion.div>
        </Stack>
      </Container>
    </Box>
  );
});

export default Footer;
