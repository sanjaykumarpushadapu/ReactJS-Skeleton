// api/axios.js
import axios from 'axios';
import { API_BASE_URL } from '../constants'; // Your API base URL

// Function to get the token from localStorage
const getToken = () => {
  return localStorage.getItem('authToken');
};

// Function to get the token from localStorage
const removeToken = () => {
  return localStorage.removeItem('authToken');
};

// Centralized Axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL, // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token to headers for every request except login
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

// Response interceptor for global error handling (e.g., unauthorized, server errors)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (response) {
      const { status } = response;

      // Handle Unauthorized (401) - Token might have expired or invalid
      if (status === 401) {
        console.error(
          'Unauthorized: Token might be expired. Please log in again.'
        );
        handleTokenExpiration(); // Clear token and redirect to login
      }

      // Handle Internal Server Error (500)
      if (status === 500) {
        console.error('Internal Server Error: Something went wrong.');
      }

      // Handle other errors if needed
      if (status === 403) {
        console.error(
          'Forbidden: You do not have permission to access this resource.'
        );
      }
    }

    // Handle network errors
    if (!response) {
      console.error('Network error or server is unreachable.');
    }

    return Promise.reject(error.response || error.message); // Reject with error
  }
);

// Function to handle token expiration
const handleTokenExpiration = () => {
  removeToken(); // Remove expired token from localStorage
  window.location.href = '/login'; // Redirect user to login page
};

export default api;
