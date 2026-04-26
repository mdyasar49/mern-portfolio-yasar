import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { Box, Typography, Button, Stack, Container } from '@mui/material';
import { motion } from 'framer-motion';
import { WifiOff, ServerCrash, SearchX, AlertOctagon, Terminal, ShieldAlert } from 'lucide-react';

// ─── Constants & Config ──────────────────────────────────────

const ERROR_CONFIG = {
  network: {
    icon: WifiOff,
    color: '#e11d48',
    title: 'OFFLINE',
    subtitle: 'Please check your internet connection and try again.',
    code: 'OFFLINE',    diagnostics: ['IP_STACK_UNREACHABLE', 'DNS_RESOLUTION_FAILURE', 'LOCAL_ADAPTER_INACTIVE'],
  },
  server: {
    icon: ServerCrash,
    color: '#818cf8',
    title: 'SERVER ERROR',
    subtitle: 'The server is not responding right now. Please try again later.',
    code: 'SERVER_ERROR',    diagnostics: ['CLUSTER_PROTOCOL_HANG', 'DB_GATEWAY_TIMEOUT', 'RESOURCE_SLEEP_DETECTION'],
  },
  notfound: {
    icon: SearchX,
    color: '#4f46e5',
    title: 'NOT FOUND',
    subtitle: "We couldn't find the page you're looking for.",
    code: 'NOT_FOUND',    diagnostics: ['NODE_ADDR_MISMATCH', 'MANIFEST_ENTRY_VOID', 'URI_DECODE_EXCEPTION'],
  },
  unknown: {
    icon: AlertOctagon,
    color: '#e11d48',
    title: 'ERROR',
    subtitle: 'Something went wrong. Please try refreshing the page.',
    code: 'UNKNOWN_ERROR',    diagnostics: ['STACK_OVERFLOW_RISK', 'KERNEL_SYNC_ERROR', 'BUFFER_FLOW_INTERRUPT'],
  },
};

const normalizeErrorType = (type) => {
  const normalized = typeof type === 'string' ? type.trim().toLowerCase() : 'unknown';
  return ERROR_CONFIG[normalized] ? normalized : 'unknown';
};

const GlitchText = ({ children, color }) => (
  <Box sx={{ position: 'relative', display: 'inline-block' }}>
    <Typography
      variant="h3"
      sx={{
        fontFamily: 'Outfit',
        fontWeight: 900,
        color: '#fff',
        letterSpacing: { xs: 4, md: 8 },
        fontSize: { xs: '1.5rem', md: '2.5rem' },
        textShadow: `0 0 40px ${color}66`,
        position: 'relative',
        zIndex: 2,
      }}
    >
      {children}
    </Typography>
  </Box>
);

// ─── Main Component ──────────────────────────────────────────

