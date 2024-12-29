import axios from 'axios';
import { API_BASE_URL, TIMEOUT } from '../constants';

// Create an Axios instance with base URL and timeout settings
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to get the token from localStorage
const getToken = () => {
  return localStorage.getItem('authToken');
};

// Request interceptor to add the token to the headers for every request except login
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && config.url !== '/login') {
      config.headers['Authorization'] = `Bearer ${token}`;
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
    if (error.response) {
      if (error.response.status === 401) {
        console.error(
          'Unauthorized: Token might be expired. Please log in again.'
        );
      }
      if (error.response.status === 500) {
        console.error('Internal Server Error: Something went wrong.');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
