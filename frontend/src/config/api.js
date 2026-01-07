import axios from 'axios';
import { auth } from './firebase';
import toast from 'react-hot-toast';

// API URL Configuration
// For mobile access, set VITE_API_URL in .env to your network IP
// Example: VITE_API_URL=http://192.168.1.100:5000
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

console.log('🌐 API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
  withCredentials: true, // Enable credentials for CORS
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  try {
    // Get fresh token from Firebase
    const currentUser = auth.currentUser;
    if (currentUser) {
      const token = await currentUser.getIdToken(true); // Force refresh
      config.headers.Authorization = `Bearer ${token}`;
      localStorage.setItem('authToken', token);
    } else {
      // Fallback to stored token
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (error) {
    console.error('Error getting auth token:', error);
    // Try to use stored token as fallback
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      console.error('Request timeout:', error);
      toast.error('Request timed out. Please check your connection.');
    } else if (error.code === 'ERR_NETWORK' || !error.response) {
      console.error('Network error:', error);
      toast.error(
        'Cannot connect to server. Ensure backend is running and you\'re on the same network.',
        { duration: 5000 }
      );
    } else if (error.response) {
      // Server responded with error
      const status = error.response.status;
      const message = error.response.data?.error || error.response.data?.message || 'An error occurred';
      
      console.error('API Error:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url
      });
      
      if (status === 401) {
        // Don't show toast for auth errors, let components handle it
        console.error('Unauthorized');
      } else if (status === 403) {
        toast.error('Access forbidden');
      } else if (status === 404) {
        toast.error('Resource not found');
      } else if (status >= 500) {
        toast.error('Server error. Please try again later.');
      }
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.message);
      toast.error('No response from server. Check your connection.');
    } else {
      // Something else happened
      console.error('Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
