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
  Dialog,
  DialogContent,
  IconButton,
  Popover,
  alpha,
} from '@mui/material';
import { Mail, MapPin, Globe, Clock, User, MessageSquare, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitContactMessage, fetchMessageLogs } from '../services/api';
import socket from '../services/socket';


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

  const [anchorEl, setAnchorEl] = useState(null);
  const [activeMsg, setActiveMsg] = useState(null);

  const handlePopoverOpen = (event, msg) => {
    setAnchorEl(event.currentTarget);
    setActiveMsg(msg);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setActiveMsg(null);
  };

  const openPopover = Boolean(anchorEl);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [allMessages, setAllMessages] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  React.useEffect(() => {
    loadMessages();

    // Socket.io for real-time updates
    socket.on('newInquiry', (newMsg) => {
      setAllMessages((prev) => [newMsg, ...prev]);
    });

    return () => {
      socket.off('newInquiry');
    };
  }, []);

  const loadMessages = async () => {
    try {
      const logs = await fetchMessageLogs();
      if (logs && Array.isArray(logs)) {
        setAllMessages(logs);
      } else if (logs?.payload) {
        setAllMessages(logs.payload);
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
              {allMessages.length > 0 ? (
                allMessages.slice(0, 5).map((msg, idx) => (
                  <motion.div
                    key={msg._id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Box
                      className="glass-card"
                      sx={{
                        p: { xs: 3, md: 4 },
                        borderLeft: '4px solid',
                        borderColor: 'primary.main',
                        transition: '0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.03)',
                          transform: 'translateX(8px)',
                          borderColor: 'white',
                        },
                      }}
                    >
                      <Grid container spacing={3} alignItems="center">
                        {/* User Identity */}
                        <Grid item xs={12} md={3}>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Box
                              sx={{
                                width: 44,
                                height: 44,
                                borderRadius: '12px',
                                bgcolor: 'rgba(225, 29, 72, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'primary.main',
                                flexShrink: 0,
                              }}
                            >
                              <User size={20} />
                            </Box>
                            <Box sx={{ minWidth: 0 }}>
                              <Typography
                                sx={{
                                  color: 'white',
                                  fontWeight: 800,
                                  fontSize: '0.95rem',
                                  fontFamily: 'Outfit',
                                  noWrap: true,
                                }}
                              >
                                {msg.name}
                              </Typography>
                              <Typography
                                sx={{
                                  color: 'primary.main',
                                  fontSize: '0.65rem',
                                  fontWeight: 900,
                                  letterSpacing: 1,
                                  textTransform: 'uppercase',
                                }}
                              >
                                {msg.profession || 'Inquirer'}
                              </Typography>
                            </Box>
                          </Stack>
                        </Grid>

                        {/* Subject & Message Preview */}
                        <Grid item xs={12} md={6}>
                          <Stack spacing={1}>
                            <Typography
                              sx={{
                                color: 'white',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                              }}
                            >
                              <MessageSquare size={14} style={{ opacity: 0.5 }} />
                              {msg.subject || 'No Subject'}
                            </Typography>
                            <Typography
                              sx={{
                                color: '#94a3b8',
                                fontSize: '0.85rem',
                                lineHeight: 1.6,
                                display: '-webkit-box',
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                cursor: 'pointer',
                              }}
                              onClick={(e) => handlePopoverOpen(e, msg)}
                            >
                              {msg.message}
                            </Typography>
                          </Stack>
                        </Grid>

                        {/* Metadata & Actions */}
                        <Grid item xs={12} md={3}>
                          <Stack
                            direction="row"
                            justifyContent={{ xs: 'flex-start', md: 'flex-end' }}
                            alignItems="center"
                            spacing={3}
                          >
                            <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                              <Typography
                                sx={{
                                  color: 'white',
                                  fontSize: '0.75rem',
                                  fontWeight: 800,
                                  fontFamily: 'monospace',
                                }}
                              >
                                {new Date(msg.createdAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </Typography>
                              <Typography
                                sx={{ color: '#475569', fontSize: '0.65rem', fontWeight: 700 }}
                              >
                                {new Date(msg.createdAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                            <IconButton
                              onClick={(e) => handlePopoverOpen(e, msg)}
                              sx={{
                                color: 'primary.main',
                                bgcolor: 'rgba(225, 29, 72, 0.05)',
                                '&:hover': { bgcolor: 'primary.main', color: 'white' },
                              }}
                            >
                              <ChevronRight size={20} />
                            </IconButton>
                          </Stack>
                        </Grid>
                      </Grid>
                    </Box>
                  </motion.div>
                ))
              ) : (
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 10,
                    borderRadius: 4,
                    border: '1px dashed rgba(255,255,255,0.1)',
                  }}
                >
                  <Typography sx={{ color: '#475569', fontWeight: 600 }}>
                    Initializing data stream...
                  </Typography>
                </Box>
              )}
            </AnimatePresence>

            {allMessages.length > 5 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Button
                  onClick={() => setShowAll(true)}
                  variant="outlined"
                  endIcon={<ChevronRight size={18} />}
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.1)',
                    px: 4,
                    py: 1.5,
                    borderRadius: '100px',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    letterSpacing: 1,
                    transition: '0.3s',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: 'rgba(225, 29, 72, 0.05)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  VIEW ALL INQUIRIES
                </Button>
              </Box>
            )}
          </Box>
        </motion.div>
      </Box>

      {/* All Inquiries Dialog */}
      <Dialog
        open={showAll}
        onClose={() => setShowAll(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#0f172a',
            backgroundImage: 'none',
            borderRadius: 4,
            border: '1px solid rgba(255,255,255,0.05)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            "&::-webkit-scrollbar": {
                width: "5px",
                height: "5px",
            },
            "&::-webkit-scrollbar-track": {
                background: 'transparent',
            },
            "&::-webkit-scrollbar-thumb": {
                backgroundColor: alpha("#6366F1", 0.28),
                borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: alpha("#6366F1", 0.5),
            },
          },
        }}
      >
        <Box sx={{ p: 4, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 900, letterSpacing: -1 }}>
                ALL INQUIRIES <Box component="span" sx={{ color: 'primary.main', ml: 1 }}>({allMessages.length})</Box>
              </Typography>
              <Typography sx={{ color: 'slate.500', fontSize: '0.8rem', mt: 0.5 }}>
                Manage and review your latest messages
              </Typography>
            </Box>
            <IconButton onClick={() => setShowAll(false)} sx={{ color: 'slate.500', '&:hover': { color: 'white' } }}>
              <X size={24} />
            </IconButton>
          </Box>
          
          <TextField
            fullWidth
            size="small"
            placeholder="Search by name, email, or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                bgcolor: 'rgba(255,255,255,0.02)',
                borderRadius: 2,
                '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
              },
            }}
          />
        </Box>
        <DialogContent sx={{ 
          p: 4, 
          bgcolor: 'rgba(0,0,0,0.2)',
          "&::-webkit-scrollbar": {
              width: "5px",
              height: "5px",
          },
          "&::-webkit-scrollbar-track": {
              background: 'transparent',
          },
          "&::-webkit-scrollbar-thumb": {
              backgroundColor: alpha("#6366F1", 0.28),
              borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: alpha("#6366F1", 0.5),
          },
        }}>
          <Stack spacing={2}>
            {allMessages
              .filter(msg => 
                msg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                msg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                msg.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                msg.message?.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((msg, idx) => (
              <Box
                key={msg._id || idx}
                sx={{
                  p: 3,
                  bgcolor: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: 3,
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' },
                  gap: 3,
                }}
              >
                <Box>
                  <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '0.95rem' }}>{msg.name}</Typography>
                  <Typography sx={{ color: 'primary.main', fontWeight: 800, fontSize: '0.7rem', textTransform: 'uppercase' }}>{msg.profession}</Typography>
                  <Typography sx={{ color: 'slate.500', fontSize: '0.8rem', mt: 1 }}>{msg.email}</Typography>
                  <Typography sx={{ color: 'slate.600', fontSize: '0.7rem', mt: 2 }}>
                    {new Date(msg.createdAt).toLocaleString()}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ color: 'white', fontWeight: 600, fontSize: '0.9rem', mb: 1 }}>{msg.subject}</Typography>
                  <Typography sx={{ color: 'slate.400', fontSize: '0.85rem', lineHeight: 1.6 }}>{msg.message}</Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        </DialogContent>
      </Dialog>

      <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)}>
        <Alert severity={status.type || 'info'} sx={{ borderRadius: 2 }}>
          {status.message}
        </Alert>
      </Snackbar>

      {/* Individual Message Popover */}
      <Popover
        open={openPopover}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            p: 3,
            maxWidth: 400,
            bgcolor: '#1e293b',
            color: 'white',
            borderRadius: 3,
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        {activeMsg && (
          <Box>
            <Typography sx={{ fontWeight: 800, color: 'primary.main', fontSize: '0.7rem', mb: 1, textTransform: 'uppercase' }}>
              Subject: {activeMsg.subject}
            </Typography>
            <Typography sx={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'slate.300' }}>
              {activeMsg.message}
            </Typography>
          </Box>
        )}
      </Popover>
    </Container>
  );
};

export default Contact;
