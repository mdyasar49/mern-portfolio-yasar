/**
 * Resume page.
 */

import React, { useState, useEffect } from 'react';
// Material UI components for the UI shell and interactive elements
import { Box, Button, Stack, Typography, Container, Divider, Modal, Fade } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
// Framer Motion for high-fidelity 3D interactions and entrance animations
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
// Icons for technical and action cues
import { Download, ShieldCheck, Send, Link as LinkIcon } from 'lucide-react';
import SEO from '../components/SEO';

const Resume = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  // Optimization: Disable heavy 3D calculations on mobile or if the user prefers reduced motion
  const disableHeavyMotion = isMobile || prefersReducedMotion;

  const [isDispatching, setIsDispatching] = useState(false);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [copyConfirmed, setCopyConfirmed] = useState(false);

  const iframeSrc = '/resume-pro/index.html';

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 100, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 100, damping: 30 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['10deg', '-10deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-10deg', '10deg']);

  const handleMouseMove = (e) => {
    if (disableHeavyMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('system_dispatch') === 'true') {
      // Delay then trigger blob-based download
      setTimeout(() => handleDownload(), 2500);
    }
  }, []);

  /**
   * handleDownload
   * Blob-based download pattern (adapted from useFileApi → onPresignedUrlDownload):
   * 1. Show dispatch overlay
   * 2. Get PDF blob from the iframe's getPDFBlob()
   * 3. Create an object URL → anchor → click → revoke
   * Filename is set on the <a> element so the browser saves it correctly.
   */
  const handleDownload = async () => {
    const FILENAME = 'A. Mohamed Yasar - Resume.pdf';
    setIsDispatching(true);
    try {
      const frame = document.getElementById('resume-frame');
      let blob = null;

      if (frame && frame.contentWindow.getPDFBlob) {
        blob = await frame.contentWindow.getPDFBlob();
      }

      if (blob) {
        // ✅ Proper blob URL download — filename is set on the anchor
        const fileUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = fileUrl;
        a.download = FILENAME;
        a.click();
        window.URL.revokeObjectURL(fileUrl); // cleanup memory
      } else {
        // Fallback: ask iframe to do the download internally
        if (frame && frame.contentWindow.downloadAsPDF) {
          frame.contentWindow.downloadAsPDF();
        }
      }
    } catch {
      // Silent fail — iframe may handle it
      const frame = document.getElementById('resume-frame');
      if (frame && frame.contentWindow.downloadAsPDF) {
        frame.contentWindow.downloadAsPDF();
      }
    } finally {
      setIsDispatching(false);
    }
  };

  const executeEmailDispatch = () => {
    setIsSelectorOpen(false);
    const resumeUrl = `${window.location.origin}/resume`;
    const subject = encodeURIComponent('Technical Resume Dispatch | Mohamed Yasar');
    const body = encodeURIComponent(
      `Hello,\n\nPlease find my resume at the link below:\n\n${resumeUrl}\n\nBest regards.`,
    );
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&tf=1&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank');
  };


  const executeAssetExtraction = async (type = 'file') => {
    setIsSelectorOpen(false);

    if (type === 'file') {
      // Blob-based download — shows overlay, sets correct filename on the anchor
      await handleDownload();
      return;
    }

    // type === 'link' — Copy resume URL to clipboard
    const shareUrl = window.location.origin + '/resume';
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyConfirmed(true);
      setTimeout(() => setCopyConfirmed(false), 2500);
    } catch {
      window.prompt('Copy this link:', shareUrl);
    }
  };

  return (
    <Box
      onMouseMove={handleMouseMove}
      sx={{
        minHeight: '100vh',
        bgcolor: '#050507',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        perspective: '2000px',
        pt: { xs: 15, md: 8 },
        pb: 10,
      }}
    >
      <SEO
        title="Resume | Mohamed Yasar"
        description="View and download the professional technical resume of Mohamed Yasar, MERN Stack Developer."
      />

      <AnimatePresence>
        {isDispatching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 5000,
              backgroundColor: 'rgba(5,5,7,0.95)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(30px)',
            }}
          >
            <Stack spacing={4} alignItems="center">
              <Box sx={{ width: 80, height: 80, position: 'relative' }}>
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    border: '2px solid rgba(99,102,241,0.1)',
                    borderTop: '2px solid #e11d48',
                    animation: 'spin 1s linear infinite',
                  }}
                />
                <ShieldCheck
                  size={32}
                  color="#e11d48"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  sx={{
                    color: 'white',
                    fontWeight: 900,
                    letterSpacing: 4,
                    mb: 1,
                    fontSize: '0.8rem',
                  }}
                >
                  PREPARING DOCUMENT
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', fontFamily: 'monospace' }}>
                  PORTFOLIO v1.0
                </Typography>
              </Box>
            </Stack>
          </motion.div>
        )}
      </AnimatePresence>

      <Modal open={isSelectorOpen} onClose={() => setIsSelectorOpen(false)} closeAfterTransition>
        <Fade in={isSelectorOpen}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90%', sm: 380 },
              bgcolor: '#0f172a',
              borderRadius: '24px',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 50px 100px rgba(0,0,0,0.8)',
              p: 4,
              outline: 'none',
            }}
          >
            <Stack spacing={4}>
              <Box>
                <Typography
                  sx={{
                    fontWeight: 900,
                    fontSize: '0.65rem',
                    color: 'primary.main',
                    letterSpacing: 4,
                    mb: 1,
                  }}
                >
                  DOWNLOAD OPTIONS
                </Typography>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />
              </Box>

              <Stack spacing={2}>
                    <Button
                      fullWidth
                      onClick={handleDownload}
                      sx={{
                        py: 2,
                        px: 3,
                        bgcolor: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '16px',
                        color: 'white',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.05)',
                          borderColor: 'rgba(255,255,255,0.2)',
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                        }}
                      >
                        <Download size={18} color="#e11d48" /> Download PDF Resume
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b', ml: 4 }}>
                        Save the professional technical document
                      </Typography>
                    </Button>

                    <Button
                      fullWidth
                      onClick={() => executeAssetExtraction('link')}
                      sx={{
                        py: 2,
                        px: 3,
                        bgcolor: copyConfirmed ? 'rgba(51,204,51,0.08)' : 'rgba(255,255,255,0.02)',
                        border: copyConfirmed ? '1px solid rgba(51,204,51,0.4)' : '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '16px',
                        color: 'white',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        transition: 'all 0.3s ease',
                        '&:hover': { bgcolor: 'rgba(51, 204, 255, 0.05)', borderColor: '#33ccff' },
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                        }}
                      >
                        <LinkIcon size={18} color={copyConfirmed ? '#33cc33' : '#33ccff'} />
                        {copyConfirmed ? '✓ Link Copied!' : 'Copy Share Link'}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b', ml: 4 }}>
                        {copyConfirmed ? 'Resume URL copied to clipboard' : 'Copy resume link to clipboard'}
                      </Typography>
                    </Button>

                    <Button
                      fullWidth
                      onClick={executeEmailDispatch}
                      sx={{
                        py: 2,
                        px: 3,
                        bgcolor: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '16px',
                        color: 'white',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        '&:hover': { bgcolor: 'rgba(99,102,241,0.1)', borderColor: 'primary.main' },
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                        }}
                      >
                        <Send size={18} color="#6366f1" /> Send via Email
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b', ml: 4 }}>
                        Direct dispatch to your inbox
                      </Typography>
                    </Button>
              </Stack>
            </Stack>
          </Box>
        </Fade>
      </Modal>

      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography
            sx={{
              color: 'primary.main',
              fontWeight: 900,
              fontSize: '0.65rem',
              letterSpacing: 5,
              mb: 1.5,
            }}
          >
            RESUME PORTAL
          </Typography>
          <Typography
            variant="h2"
            sx={{
              color: 'white',
              fontWeight: 900,
              fontSize: { xs: '2.5rem', md: '4rem' },
              fontFamily: 'Outfit',
              letterSpacing: -1,
            }}
          >
            Professional Resume.
          </Typography>
        </Box>

        <motion.div
          style={{
            rotateX: disableHeavyMotion ? '0deg' : rotateX,
            rotateY: disableHeavyMotion ? '0deg' : rotateY,
            zIndex: 10,
            transformStyle: 'preserve-3d',
            position: 'relative',
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Document Framing Brackets */}
          {!isMobile && (
            <>
              <Box
                sx={{
                  position: 'absolute',
                  top: -40,
                  left: -40,
                  width: 60,
                  height: 60,
                  borderTop: '2px solid #e11d48',
                  borderLeft: '2px solid #e11d48',
                  opacity: 0.3,
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -40,
                  right: -40,
                  width: 60,
                  height: 60,
                  borderBottom: '2px solid #e11d48',
                  borderRight: '2px solid #e11d48',
                  opacity: 0.3,
                }}
              />
            </>
          )}

          <Box
            sx={{
              width: { xs: '90vw', sm: '80vw', md: '210mm' },
              height: { xs: '127vw', sm: '113vh', md: '297mm' },
              backgroundColor: 'white',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '8px',
              boxShadow: '0 50px 100px rgba(0,0,0,0.8)',
            }}
          >
            <iframe
              id="resume-frame"
              src={iframeSrc}
              title="Resume Preview"
              width="100%"
              height="100%"
              style={{ border: 'none' }}
            />
          </Box>
        </motion.div>

        {/* Action Button */}
        <Box sx={{ mt: 8 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => setIsSelectorOpen(true)}
            startIcon={<Download size={20} />}
            sx={{
              px: 8,
              py: 2.5,
              borderRadius: '100px',
              bgcolor: 'white',
              color: 'black',
              fontWeight: 900,
              fontSize: '0.9rem',
              '&:hover': { bgcolor: '#e11d48', color: 'white' },
            }}
          >
            Download Resume
          </Button>
        </Box>
      </Container>

      <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          iframe::-webkit-scrollbar { width: 6px; }
          iframe::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
      `}</style>
    </Box>
  );
};

export default Resume;
