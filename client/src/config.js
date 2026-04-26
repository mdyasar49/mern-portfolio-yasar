/**
 * App configuration.
 */

export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || (IS_PRODUCTION ? '/api' : 'http://localhost:5001/api');

export default API_BASE_URL;
