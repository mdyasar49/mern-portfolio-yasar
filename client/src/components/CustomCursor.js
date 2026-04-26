/**
 * Language: JavaScript (React.js)
 * Purpose of this file:
 * This component renders a custom high-tech cursor that follows the user's mouse.
 * It features a "Lag-trail" effect and a "Scanner Ring" that reacts to interactions.
 */

import React, { useState, useEffect, useRef } from 'react';

import { Box, Typography } from '@mui/material';

const CustomCursor = () => {
  const mainCursorRef = useRef(null);
  const trailingCursorRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [cursorText, setCursorText] = useState('');

  useEffect(() => {
    const main = mainCursorRef.current;
    const trail = trailingCursorRef.current;
    if (!main || !trail) return;

    let mouseX = 0;
    let mouseY = 0;
    let trailX = 0;
    let trailY = 0;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      main.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    };

    const handleMouseOver = (e) => {
      const interactive = e.target.closest('button, a, [role="button"], .interactive');
      if (interactive) {
        setIsHovered(true);
        // Special labels for certain elements
        if (interactive.tagName === 'A' || interactive.classList.contains('view-trigger')) {
          setCursorText('');
        }
      } else {
        setIsHovered(false);
        setCursorText('');
      }
    };

    const animate = () => {
      // Smooth interpolation for the trail
      trailX += (mouseX - trailX) * 0.15;
      trailY += (mouseY - trailY) * 0.15;
      trail.style.transform = `translate3d(${trailX}px, ${trailY}px, 0)`;

      requestAnimationFrame(animate);
    };

    const handleMessage = (e) => {
      if (e.data?.type === 'IFRAME_MOUSE_MOVE') {
        const iframe = document.getElementById('resume-frame');
        if (iframe) {
          const rect = iframe.getBoundingClientRect();
          mouseX = rect.left + e.data.x;
          mouseY = rect.top + e.data.y;
          main.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        }
      } else if (e.data?.type === 'IFRAME_MOUSE_OVER') {
        setIsHovered(e.data.isHovered);
        setCursorText('');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('message', handleMessage);
    const animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('message', handleMessage);
      cancelAnimationFrame(animId);
    };
  }, []);

  const indigo = '#e11d48';

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 100000,
        pointerEvents: 'none',
        display: { xs: 'none', md: 'block' },
      }}
    >
      {/* ── [PRECISION_ANCHOR] ── */}
      <div
        ref={mainCursorRef}
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: isHovered ? 'white' : indigo,
          position: 'absolute',
          top: -4,
          left: -4,
          zIndex: 2,
          transition: 'background-color 0.3s ease, scale 0.3s ease',
          scale: isHovered ? 0.5 : 1,
          mixBlendMode: 'difference',
        }}
      />

      {/* ── [KINETIC_AURA] ── */}
      <div
        ref={trailingCursorRef}
        style={{
          width: isHovered ? 80 : 36,
          height: isHovered ? 80 : 36,
          borderRadius: '50%',
          border: isHovered ? '1px solid rgba(255,255,255,0.2)' : `1.5px solid ${indigo}`,
          position: 'absolute',
          top: isHovered ? -40 : -18,
          left: isHovered ? -40 : -18,
          zIndex: 1,
          transition:
            'width 0.4s cubic-bezier(0.23, 1, 0.32, 1), height 0.4s cubic-bezier(0.23, 1, 0.32, 1), top 0.4s cubic-bezier(0.23, 1, 0.32, 1), left 0.4s cubic-bezier(0.23, 1, 0.32, 1), background-color 0.3s ease',
          backgroundColor: isHovered ? 'rgba(255,255,255,0.05)' : 'transparent',
          backdropFilter: isHovered ? 'blur(4px)' : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isHovered && cursorText && (
          <Typography
            sx={{
              color: 'white',
              fontSize: '0.6rem',
              fontWeight: 900,
              letterSpacing: 1,
              fontFamily: 'Outfit',
              textTransform: 'uppercase',
              opacity: 1,
            }}
          >
            {cursorText}
          </Typography>
        )}
      </div>

      <style>{`
        @media (min-width: 900px) {
          body { cursor: none !important; }
          a, button, [role="button"], .interactive, .MuiButtonBase-root { cursor: none !important; }
        }
      `}</style>
    </Box>
  );
};

export default CustomCursor;
