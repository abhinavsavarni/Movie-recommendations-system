// API Configuration for connecting to deployed backend
const API_CONFIG = {
  // Development - local backend
  development: {
    baseURL: 'http://localhost:5000',
  },
  // Production - Render backend
  production: {
    baseURL: process.env.REACT_APP_BACKEND_URL || 'https://movie-recommendations-system-54fn.onrender.com',
  },
};

// Get current environment
const isDevelopment = process.env.NODE_ENV === 'development';
const currentConfig = isDevelopment ? API_CONFIG.development : API_CONFIG.production;

export const API_BASE_URL = currentConfig.baseURL;
export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
}; 