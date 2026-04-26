/**
 * Axios configuration for API requests.
 */
import axios from 'axios';
import { API_BASE_URL } from '../config';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  timeout: 15000, // 15s timeout for high-latency environments
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

// Response Interceptor: Standardize data extraction and global error handling
axiosInstance.interceptors.response.use(
  (response) => {
    // Automatically return the data payload for cleaner service calls
    return response.data;
  },
  (error) => {
    const status = error.response?.status;
    let message = 'Something went wrong. Please try again.';

    if (error.code === 'ECONNABORTED') {
      message = 'Request timed out. Please check your connection.';
    } else if (!error.response) {
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
          message = error.response.data?.message || message;
      }
    }

    // Attach human-friendly message to error object
    error.friendlyMessage = message;
    
    return Promise.reject(error);
  },
);

export default axiosInstance;
