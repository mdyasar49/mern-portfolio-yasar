/**
 * API service layer.
 * Handles all network requests between React and Node.js.
 */
import axiosInstance from './axiosInstance';

// Main profile data


export const getProfileData = async () => {
  return await axiosInstance.get('/profile');
};

// Specific data fragments


// Fetches core profile info (name, title, summary, etc.)
export const fetchBasicDetails = async () => {
  const response = await axiosInstance.get('/profile/basicdetails');
  return response.payload || response;
};

// Fetches navigation menu items
export const fetchHeader = async () => {
  const response = await axiosInstance.get('/header');
  return response.payload || response;
};

// Fetches technical skills distribution
export const fetchSkills = async () => {
  const response = await axiosInstance.get('/profile/skills');
  return response.payload || response;
};

// Fetches professional work history
export const fetchExperience = async () => {
  const response = await axiosInstance.get('/profile/experience');
  return response.payload || response;
};

// Fetches portfolio project showcase
export const fetchProjects = async () => {
  const response = await axiosInstance.get('/profile/projects');
  return response.payload || response;
};

// Fetches academic qualifications
export const fetchEducation = async () => {
  const response = await axiosInstance.get('/profile/education');
  return response.payload || response;
};

// Fetches social media link tree
export const fetchSocials = async () => {
  const response = await axiosInstance.get('/profile/socials');
  return response.payload || response;
};

// Fetches availability and preferences
export const fetchAdditionalInfo = async () => {
  const response = await axiosInstance.get('/profile/additional');
  return response.payload || response;
};

// Fetches project documentation/README content
export const fetchDocumentation = async () => {
  const response = await axiosInstance.get('/docs');
  return response.payload || response;
};

// Fetches system-wide analytics data
export const fetchAnalytics = async () => {
  const response = await axiosInstance.get('/analytics');
  return response.payload || response;
};

// Fetches common layout data (Header/Footer)
export const fetchCommonLayout = async () => {
  const response = await axiosInstance.get('/common/layout');
  return response.payload || response;
};

/**
 * fetchFragment
 * @desc Retrieves a specific, atomic data module (e.g., skills, projects).
 * @param {string} type - The fragment identifier (basic_info, skills, etc.)
 */
export const fetchFragment = async (type) => {
  try {
    const response = await axiosInstance.get(`/fragments/${type}`);
    // If the backend uses the standard { success, payload } wrapper
    if (response && response.payload !== undefined) {
      return response.payload;
    }
    // Fallback for direct array/object responses
    return response;
  } catch (error) {
    console.error(`Error fetching fragment [${type}]:`, error.message);
    return null;
  }
};

/**
 * fetchSystemAnalytics
 * @desc Retrieves visitor counts and hit history.
 * @param {boolean} increment - If true, the backend will count this as a new unique visit.
 */
export const fetchSystemAnalytics = async (increment = false) => {
  try {
    return await axiosInstance.get(`/visitors${increment ? '?inc=true' : ''}`);
  } catch (error) {
    return { success: false, count: 0, history: [] };
  }
};

/**
 * Simple health check.
 */
export const checkHealth = async () => {
  try {
    return await axiosInstance.get('/health');
  } catch (error) {
    return { success: false, status: 'offline' };
  }
};

/**
 * submitContactMessage
 * @desc Sends contact form data to the backend system.
 * @param {Object} payload - { name, email, subject, message }
 */
export const submitContactMessage = async (payload) => {
  try {
    return await axiosInstance.post('/contact', payload);
  } catch (error) {
    return {
      success: false,
      message: error.friendlyMessage || 'Unable to send message. Please try again.',
    };
  }
};

/**
 * fetchMessageLogs
 * @desc Retrieves the list of messages sent through the contact form.
 */
export const fetchMessageLogs = async () => {
  return await axiosInstance.get('/contact');
};

export default axiosInstance;
