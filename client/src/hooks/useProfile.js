import { useState, useEffect, useCallback } from 'react';
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
 * Hook to manage profile data loading.
 */
const useProfile = () => {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorType, setErrorType] = useState(null);

  const hydrateFragment = (fragment) => {
    setProfile((prev) => ({ ...prev, ...fragment }));
  };

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Load basic layout first
      const layout = await fetchCommonLayout();

      setProfile((prev) => ({ ...prev, ...layout }));

      // Initial load is "complete" once we have basic layout
      setLoading(false);

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
            // Logic: If the backend returns a direct array (like Projects or Experience),
            // or if it's the documentation fragment, we must wrap it in the correct key.
            const fragmentToMerge =
              Array.isArray(data) || frag.key === 'documentation' ? { [frag.key]: data } : data;
            hydrateFragment(fragmentToMerge);
          }
        } catch (err) {
          // Individual module failure shouldn't break the app
        }
      }
    } catch (err) {
      setError(err);
      setErrorType('network');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return { profile, loading, error, errorType, retry: fetchAllData };
};

export default useProfile;
