import axios from 'axios';
import { getConfigByKey } from '../configLoader'; // Import getConfigByKey

// Function to get the token from localStorage
const getToken = () => {
  return localStorage.getItem('authToken');
};

// Function to remove the token from localStorage
const removeToken = () => {
  return localStorage.removeItem('authToken');
};

// Initialize Axios instance
const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

// Dynamically set the base URL after loading the configuration
const setBaseURL = async () => {
  try {
    const baseUrl = await getConfigByKey('API_BASE_URL');
    api.defaults.baseURL = baseUrl;
  } catch (error) {
    console.error('Error setting API base URL:', error);
  }
};

// Request interceptor to add token to headers
api.interceptors.request.use(
  (config) => {
    const token = getToken(); // Get token from localStorage
    if (token && config.url !== '/login') {
      config.headers['Authorization'] = `Bearer ${token}`; // Attach token if available
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (response) {
      const { status } = response;

      if (status === 401) {
        console.error(
          'Unauthorized: Token might be expired. Please log in again.'
        );
        handleTokenExpiration();
      } else if (status === 500) {
        console.error('Internal Server Error: Something went wrong.');
      } else if (status === 403) {
        console.error(
          'Forbidden: You do not have permission to access this resource.'
        );
      }
    } else {
      console.error('Network error or server is unreachable.');
    }

    return Promise.reject(error.response || error.message);
  }
);

// Function to handle token expiration
const handleTokenExpiration = () => {
  removeToken();
  window.location.href = '/login'; // Redirect user to login page
};

// Load the base URL on startup
setBaseURL();

export default api;