const NetworkErrorScreen = ({ errorType = 'unknown', onRetry }) => {
  const [isRetrying, setIsRetrying] = useState(false);
  const [terminalLines, setTerminalLines] = useState([]);
  const safeErrorType = normalizeErrorType(errorType);
  const config = ERROR_CONFIG[safeErrorType];
  const ErrorIcon = config.icon;
  const hasRetryHandler = typeof onRetry === 'function';

  const particles = useMemo(
    () =>
      Array.from({ length: 15 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        xDrift: Math.random() * 60 - 30,
        duration: 3 + Math.random() * 3,
        delay: Math.random() * 4,
      })),
    [],
  );

  // Simulate terminal output
  useEffect(() => {
    setTerminalLines([]);
    const lines = [
      `Checking connection...`,
      `Testing server...`,
      `Request failed.`,
      `Status: Offline`,
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < lines.length) {
        setTerminalLines((prev) => [...prev, lines[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [config.code, safeErrorType]);

  const handleRetry = useCallback(async () => {
    if (!hasRetryHandler) {
      window.location.reload();
      return;
    }
    setIsRetrying(true);
    await new Promise((r) => setTimeout(r, 1500));
    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  }, [hasRetryHandler, onRetry]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#050507',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Outfit, sans-serif',
      }}
    >
      {/* Background Animated Elements */}
      <Box sx={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        {/* Pulsing Radial Gradient */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '800px',
            height: '800px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${config.color}22 0%, transparent 70%)`,
            transform: 'translate(-50%, -50%)',
            filter: 'blur(100px)',
          }}
        />

        {/* Floating Particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            animate={{
              y: [-10, -150],
              x: particle.xDrift,
              opacity: [0, 0.4, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
            }}
            style={{
              position: 'absolute',
              bottom: '10%',
              left: particle.left,
              width: '2px',
              height: '2px',
              backgroundColor: config.color,
              borderRadius: '50%',
              boxShadow: `0 0 10px ${config.color}`,
            }}
          />
        ))}
      </Box>

      {/* Main Container */}
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Stack spacing={8} alignItems="center" textAlign="center">
          {/* Header Section */}
          <Box>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <Box sx={{ position: 'relative', mb: 6 }}>
                <Box
                  sx={{
                    width: 130,
                    height: 130,
                    borderRadius: '24px',
                    border: `1px solid rgba(255,255,255,0.05)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: `rgba(225, 29, 72, 0.02)`,
                    backdropFilter: 'blur(20px)',
                    position: 'relative',
                    mx: 'auto',
                    boxShadow: `0 30px 60px rgba(0,0,0,0.5)`,
                  }}
                >
                  <ErrorIcon size={60} color={config.color} strokeWidth={1} />
                </Box>
              </Box>
            </motion.div>

            <GlitchText color={config.color}>{config.title}</GlitchText>

            <Typography
              variant="h6"
              sx={{
                mt: 3,
                color: '#64748b',
                fontWeight: 500,
                maxWidth: 550,
                mx: 'auto',
                fontSize: '1.1rem',
                lineHeight: 1.6,
                fontFamily: 'Outfit',
              }}
            >
              {config.subtitle}
            </Typography>
          </Box>

          {/* Diagnostics Panel */}
          <Box
            sx={{
              width: '100%',
              maxWidth: 500,
              p: 4,
              bgcolor: 'rgba(255, 255, 255, 0.01)',
              backdropFilter: 'blur(40px)',
              border: '1px solid rgba(255,255,255,0.04)',
              borderRadius: '24px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
                pb: 2,
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Terminal size={14} color="#e11d48" />
                <Typography
                  sx={{
                    fontSize: '0.65rem',
                    fontWeight: 900,
                    letterSpacing: 3,
                    color: '#e11d48',
                    textTransform: 'uppercase',
                  }}
                >
                  STATUS LOG
                </Typography>
              </Stack>
            </Box>

            <Stack spacing={1.5} textAlign="left">
              {terminalLines.map((line, idx) => (
                <Typography
                  key={idx}
                  sx={{
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    color: idx === terminalLines.length - 1 ? '#e11d48' : '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    fontWeight: 600,
                  }}
                >
                  <span style={{ opacity: 0.3 }}>&gt;</span> {line}
                </Typography>
              ))}
            </Stack>

            {/* Error Code Tag */}
            <Box
              sx={{
                mt: 4,
                p: '6px 16px',
                bgcolor: `rgba(225, 29, 72, 0.05)`,
                border: `1px solid rgba(225, 29, 72, 0.1)`,
                borderRadius: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <ShieldAlert size={12} color="#e11d48" />
              <Typography
                sx={{ fontSize: '0.65rem', fontWeight: 900, color: '#e11d48', letterSpacing: 2 }}
              >
                {config.code}
              </Typography>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4}>
            <Button
              variant="contained"
              onClick={handleRetry}
              disabled={isRetrying}
              sx={{
                bgcolor: 'white',
                color: 'black',
                px: 8,
                py: 2,
                borderRadius: '100px',
                fontFamily: 'Outfit',
                fontSize: '0.9rem',
                fontWeight: 900,
                letterSpacing: 1,
                boxShadow: `0 20px 40px rgba(0,0,0,0.4)`,
                textTransform: 'uppercase',
                transition: '0.4s',
                '&:hover': {
                  bgcolor: '#e11d48',
                  color: 'white',
                  transform: 'translateY(-5px)',
                  boxShadow: `0 20px 40px rgba(225, 29, 72, 0.3)`,
                },
              }}
            >
              {isRetrying ? 'RETRYING...' : 'TRY AGAIN'}
            </Button>

            <Button
              variant="outlined"
              onClick={() => (window.location.href = '/')}
              sx={{
                borderColor: 'rgba(255,255,255,0.1)',
                color: 'white',
                px: 6,
                py: 2,
                borderRadius: '100px',
                fontFamily: 'Outfit',
                fontSize: '0.9rem',
                fontWeight: 900,
                letterSpacing: 1,
                textTransform: 'uppercase',
                transition: '0.3s',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.05)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              RETURN HOME
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default memo(NetworkErrorScreen);
