/**
 * Axios configuration for API requests with auto-retry and extended timeout.
 */
import axios from 'axios';
import { API_BASE_URL } from '../config';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  timeout: 60000, // 60s timeout to allow Render free tier cold-starts to wake up
});

// Request Interceptor: Attach authentication tokens or telemetry headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('system_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor: Auto-retry on cold-start timeouts and network glitches
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const { config, response } = error;

    // Retry configuration
    if (config && (!config._retryCount || config._retryCount < 2)) {
      config._retryCount = (config._retryCount || 0) + 1;
      
      // Retry on network errors, timeouts, or 502/503/504 server starting codes
      const isNetworkError = !response || error.code === 'ECONNABORTED';
      const isServerWakingUp = response && [502, 503, 504].includes(response.status);

      if (isNetworkError || isServerWakingUp) {
        console.warn(`[Axios] API Retry attempt ${config._retryCount} for ${config.url}`);
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2s before retrying
        return axiosInstance(config);
      }
    }

    const status = response?.status;
    let message = 'Something went wrong. Please try again.';

    if (error.code === 'ECONNABORTED') {
      message = 'Request timed out while connecting to server.';
    } else if (!response) {
      message = 'Network error. Please check if the server is running.';
    } else {
      switch (status) {
        case 400:
          message = 'Bad request. Please check the data sent.';
          break;
        case 401:
          message = 'Unauthorized. Please login again.';
          localStorage.removeItem('system_token');
          break;
        case 403:
          message = 'Forbidden. You do not have permission.';
          break;
        case 404:
          message = 'Resource not found.';
          break;
        case 500:
          message = 'Internal server error. Please try again later.';
          break;
        default:
          message = response.data?.message || message;
      }
    }

    error.friendlyMessage = message;
    return Promise.reject(error);
  },
);

export default axiosInstance;
