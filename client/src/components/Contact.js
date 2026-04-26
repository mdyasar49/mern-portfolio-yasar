/**
 * Contact section.
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Container,
  Grid,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import { Mail, MapPin, Globe, Clock, User, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitContactMessage, fetchMessageLogs } from '../services/api';
import { io } from 'socket.io-client';
import { API_BASE_URL } from '../config';

const Contact = ({ profile }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profession: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [open, setOpen] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [messages, setMessages] = useState([]);

  React.useEffect(() => {
    loadMessages();

    // Socket.io for real-time updates
    const socket = io(API_BASE_URL);
    socket.on('newInquiry', (newMsg) => {
      setMessages((prev) => [newMsg, ...prev].slice(0, 5));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const loadMessages = async () => {
    try {
      const logs = await fetchMessageLogs();
      if (logs && Array.isArray(logs)) {
        setMessages(logs.slice(0, 5)); // Show last 5
      } else if (logs?.payload) {
        setMessages(logs.payload.slice(0, 5));
      }
    } catch (err) {
      console.error('Failed to load message history');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic Client-Side Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatus({ type: 'error', message: 'Please enter a valid email address.' });
      setOpen(true);
      return;
    }

    setLoading(true);
    try {
      const result = await submitContactMessage(formData);
      setLoading(false);
      if (result.success) {
        setStatus({ type: 'success', message: 'Message received. I will reach out soon.' });
        setFormData({ name: '', email: '', profession: '', subject: '', message: '' });
        loadMessages(); // Refresh the list
      } else {
        setStatus({ type: 'error', message: result.message || 'Message failed to send.' });
      }
    } catch (err) {
      setLoading(false);
      setStatus({ type: 'error', message: 'Unable to connect to server. Please try again later.' });
    }
    setOpen(true);
  };

  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      color: 'white',
      '& fieldset': {
        borderColor: 'rgba(255,255,255,0.08)',
        borderRadius: 2,
        transition: '0.3s',
      },
      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
      '&.Mui-focused fieldset': { borderColor: '#e11d48' },
      backgroundColor: 'rgba(255,255,255,0.01)',
    },
    '& .MuiInputLabel-root': { color: '#64748b' },
    '& .MuiInputLabel-root.Mui-focused': { color: 'white' },
    mb: 3,
  };

  return (
    <Container maxWidth="xl" id="contact" sx={{ py: { xs: 15, md: 25 } }}>
      <Grid container spacing={10}>
        {/* Left: Content */}
        <Grid item xs={12} lg={5}>
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
              }}
            >
              {profile?.customData?.contactOverline || 'CONTACT ME'}
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                fontSize: { xs: '3rem', md: '5rem' },
                lineHeight: 1,
                mb: 6,
                letterSpacing: -2,
                color: 'white',
              }}
            >
              {profile?.customData?.contactHeadline || "Let's build something great."}
            </Typography>

            <Stack spacing={4}>
              {[
                {
                  icon: <Mail size={24} />,
                  label: 'Email',
                  val: profile?.email,
                  link: `mailto:${profile?.email}`,
                },
                { icon: <MapPin size={24} />, label: 'Location', val: profile?.location },
                {
                  icon: <Globe size={24} />,
                  label: 'Availability',
                  val: profile?.additionalInfo?.workPreference || 'Remote / Worldwide',
                },
              ].map((item, i) => (
                <Box
                  key={i}
                  component={item.link ? 'a' : 'div'}
                  href={item.link}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: '0.3s',
                    '&:hover': item.link
                      ? { transform: 'translateX(10px)', color: 'primary.main' }
                      : {},
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: '16px',
                      bgcolor: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      color: 'primary.main',
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        color: '#64748b',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                      }}
                    >
                      {item.label}
                    </Typography>
                    <Typography sx={{ color: 'white', fontWeight: 600, fontSize: '1.1rem' }}>
                      {item.val}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </motion.div>
        </Grid>

        {/* Right: Form */}
        <Grid item xs={12} lg={7}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <Box
              component="form"
              onSubmit={handleSubmit}
              className="glass-card"
              sx={{ p: { xs: 4, md: 8 } }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    sx={inputStyles}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Profession"
                    name="profession"
                    value={formData.profession}
                    onChange={handleChange}
                    sx={inputStyles}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    sx={inputStyles}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    sx={inputStyles}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Message"
                    name="message"
                    multiline
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    sx={inputStyles}
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                disabled={loading}
                variant="contained"
                sx={{
                  py: 2.5,
                  mt: 4,
                  bgcolor: 'white',
                  color: 'black',
                  fontWeight: 900,
                  fontSize: '1rem',
                  borderRadius: '100px',
                  textTransform: 'none',
                  transition: '0.4s',
                  '&:hover': {
                    bgcolor: '#e11d48',
                    color: 'white',
                    boxShadow: '0 20px 40px rgba(225, 29, 72, 0.3)',
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  profile.customData?.contactActionLabel || 'Send Message'
                )}
              </Button>
            </Box>
          </motion.div>
        </Grid>
      </Grid>

      {/* Recent Messages History */}
      <Box sx={{ mt: 15 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: 'white',
              mb: 6,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              letterSpacing: -1,
            }}
          >
            <Clock size={32} className="text-primary" /> RECENT INQUIRIES
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <AnimatePresence mode="popLayout">
              {messages.length > 0 ? (
                messages.map((msg, idx) => (
                  <motion.div
                    key={msg._id || idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Box
                      className="glass-card"
                      sx={{
                        p: 4,
                        borderLeft: '4px solid',
                        borderColor: 'primary.main',
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: '1.5fr 1.5fr 3fr 1fr' },
                        gap: 3,
                        alignItems: 'center',
                        transition: '0.3s',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.03)',
                          transform: 'translateX(5px)',
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <User size={18} className="text-slate-500" />
                        <Box>
                          <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>
                            {msg.name}
                          </Typography>
                          <Typography
                            sx={{
                              color: 'primary.main',
                              fontSize: '0.7rem',
                              fontWeight: 800,
                              textTransform: 'uppercase',
                            }}
                          >
                            {msg.profession}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Mail size={18} className="text-slate-500" />
                        <Typography sx={{ color: 'slate.400', fontSize: '0.85rem' }}>
                          {msg.email}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <MessageSquare size={18} className="text-slate-500" />
                        <Box>
                          <Typography sx={{ color: 'white', fontWeight: 600, fontSize: '0.85rem' }}>
                            {msg.subject}
                          </Typography>
                          <Typography
                            sx={{
                              color: 'slate.500',
                              fontSize: '0.8rem',
                              display: '-webkit-box',
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {msg.message}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                        <Typography
                          sx={{ color: 'slate.600', fontSize: '0.75rem', fontWeight: 700 }}
                        >
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Typography>
                        <Typography sx={{ color: 'slate.700', fontSize: '0.65rem' }}>
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                  </motion.div>
                ))
              ) : (
                <Typography
                  sx={{
                    color: 'slate.500',
                    textAlign: 'center',
                    py: 10,
                    border: '1px dashed rgba(255,255,255,0.1)',
                    borderRadius: 4,
                  }}
                >
                  No recent messages found.
                </Typography>
              )}
            </AnimatePresence>
          </Box>
        </motion.div>
      </Box>

      <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)}>
        <Alert severity={status.type || 'info'} sx={{ borderRadius: 2 }}>
          {status.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Contact;
