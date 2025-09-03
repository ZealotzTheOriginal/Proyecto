// API configuration for different environments
const getApiBaseUrl = () => {
  // In production (Vercel), use relative URLs
  if (process.env.NODE_ENV === 'production') {
    return '/api';
  }
  
  // In development, use localhost
  return 'http://localhost:5000/api';
};

export const API_BASE_URL = getApiBaseUrl();
