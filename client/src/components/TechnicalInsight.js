/**
 * Technical growth metrics.
 */

import React, { useState, memo } from 'react';
import { Box, Container, Typography, Grid, Stack } from '@mui/material';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Zap } from 'lucide-react';

const TechnicalInsight = memo(({ profile }) => {
  const [mounted, setMounted] = React.useState(false);
  const performanceData = profile?.performanceData || [];
  const skillDistribution = profile?.skillDistribution || [];
  const systemStats = profile?.systemStats || [];

  const [activeLog, setActiveLog] = useState(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleChartHover = (data) => {
    if (data && data.activePayload) {
      setActiveLog(`${data.activeLabel}: ${data.activePayload[0].value}%`);
    }
  };

  if (!mounted) return null;

  return (
    <Box id="insights" sx={{ py: { xs: 15, md: 25 }, position: 'relative' }}>
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
            TECHNICAL METRICS
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              fontSize: { xs: '2.5rem', md: '5rem' },
              color: 'white',
              letterSpacing: -2,
              fontFamily: 'Outfit',
            }}
          >
            Visualizing{' '}
            <Box component="span" sx={{ color: 'primary.main' }}>
              technical
            </Box>{' '}
            growth.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Performance Optimization Chart */}
          <Grid item xs={12} lg={8}>
            <Box
              className="glass-card"
              sx={{
                p: 4,
                height: 500,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 6 }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: 'white',
                    fontWeight: 800,
                    fontFamily: 'Outfit',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <Activity color="#e11d48" size={24} /> Technical Growth
                </Typography>
                <Box
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: '100px',
                    bgcolor: 'rgba(225, 29, 72, 0.1)',
                    border: '1px solid rgba(225, 29, 72, 0.2)',
                    color: '#e11d48',
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 800 }}>
                    +45.2% Optimization
                  </Typography>
                </Box>
              </Stack>

              <Box
                sx={{
                  flexGrow: 1,
                  width: '100%',
                  minWidth: 200,
                  height: 350,
                  position: 'relative',
                }}
              >
                <ResponsiveContainer width="100%" height={350} debounce={50}>
                  <AreaChart
                    data={performanceData}
                    onMouseMove={handleChartHover}
                    onMouseLeave={() => setActiveLog(null)}
                  >
                    <defs>
                      <linearGradient id="colorOpt" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#e11d48" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.03)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      stroke="#475569"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      dy={10}
                    />
                    <YAxis
                      stroke="#475569"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      dx={-10}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#050507',
                        border: '1px solid rgba(225, 29, 72, 0.2)',
                        borderRadius: '12px',
                        color: 'white',
                      }}
                      itemStyle={{ color: '#e11d48' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="optimization"
                      stroke="#e11d48"
                      strokeWidth={3}
                      fill="url(#colorOpt)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          </Grid>

          {/* Proficiency Chart */}
          <Grid item xs={12} lg={4}>
            <Box
              className="glass-card"
              sx={{
                p: 4,
                height: 500,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: 'white',
                  fontWeight: 800,
                  fontFamily: 'Outfit',
                  mb: 6,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Zap color="#e11d48" size={24} /> Skill Proficiency
              </Typography>
              <Box
                sx={{
                  flexGrow: 1,
                  width: '100%',
                  minWidth: 200,
                  height: 350,
                  position: 'relative',
                }}
              >
                <ResponsiveContainer width="100%" height={350} debounce={50}>
                  <BarChart data={skillDistribution} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="name"
                      type="category"
                      stroke="#94a3b8"
                      fontSize={12}
                      width={80}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                      contentStyle={{
                        backgroundColor: '#050507',
                        border: '1px solid rgba(225, 29, 72, 0.1)',
                        borderRadius: '12px',
                      }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                      {skillDistribution.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill="#e11d48"
                          opacity={0.6 + (index / skillDistribution.length) * 0.4}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
              <Box sx={{ mt: 4 }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeLog || 'idle'}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: activeLog ? 'primary.main' : '#475569',
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        fontSize: '0.7rem',
                      }}
                    >
                      {activeLog || 'Hover over charts for details'}
                    </Typography>
                  </motion.div>
                </AnimatePresence>
              </Box>
            </Box>
          </Grid>

          {/* Stat Cards */}
          {systemStats.map((stat, i) => (
            <Grid item xs={6} md={3} key={i}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Box
                  className="glass-card"
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    borderBottom: `4px solid #e11d48`,
                    transition: '0.4s',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      borderColor: 'white',
                    },
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 900, mb: 1, color: 'white', fontFamily: 'Outfit' }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#64748b',
                      fontWeight: 800,
                      letterSpacing: 2,
                      textTransform: 'uppercase',
                      fontSize: '0.6rem',
                    }}
                  >
                    {stat.label.replace(/_/g, ' ')}
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
});

export default TechnicalInsight;
