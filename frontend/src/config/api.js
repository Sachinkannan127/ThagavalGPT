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
  withCredentials: false, // Disable for mobile - causes issues with network IPs
});

// Test backend connection on initialization
const testConnection = async () => {
  try {
    const response = await axios.get(`${API_URL}/health`, { timeout: 5000 });
    console.log('✅ Backend connection successful:', response.data);
  } catch (error) {
    console.error('❌ Backend connection failed:', error.message);
    console.error('🔧 Check: 1) Backend is running 2) Same WiFi network 3) Correct VITE_API_URL');
  }
};
testConnection();

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

// Retry logic for mobile network issues
let retryCount = 0;
const MAX_RETRIES = 2;

api.interceptors.response.use(
  (response) => {
    retryCount = 0; // Reset on success
    return response;
  },
  async (error) => {
    const config = error.config;
    
    // Retry for network errors on mobile
    if ((error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') && 
        config && retryCount < MAX_RETRIES) {
      retryCount++;
      console.log(`🔄 Retrying request (${retryCount}/${MAX_RETRIES})...`);
      await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
      return api(config);
    }
    
    retryCount = 0; // Reset retry count
    
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      console.error('Request timeout:', error);
      toast.error('Request timed out. Please check your connection.');
    } else if (error.code === 'ERR_NETWORK' || !error.response) {
      console.error('Network error:', error);
      toast.error(
        `Cannot connect to ${API_URL}. Check: 1) Backend running 2) Same WiFi 3) Correct IP`,
        { duration: 6000 }
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
