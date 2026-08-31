import { useState, useEffect, useCallback } from 'react';
import fallbackProfile from '../data/fallbackProfile';
import socket from '../services/socket';
import {
  fetchBasicDetails,
  fetchSkills,
  fetchExperience,
  fetchProjects,
  fetchEducation,
  fetchSocials,
  fetchAdditionalInfo,
  fetchDocumentation,
  fetchCommonLayout,
  fetchAnalytics,
} from '../services/api';

/**
 * Hook to manage profile data loading via WebSockets & API.
 * Initializes with fallback data for instant 0ms screen rendering,
 * then hydrates with live WebSocket/API data in background.
 */
const useProfile = () => {
  // Initialize profile with instant fallback data to guarantee immediate rendering
  const [profile, setProfile] = useState(fallbackProfile);

  const hydrateFragment = useCallback((fragment) => {
    setProfile((prev) => ({ ...prev, ...fragment }));
  }, []);

  const fetchAllData = useCallback(async () => {
    try {
      // Load basic layout first
      const layout = await fetchCommonLayout();
      if (layout) {
        setProfile((prev) => ({ ...prev, ...layout }));
      }

      // Load remaining data in background
      const fragments = [
        { key: 'analytics', fetcher: fetchAnalytics },
        { key: 'documentation', fetcher: fetchDocumentation },
        { key: 'projects', fetcher: fetchProjects },
        { key: 'experience', fetcher: fetchExperience },
        { key: 'education', fetcher: fetchEducation },
        { key: 'basic', fetcher: fetchBasicDetails },
        { key: 'skills', fetcher: fetchSkills },
        { key: 'socials', fetcher: fetchSocials },
        { key: 'additional', fetcher: fetchAdditionalInfo },
      ];

      // Progressively hydrate the profile state
      for (const frag of fragments) {
        try {
          const data = await frag.fetcher();
          if (data) {
            const fragmentToMerge =
              Array.isArray(data) || frag.key === 'documentation' ? { [frag.key]: data } : data;
            hydrateFragment(fragmentToMerge);
          }
        } catch (err) {
          console.warn(`Fragment [${frag.key}] fetch warning:`, err.message);
        }
      }
    } catch (err) {
      console.warn('API sync warning (using fallback profile data):', err.message);
    }
  }, [hydrateFragment]);

  useEffect(() => {
    // 1. Initial REST API sync
    fetchAllData();

    // 2. High-speed WebSocket Real-time Sync
    if (socket) {
      socket.emit('requestProfile');
      socket.on('profileData', (wsData) => {
        if (wsData) {
          hydrateFragment(wsData);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('profileData');
      }
    };
  }, [fetchAllData, hydrateFragment]);

  return { profile, loading: false, error: null, errorType: null, retry: fetchAllData };
};

export default useProfile;
